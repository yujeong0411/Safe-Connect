//
//// Caller.java
//@Entity
//@Table(name = "caller")
//@Getter @Setter
//@NoArgsConstructor
//public class Caller {
//    @Id
//    @Column(name = "caller_id", nullable = false, comment = "신고자ID")
//    private Integer callerId;
//
//    @Column(name = "user_id", comment = "일반회원ID")
//    private Integer userId;
//
//    @Column(name = "caller_is_user", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE", comment = "회원여부")
//    private Boolean callerIsUser = false;
//
//    @Column(name = "caller_name", length = 45, comment = "이름")
//    private String callerName;
//
//    @Column(name = "caller_phone", nullable = false, length = 13, comment = "전화번호")
//    private String callerPhone;
//
//    @Column(name = "caller_is_location_accept", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE", comment = "위치정보 동의 여부")
//    private Boolean callerIsLocationAccept = false;
//
//    @Column(name = "caller_accepted_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT NOW()", comment = "위치정보 동의시각")
//    private LocalDateTime callerAcceptedAt;
//
//    @Column(name = "caller_created_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT NOW()", comment = "생성시간")
//    private LocalDateTime callerCreatedAt;
//}
//
//
//// Dispatch.java
//@Entity
//@Table(name = "dispatch")
//@Getter @Setter
//@NoArgsConstructor
//public class Dispatch {
//    @Id
//    @Column(name = "dispatch_id", nullable = false, comment = "출동 ID")
//    private Integer dispatchId;
//
//    @Column(name = "call_id", nullable = false, comment = "신고ID")
//    private Integer callId;
//
//    @Column(name = "fire_dispatch_group_id", nullable = false, comment = "출동그룹ID")
//    private Integer fireDispatchGroupId;
//
//    @Column(name = "dispatch_is_transfer", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE", comment = "병원이송(현장종결)여부")
//    private Boolean dispatchIsTransfer = false;
//
//    @Column(name = "dispatch_create_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT NOW()", comment = "출동요청생성시각")
//    private LocalDateTime dispatchCreateAt;
//
//    @Column(name = "dispatch_depart_at", columnDefinition = "TIMESTAMP", comment = "구급 현장 출동 시각")
//    private LocalDateTime dispatchDepartAt;
//
//    @Column(name = "dispatch_arrive_at", columnDefinition = "TIMESTAMP", comment = "구급 현장 도착 시각")
//    private LocalDateTime dispatchArriveAt;
//}
//
//// DispatchGroup.java
//@Entity
//@Table(name = "dispatch_group")
//@Getter @Setter
//@NoArgsConstructor
//public class DispatchGroup {
//    @Id
//    @Column(name = "dispatch_group_id", nullable = false, comment = "출동그룹ID")
//    private Integer dispatchGroupId;
//
//    @Column(name = "fire_dept_id", nullable = false, comment = "소방청ID")
//    private Integer fireDeptId;
//
//    @Column(name = "dispatch_group_is_activate", nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE", comment = "활성화여부")
//    private Boolean dispatchGroupIsActivate = true;
//
//    @Column(name = "dispatch_group_is_ready", nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE", comment = "출동가능여부")
//    private Boolean dispatchGroupIsReady = true;
//
//    @Column(name = "dispatch_group_create_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT NOW()", comment = "생성시간")
//    private LocalDateTime dispatchGroupCreateAt;
//
//    @Column(name = "dispatch_group_update_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT NOW()", comment = "수정시간")
//    private LocalDateTime dispatchGroupUpdateAt;
//}
//
//// DispatchStaff.java
//@Entity
//@Table(name = "dispatch_staff")
//@Getter @Setter
//@NoArgsConstructor
//public class DispatchStaff {
//    @Id
//    @Column(name = "dispatch_staff", nullable = false, comment = "출동직원ID")
//    private Integer dispatchStaff;
//
//    @Column(name = "dispatch_group_id", nullable = false, comment = "출동그룹ID")
//    private Integer dispatchGroupId;
//
//    @Column(name = "fire_staff_id", nullable = false, comment = "소방청직원ID")
//    private Integer fireStaffId;
//}
//

//// Hospital.java
//@Entity
//@Table(name = "hospital")
//@Getter @Setter
//@NoArgsConstructor
//public class Hospital {
//    @Id
//    @Column(name = "hospital_id", nullable = false, length = 30, comment = "병원ID")
//    private String hospitalId;
//
//    @Column(name = "hospital_login_id", nullable = false, length = 30, comment = "로그인ID")
//    private String hospitalLoginId;
//
//    @Column(name = "hospital_password", nullable = false, length = 64, comment = "비밀번호")
//    private String hospitalPassword;
//
//    @Column(name = "hospital_name", nullable = false, length = 50, comment = "병원명")
//    private String hospitalName;
//
//    // Point 타입은 별도 처리가 필요할 수 있습니다
//    @Column(name = "hospital_location", nullable = false, columnDefinition = "POINT", comment = "병원위치")
//    private Object hospitalLocation;
//
//    @Column(name = "hospital_phone", nullable = false, length = 15, comment = "전화번호")
//    private String hospitalPhone;
//
//    @Column(name = "hospital_is_active", nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE", comment = "활성화여부")
//    private Boolean hospitalIsActive = true;
//
//    @Column(name = "hospital_created_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT NOW()", comment = "생성시간")
//    private LocalDateTime hospitalCreatedAt;
//
//    @Column(name = "hospital_updated_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT NOW()", comment = "수정시간")
//    private LocalDateTime hospitalUpdatedAt;
//}
//
//// Patient.java
//@Entity
//@Table(name = "patient")
//@Getter @Setter
//@NoArgsConstructor
//public class Patient {
//    @Id
//    @Column(name = "patient_id", nullable = false, comment = "환자ID")
//    private Integer patientId;
//
//    @Column(name = "call_id", nullable = false, comment = "신고ID")
//    private Integer callId;
//
//    @Column(name = "dispatch_id", comment = "출동 ID")
//    private Integer dispatchId;
//
//    @Column(name = "transfer_id", comment = "병원이송 ID")
//    private Integer transferId;
//
//    @Column(name = "user_id", comment = "일반회원ID")
//    private Integer userId;
//
//    @Column(name = "patient_is_user", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE", comment = "서비스가입여부")
//    private Boolean patientIsUser = false;
//
//    @Column(name = "patient_name", length = 45, comment = "이름")
//    private String patientName;
//
//    @Column(name = "patient_gender", length = 1, comment = "성별(남성:F, 여성:M)")
//    private Character patientGender;
//}