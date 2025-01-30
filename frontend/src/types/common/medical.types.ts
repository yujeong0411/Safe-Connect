export interface MedicalItem {
  mediId: number;
  mediName: string;
}

export interface MedicalCategory {
  categoryId: number;
  categoryName: string;
  mediList: MedicalItem[];
}
