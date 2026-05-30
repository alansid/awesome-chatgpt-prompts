package club.skillhub.controller;

import club.skillhub.dto.*;
import club.skillhub.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    @GetMapping
    public ResponseEntity<Page<SkillSummaryDTO>> list(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "trending") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(skillService.findAll(categoryId, sort, page, size));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<SkillSummaryDTO>> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(skillService.search(q, page, size));
    }

    @GetMapping("/trending")
    public ResponseEntity<Page<SkillSummaryDTO>> trending(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(skillService.findTrending(page, size));
    }

    @GetMapping("/latest")
    public ResponseEntity<Page<SkillSummaryDTO>> latest(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(skillService.findLatest(page, size));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<SkillDetailDTO> detail(@PathVariable String slug) {
        return ResponseEntity.ok(skillService.findBySlug(slug));
    }

    @PostMapping
    public ResponseEntity<SkillDetailDTO> create(
            @Valid @RequestBody CreateSkillRequest req,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(skillService.create(req, user.getUsername()));
    }

    @PostMapping("/{id}/publish")
    public ResponseEntity<SkillDetailDTO> publish(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(skillService.publish(id, user.getUsername()));
    }

    @PostMapping("/{id}/install")
    public ResponseEntity<Void> install(@PathVariable Long id) {
        skillService.install(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<java.util.Map<String, Boolean>> favorite(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {
        boolean added = skillService.toggleFavorite(id, user.getUsername());
        return ResponseEntity.ok(java.util.Map.of("favorited", added));
    }

    @GetMapping("/favorites")
    public ResponseEntity<Page<SkillSummaryDTO>> favorites(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(skillService.findFavorites(user.getUsername(), page, size));
    }
}
