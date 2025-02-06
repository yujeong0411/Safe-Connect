// src/features/dispatch/hooks/useDispatchData/index.ts
import { useState, useEffect } from 'react';
import { DispatchData } from '../../types/types';

export const useDispatchData = (currentPage: number) => {
  const [data, setData] = useState<DispatchData[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 임시 데이터
        const mockData: DispatchData[] = [
          {
            id: '1',
            requestTime: '2025-02-06T10:00:00',
            patientName: '최유정',
            gender: '여',
            age: 30,
            consciousness: 'A',
            preKTAS: 3,
            patientContact: '010-0000-0000',
            guardianContact: '010-0000-0000',
            transferDestination: '서울대병원',
            requestHospital: '응급의료센터',
            transferCompleteTime: '2025-02-06T10:30:00',
            status: 'completed',
            vitals: {
              sbp: 90,
              dbp: 60,
              rr: 20,
              bt: 36.5,
              spo2: 98,
              bst: 80
            },
            symptoms: '복통, 구토',
            diagnosis: '당뇨',
            medications: '혈당 조절제',
            notes: '노바스크 정 복용중',
            transferInfo: {
              requestTime: '2025-01-19-10:11',
              endTime: '2025-01-19-10:15',
              hospital: '광산구 안전센터 3팀'
            }
          },
          {
            id: '2',
            requestTime: '2025-02-06T09:30:00',
            patientName: '김환자',
            gender: '남',
            age: 45,
            consciousness: 'A',
            preKTAS: 2,
            patientContact: '010-1111-1111',
            guardianContact: '010-1111-1111',
            transferDestination: '연세대병원',
            requestHospital: '응급의료센터',
            transferCompleteTime: '2025-02-06T10:00:00',
            status: 'completed',
            vitals: {
              sbp: 120,
              dbp: 80,
              rr: 18,
              bt: 37.2,
              spo2: 97,
              bst: 95
            },
            symptoms: '흉통',
            diagnosis: '고혈압',
            medications: '혈압약',
            notes: '협심증 과거력',
            transferInfo: {
              requestTime: '2025-01-19-09:30',
              endTime: '2025-01-19-10:00',
              hospital: '광산구 안전센터 2팀'
            }
          },
          {
            id: '3',
            requestTime: '2025-02-06T11:00:00',
            patientName: '이환자',
            gender: '여',
            age: 25,
            consciousness: 'A',
            preKTAS: 4,
            patientContact: '010-2222-2222',
            guardianContact: '010-2222-2222',
            transferDestination: '고려대병원',
            requestHospital: '응급의료센터',
            transferCompleteTime: '-',
            status: 'pending',
            vitals: {
              sbp: 110,
              dbp: 70,
              rr: 16,
              bt: 36.8,
              spo2: 99,
              bst: 85
            },
            symptoms: '발열, 기침',
            diagnosis: '독감 의심',
            medications: '해열제',
            notes: '알레르기약 복용중',
            transferInfo: {
              requestTime: '2025-01-19-11:00',
              endTime: '-',
              hospital: '광산구 안전센터 1팀'
            }
          }
        ];

        setData(mockData);
        setTotalPages(5);
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  return { data, totalPages, loading };
};