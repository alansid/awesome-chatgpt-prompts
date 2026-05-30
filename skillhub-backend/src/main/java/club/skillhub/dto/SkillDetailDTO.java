package club.skillhub.dto;

import club.skillhub.model.Skill;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

public record SkillDetailDTO(
    Long id,
    String slug,
    String name,
    String description,
    String content,
    String authorUsername,
    String authorDisplayName,
    String categoryName,
    String categorySlug,
    String version,
    Integer installCount,
    Boolean isPublished,
    BigDecimal aiScore,
    String thumbnailUrl,
    List<String> tags,
    List<String> compatibleAgents,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
    public static SkillDetailDTO from(Skill skill) {
        return new SkillDetailDTO(
            skill.getId(), skill.getSlug(), skill.getName(),
            skill.getDescription(), skill.getContent(),
            skill.getAuthor() != null ? skill.getAuthor().getUsername() : null,
            skill.getAuthor() != null ? skill.getAuthor().getDisplayName() : null,
            skill.getCategory() != null ? skill.getCategory().getName() : null,
            skill.getCategory() != null ? skill.getCategory().getSlug() : null,
            skill.getVersion(), skill.getInstallCount(), skill.getIsPublished(),
            skill.getAiScore(), skill.getThumbnailUrl(),
            skill.getTags().stream().map(t -> t.getName()).toList(),
            skill.getCompatibleAgents(),
            skill.getCreatedAt(), skill.getUpdatedAt()
        );
    }
}
