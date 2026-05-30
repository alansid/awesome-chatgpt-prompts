package club.skillhub.service;

import club.skillhub.dto.UserDTO;
import club.skillhub.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserDTO findByUsername(String username) {
        return userRepository.findByUsername(username)
            .map(UserDTO::from)
            .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
    }

    @Transactional(readOnly = true)
    public UserDTO findById(Long id) {
        return userRepository.findById(id)
            .map(UserDTO::from)
            .orElseThrow(() -> new EntityNotFoundException("User not found: " + id));
    }

    @Transactional
    public UserDTO updateProfile(String username, String displayName, String avatarUrl) {
        var user = userRepository.findByUsername(username)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));
        if (displayName != null) user.setDisplayName(displayName);
        if (avatarUrl != null)   user.setAvatarUrl(avatarUrl);
        return UserDTO.from(userRepository.save(user));
    }
}
