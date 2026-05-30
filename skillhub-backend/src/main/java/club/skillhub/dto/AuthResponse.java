package club.skillhub.dto;

public record AuthResponse(
    String token,
    String tokenType,
    UserDTO user
) {
    public AuthResponse(String token, UserDTO user) {
        this(token, "Bearer", user);
    }
}
