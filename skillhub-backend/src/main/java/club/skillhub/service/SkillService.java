package club.skillhub.service;

import club.skillhub.dto.*;
import club.skillhub.model.*;
import club.skillhub.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final UserFavoriteRepository favoriteRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<SkillSummaryDTO> findAll(Long categoryId, String sort, int page, int size) {
        Pageable pageable = buildPageable(sort, page, size);
        Page<Skill> skills = categoryId != null
            ? skillRepository.findByIsPublishedTrueAndCategoryId(categoryId, pageable)
            : skillRepository.findByIsPublishedTrue(pageable);
        return skills.map(SkillSummaryDTO::from);
    }

    @Transactional(readOnly = true)
    public SkillDetailDTO findBySlug(String slug) {
        return skillRepository.findBySlug(slug)
            .filter(Skill::getIsPublished)
            .map(SkillDetailDTO::from)
            .orElseThrow(() -> new EntityNotFoundException("Skill not found: " + slug));
    }

    @Transactional(readOnly = true)
    public Page<SkillSummaryDTO> search(String query, int page, int size) {
        return skillRepository.search(query, PageRequest.of(page, size))
            .map(SkillSummaryDTO::from);
    }

    @Transactional(readOnly = true)
    public Page<SkillSummaryDTO> findTrending(int page, int size) {
        return skillRepository.findTrending(PageRequest.of(page, size))
            .map(SkillSummaryDTO::from);
    }

    @Transactional(readOnly = true)
    public Page<SkillSummaryDTO> findLatest(int page, int size) {
        return skillRepository.findLatest(PageRequest.of(page, size))
            .map(SkillSummaryDTO::from);
    }

    @Transactional(readOnly = true)
    public Page<SkillSummaryDTO> findByAuthor(Long authorId, int page, int size) {
        return skillRepository.findByAuthorId(authorId, PageRequest.of(page, size))
            .map(SkillSummaryDTO::from);
    }

    @Transactional
    public SkillDetailDTO create(CreateSkillRequest req, String username) {
        var author = userRepository.findByUsername(username)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        var slug = generateSlug(req.name(), username);

        var skill = Skill.builder()
            .name(req.name())
            .slug(slug)
            .description(req.description())
            .content(req.content())
            .author(author)
            .version(req.version())
            .compatibleAgents(req.compatibleAgents() != null ? req.compatibleAgents() : java.util.List.of())
            .thumbnailUrl(req.thumbnailUrl())
            .isPublished(false)
            .build();

        if (req.categoryId() != null) {
            categoryRepository.findById(req.categoryId()).ifPresent(skill::setCategory);
        }

        if (req.tagIds() != null && !req.tagIds().isEmpty()) {
            var tags = new HashSet<>(tagRepository.findAllById(req.tagIds()));
            skill.setTags(tags);
        }

        return SkillDetailDTO.from(skillRepository.save(skill));
    }

    @Transactional
    public SkillDetailDTO publish(Long skillId, String username) {
        var skill = getOwnedSkill(skillId, username);
        skill.setIsPublished(true);
        return SkillDetailDTO.from(skillRepository.save(skill));
    }

    @Transactional
    public void install(Long skillId) {
        skillRepository.incrementInstallCount(skillId);
    }

    @Transactional
    public boolean toggleFavorite(Long skillId, String username) {
        var user = userRepository.findByUsername(username).orElseThrow();
        var favoriteId = new UserFavorite.UserFavoriteId(user.getId(), skillId);
        if (favoriteRepository.existsById(favoriteId)) {
            favoriteRepository.deleteById(favoriteId);
            return false;
        }
        var skill = skillRepository.findById(skillId)
            .orElseThrow(() -> new EntityNotFoundException("Skill not found"));
        favoriteRepository.save(UserFavorite.builder().user(user).skill(skill).build());
        return true;
    }

    @Transactional(readOnly = true)
    public Page<SkillSummaryDTO> findFavorites(String username, int page, int size) {
        var user = userRepository.findByUsername(username).orElseThrow();
        return skillRepository.findFavoritesByUserId(user.getId(), PageRequest.of(page, size))
            .map(SkillSummaryDTO::from);
    }

    private Skill getOwnedSkill(Long skillId, String username) {
        var skill = skillRepository.findById(skillId)
            .orElseThrow(() -> new EntityNotFoundException("Skill not found"));
        if (!skill.getAuthor().getUsername().equals(username))
            throw new IllegalArgumentException("Not authorized");
        return skill;
    }

    private Pageable buildPageable(String sort, int page, int size) {
        return switch (sort != null ? sort : "trending") {
            case "latest"   -> PageRequest.of(page, size, Sort.by("createdAt").descending());
            case "installs" -> PageRequest.of(page, size, Sort.by("installCount").descending());
            default         -> PageRequest.of(page, size, Sort.by("installCount").descending());
        };
    }

    private String generateSlug(String name, String username) {
        String base = (username + "-" + name)
            .toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("-+", "-");
        String slug = base;
        int i = 1;
        while (skillRepository.findBySlug(slug).isPresent()) {
            slug = base + "-" + i++;
        }
        return slug;
    }
}
