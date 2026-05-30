package club.skillhub.dto;

import club.skillhub.model.Category;

public record CategoryDTO(Long id, String name, String slug, String description, String icon) {
    public static CategoryDTO from(Category c) {
        return new CategoryDTO(c.getId(), c.getName(), c.getSlug(), c.getDescription(), c.getIcon());
    }
}
