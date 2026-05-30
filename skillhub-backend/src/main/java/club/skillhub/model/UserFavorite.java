package club.skillhub.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "user_favorites")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserFavorite {

    @EmbeddedId
    @Builder.Default
    private UserFavoriteId id = new UserFavoriteId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("skillId")
    @JoinColumn(name = "skill_id")
    private Skill skill;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Embeddable
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode
    public static class UserFavoriteId implements java.io.Serializable {
        @Column(name = "user_id")
        private Long userId;

        @Column(name = "skill_id")
        private Long skillId;
    }
}
