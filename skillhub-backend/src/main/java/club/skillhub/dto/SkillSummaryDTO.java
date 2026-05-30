package club.skillhub.dto;

import club.skillhub.model.Skill;

import java.math.BigDecimal;
import java.util.List;

public record SkillSummaryDTO(
    Long id,
    String slug,
    String name,
    String description,
    String authorUsername,
    String categoryName,
    String categorySlug,
    String version,
    Integer installCount,
    BigDecimal aiScore,
    String thumbnailUrl,
    List<String> tags,
    List<String> compatibleAgents
) {
    public static SkillSummaryDTO from(Skill skill) {
        return new SkillSummaryDTO(
            skill.getId(), skill.getSlug(), skill.getName(),
            skill.getDescription(),
            skill.getAuthor() != null ? skill.getAuthor().getUsername() : null,
            skill.getCategory() != null ? skill.getCategory().getName() : null,
            skill.getCategory() != null ? skill.getCategory().getSlug() : null,
            skill.getVersion(), skill.getInstallCount(), skill.getAiScore(),
            skill.getThumbnailUrl(),
            skill.getTags().stream().map(t -> t.getName()).toList(),
            skill.getCompatibleAgents()
        );
    }
}
