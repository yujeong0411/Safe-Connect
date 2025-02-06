package c207.camference.db.entity.patient;

import c207.camference.db.entity.firestaff.DispatchGroup;
import c207.camference.db.entity.report.Call;
import c207.camference.db.entity.report.Dispatch;
import c207.camference.db.entity.report.Transfer;
import c207.camference.db.entity.users.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "patient")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patient_id", nullable = false)
    @Comment(value = "환자ID")
    private Integer patientId;

    @Column(name = "call_id", nullable = false)
    @Comment(value = "신고ID")
    private Integer callId;

    @Column(name = "dispatch_id")
    @Comment(value = "출동 ID")
    private Integer dispatchId;

    @Column(name = "transfer_id")
    @Comment(value = "병원이송 ID")
    private Integer transferId;

    @Column(name = "user_id")
    @Comment(value = "일반회원ID")
    private Integer userId;

    @Column(name = "patient_is_user")
    @Comment(value = "서비스가입여부")
    private Boolean patientIsUser = false;

    @Column(name = "patient_name", length = 45)
    @Comment(value = "이름")
    private String patientName;

    @Column(name = "patient_gender", length = 1)
    @Comment(value = "성별(남성:F, 여성:M)")
    private Character patientGender;

    @Column(name = "patient_age", length = 1)
    @Comment(value = "나이 (10 단위로 앞자리 숫자 이용)")
    private String patientAge;

    @Column(name = "patient_blood_sugar", nullable = false)
    @Comment(value = "혈당")
    private Integer patientBloodSugar = 0;

    @Column(name = "patient_diastolic_bld_press", nullable = false)
    @Comment(value = "혈압최소")
    private Integer patientDiastolicBldPress = 0;

    @Column(name = "patient_systolic_bld_press", nullable = false)
    @Comment(value = "혈압최대")
    private Integer patientSystolicBldPress = 0;

    @Column(name = "patient_pulse_rate", nullable = false)
    @Comment(value = "호흡수")
    private Integer patientPulseRate = 0;

    @Column(name = "patient_temperature", nullable = false)
    @Comment(value = "체온")
    private Float patientTemperature = 0.0f;

    @Column(name = "patient_spo2", nullable = false)
    @Comment(value = "산소포화도")
    private Float patientSpo2 = 0.0f;

    @Column(name = "patient_mental", nullable = false, length = 1)
    @Comment(value = "의식상태(A: alert, V : verbal , P : painful, U : unresponsive)")
    private String patientMental = "A";

    @Column(name = "patient_pre_ktas", length = 1)
    @Comment(value = "preKTAS")
    private String patientPreKtas;

    @Column(name = "patient_sympthom", columnDefinition = "TEXT")
    @Comment(value = "증상")
    private String patientSympthom;

    @CreationTimestamp
    @Column(name = "patient_created_at", nullable = false)
    @Comment(value = "생성 시각")
    private LocalDateTime patientCreatedAt;

    @Column(name = "patient_info_created_at")
    @Comment(value = "상태 생성 시각(혈당, 혈압, 최소,최대, 증상 등이 생성된 시간)")
    private LocalDateTime patientInfoCreatedAt;

    @ManyToOne
    @JoinColumn(name = "call_id", insertable = false, updatable = false)
    private Call call;

    @ManyToOne
    @JoinColumn(name = "dispatch_id", insertable = false, updatable = false)
    @Comment(value = "출동 ID")
    private Dispatch dispatch;

    @ManyToOne
    @JoinColumn(name = "transfer_id", insertable = false, updatable = false)
    @Comment(value = "이송 ID")
    private Transfer transfer;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    @Comment(value = "일반회원ID")
    private User user;

    @ManyToOne
    @JoinColumn(name = "dispatch_id", insertable = false, updatable = false)
    private DispatchGroup dispatchGroup;
}