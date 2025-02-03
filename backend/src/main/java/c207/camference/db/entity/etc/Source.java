package c207.camference.db.entity.etc;
import c207.camference.db.entity.patient.Patient;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
@Entity
@Table(name = "source")
@Data
@NoArgsConstructor
public class Source {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "source_id")
    @Comment(value = "자료ID")
    private Integer sourceId;

    @Column(name = "patient_id", nullable = false)
    @Comment(value = "환자ID")
    private Integer patientId;

    @Column(name = "source_name", length = 50, nullable = false)
    @Comment(value = "이름")
    private String sourceName;

    @Column(name = "source_server_name", length = 100, nullable = false)
    @Comment(value = "서버이름")
    private String sourceServerName;

    @Column(name = "source_url", length = 255, nullable = false)
    @Comment(value = "url")
    private String sourceUrl;

    @CreationTimestamp
    @Column(name = "source_created_at", nullable = false)
    @Comment(value = "생성시간")
    private LocalDateTime sourceCreatedAt;

    @UpdateTimestamp
    @Column(name = "source_updated_at", nullable = false)
    @Comment(value = "수정시간")
    private LocalDateTime sourceUpdatedAt;

    @ManyToOne
    @JoinColumn(name = "patient_id", insertable = false, updatable = false)
    private Patient patient;
}
