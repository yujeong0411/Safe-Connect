// 구급대원 정보를 나타내는 인터페이스
export interface DispatchStaff {
  fireStaffId: number; // 구급대원의 고유 식별자
  fireStaffLoginId: string; // 구급대원 로그인 아이디
  fireStaffName: string; // 구급대원 이름
  fireStaffCategory: string; // 구급대원 직급 또는 분류
}

// 구급대 그룹 정보를 나타내는 인터페이스
export interface DispatchGroup {
  dispatchGroupId: number; // 구급대 그룹의 고유 식별자
  dispatchGroupName: string; // 구급대 그룹 이름
  fireStaffIdList: number[]; // 그룹에 속한 구급대원들의 ID 목록
}
