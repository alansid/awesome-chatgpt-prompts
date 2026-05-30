package club.skillhub.dto;

import club.skillhub.model.Collection;

import java.time.OffsetDateTime;
import java.util.List;

public record CollectionDTO(
    Long id,
    String name,
    String slug,
    String description,
    Boolean isFeatured,
    String authorUsername,
    OffsetDateTime createdAt,
    List<SkillSummaryDTO> skills
) {
    public static CollectionDTO from(Collection c) {
        return new CollectionDTO(
            c.getId(), c.getName(), c.getSlug(), c.getDescription(),
            c.getIsFeatured(),
            c.getAuthor() != null ? c.getAuthor().getUsername() : null,
            c.getCreatedAt(),
            c.getCollectionSkills().stream()
                .map(cs -> SkillSummaryDTO.from(cs.getSkill()))
                .toList()
        );
    }
}
