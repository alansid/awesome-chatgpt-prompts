package club.skillhub.dto;

import club.skillhub.model.User;

import java.time.OffsetDateTime;

public record UserDTO(
    Long id,
    String username,
    String email,
    String displayName,
    String avatarUrl,
    Integer credits,
    String role,
    OffsetDateTime createdAt
) {
    public static UserDTO from(User user) {
        return new UserDTO(
            user.getId(), user.getUsername(), user.getEmail(),
            user.getDisplayName(), user.getAvatarUrl(),
            user.getCredits(), user.getRole(), user.getCreatedAt()
        );
    }
}
