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
            patientName: '김환자',
            transferDestination: '서울대병원',
            requestHospital: '응급의료센터',
            transferCompleteTime: '2025-02-06T10:30:00',
            status: 'completed',
          },
          // 더 많은 목업 데이터...
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
