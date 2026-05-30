package club.skillhub.controller;

import club.skillhub.dto.*;
import club.skillhub.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final SkillService skillService;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> me(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(userService.findByUsername(user.getUsername()));
    }

    @PatchMapping("/me")
    public ResponseEntity<UserDTO> updateProfile(
            @AuthenticationPrincipal UserDetails user,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(userService.updateProfile(
            user.getUsername(), body.get("displayName"), body.get("avatarUrl")));
    }

    @GetMapping("/me/skills")
    public ResponseEntity<Page<SkillSummaryDTO>> mySkills(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        var userDTO = userService.findByUsername(user.getUsername());
        return ResponseEntity.ok(skillService.findByAuthor(userDTO.id(), page, size));
    }

    @GetMapping("/{username}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String username) {
        return ResponseEntity.ok(userService.findByUsername(username));
    }
}
