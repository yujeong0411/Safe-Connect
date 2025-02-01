import SearchBar_ver2 from '@components/molecules/SearchBar/SearchBar_ver2.tsx';
import TableRow from '@components/organisms/TableRow/TableRow.tsx';
import { useState } from 'react';

interface AdminUserTableProps {
  userType: 'fire' | 'hospital';
}

interface UserData {
  name: string;
  id: string;
  department: string;
  type: string;
  createdAt: string;
  isActive: boolean;
}

const AdminRegisterForm = ({ userType }: AdminUserTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // 테이블 행 클릭 시
  const handleRowClick = (patientData) => {
    setSelectedPatient(patientData);
    setIsModalOpen(true);
  };

  const handleSearch = (keyword: string) => {
    console.log('keyword:', keyword);
    // 검색로직 구현
  };

  // 컬럼 정의
  const columns: {
    key: keyof UserData;
    header: string;
    render?: (value: any) => React.ReactNode;
  }[] = [
    { key: 'name', header: '이름' },
    { key: 'id', header: '아이디' },
    {
      key: 'department',
      header: userType === 'hospital' ? '병원' : '관할 부서',
    },
    {
      key: 'isActive',
      header: '활성화 여부',
      render: (value) => (
        <span className="px-2.5 py-0.5 text-xs bg-[#f2f4f8] rounded-[10px]">
          {value ? '활성' : '비활성'}
        </span>
      ),
    },
    { key: 'createAt', header: '생성일시' },
  ];

  // 더미 데이터
  const dummyData = [
    {
      name: '000',
      id: 'dbwjd0411',
      department: '서울대학교병원',
      type: 'Cell Text',
      createdAt: '20250115',
      isActive: true,
    },
    {
      name: 'Cell Text',
      id: 'Cell Text',
      department: 'Cell Text',
      type: 'Cell Text',
      createdAt: '20250115',
      isActive: true,
    },
  ];

  return (
    <div className="w-full">
      {/* 검색창 */}
      <SearchBar_ver2 onSearch={handleSearch} className="p-5" />

      {/* 테이블 */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] border border-[#dde1e6] bg-white">
          {/* 테이블 헤더 */}
          <div className="flex w-full bg-banner text-white text-sm font-medium">
            {columns.map((column) => (
              <div key={column.header} className="flex-1 p-4">
                {column.header}
              </div>
            ))}
            <div className="w-10 p-4"></div>
          </div>

          {/* 테이블 바디 */}
          {dummyData.map((data, index) => (
            <TableRow key={index} data={data} columns={columns} actions={<button>...</button>} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default AdminRegisterForm;
