package club.skillhub.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public record CreateSkillRequest(
    @NotBlank @Size(max = 200) String name,
    @NotBlank String description,
    @NotBlank String content,
    Long categoryId,
    @NotBlank String version,
    List<String> compatibleAgents,
    List<Long> tagIds,
    String thumbnailUrl
) {}
