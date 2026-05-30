package club.skillhub.service;

import club.skillhub.dto.*;
import club.skillhub.model.User;
import club.skillhub.repository.UserRepository;
import club.skillhub.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.username()))
            throw new IllegalArgumentException("Username already taken");
        if (userRepository.existsByEmail(req.email()))
            throw new IllegalArgumentException("Email already registered");

        var user = User.builder()
            .username(req.username())
            .email(req.email())
            .password(passwordEncoder.encode(req.password()))
            .displayName(req.displayName() != null ? req.displayName() : req.username())
            .build();

        userRepository.save(user);
        var token = generateToken(user.getUsername());
        return new AuthResponse(token, UserDTO.from(user));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(AuthRequest req) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.usernameOrEmail(), req.password()));

        var user = userRepository.findByUsernameOrEmail(req.usernameOrEmail(), req.usernameOrEmail())
            .orElseThrow();
        var token = generateToken(user.getUsername());
        return new AuthResponse(token, UserDTO.from(user));
    }

    private String generateToken(String username) {
        var userDetails = userDetailsService.loadUserByUsername(username);
        return jwtUtil.generateToken(userDetails);
    }
}
