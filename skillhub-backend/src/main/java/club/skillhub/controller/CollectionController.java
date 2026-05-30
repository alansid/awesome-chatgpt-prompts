package club.skillhub.controller;

import club.skillhub.dto.CollectionDTO;
import club.skillhub.service.CollectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collections")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService collectionService;

    @GetMapping("/featured")
    public ResponseEntity<List<CollectionDTO>> featured() {
        return ResponseEntity.ok(collectionService.findFeatured());
    }

    @GetMapping
    public ResponseEntity<Page<CollectionDTO>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(collectionService.findAll(page, size));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<CollectionDTO> detail(@PathVariable String slug) {
        return ResponseEntity.ok(collectionService.findBySlug(slug));
    }
}
