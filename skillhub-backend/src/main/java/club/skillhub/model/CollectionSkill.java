package club.skillhub.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "collection_skills")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CollectionSkill {

    @EmbeddedId
    @Builder.Default
    private CollectionSkillId id = new CollectionSkillId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("collectionId")
    @JoinColumn(name = "collection_id")
    private Collection collection;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("skillId")
    @JoinColumn(name = "skill_id")
    private Skill skill;

    @Column(name = "sort_order", nullable = false)
    @Builder.Default
    private Integer sortOrder = 0;

    @Embeddable
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode
    public static class CollectionSkillId implements java.io.Serializable {
        @Column(name = "collection_id")
        private Long collectionId;

        @Column(name = "skill_id")
        private Long skillId;
    }
}
