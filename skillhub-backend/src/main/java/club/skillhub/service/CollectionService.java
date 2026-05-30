package club.skillhub.service;

import club.skillhub.dto.CollectionDTO;
import club.skillhub.repository.CollectionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CollectionService {

    private final CollectionRepository collectionRepository;

    @Transactional(readOnly = true)
    public List<CollectionDTO> findFeatured() {
        return collectionRepository.findByIsFeaturedTrue()
            .stream().map(CollectionDTO::from).toList();
    }

    @Transactional(readOnly = true)
    public Page<CollectionDTO> findAll(int page, int size) {
        return collectionRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()))
            .map(CollectionDTO::from);
    }

    @Transactional(readOnly = true)
    public CollectionDTO findBySlug(String slug) {
        return collectionRepository.findBySlug(slug)
            .map(CollectionDTO::from)
            .orElseThrow(() -> new EntityNotFoundException("Collection not found: " + slug));
    }
}
