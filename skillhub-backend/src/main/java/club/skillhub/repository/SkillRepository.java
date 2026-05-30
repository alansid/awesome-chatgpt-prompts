package club.skillhub.repository;

import club.skillhub.model.Skill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    Optional<Skill> findBySlug(String slug);

    Page<Skill> findByIsPublishedTrue(Pageable pageable);

    Page<Skill> findByIsPublishedTrueAndCategoryId(Long categoryId, Pageable pageable);

    Page<Skill> findByAuthorId(Long authorId, Pageable pageable);

    @Query("""
        SELECT s FROM Skill s
        WHERE s.isPublished = true
          AND (LOWER(s.name) LIKE LOWER(CONCAT('%', :q, '%'))
            OR LOWER(s.description) LIKE LOWER(CONCAT('%', :q, '%')))
        """)
    Page<Skill> search(@Param("q") String query, Pageable pageable);

    @Query("SELECT s FROM Skill s WHERE s.isPublished = true ORDER BY s.installCount DESC")
    Page<Skill> findTrending(Pageable pageable);

    @Query("SELECT s FROM Skill s WHERE s.isPublished = true ORDER BY s.createdAt DESC")
    Page<Skill> findLatest(Pageable pageable);

    @Modifying
    @Query("UPDATE Skill s SET s.installCount = s.installCount + 1 WHERE s.id = :id")
    void incrementInstallCount(@Param("id") Long id);

    @Query("""
        SELECT s FROM Skill s
        JOIN s.favoritedBy f
        WHERE f.user.id = :userId
        """)
    Page<Skill> findFavoritesByUserId(@Param("userId") Long userId, Pageable pageable);
}
