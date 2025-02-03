/**
 * 각 진행 단계를 보여주는 아이템 컴포넌트
 * @param number - 단계 번호
 * @param title - 단계 제목
 * @param desc - 단계 설명
 * @param isActive - 현재 활성화된 단계 여부
 */
export interface StepItemProps {
  number: number;
  title: string;
  description: string;
  isActive: boolean;
}
