import TableRow from '@components/organisms/TableRow/TableRow.tsx';
import SearchBar_ver2 from '@components/molecules/SearchBar/SearchBar_ver2.tsx';

const HospitalListForm = () => {
  // 컬럼 정의
  const columns: {
    key: string;
    header: string;
    render?: (value: any) => React.ReactNode;
  }[] = [
    { key: 'callStartAt', header: '이송요청 일시' },
    { key: 'name', header: '이름' },
    { key: 'sex/age', header: '성별/나이' },
    { key: 'pre-KTAS', header: 'pre-KTAS' },
    { key: 'symptom', header: '증상' },
    { key: 'fire', header: '관할 소방서' },
    { key: 'transferAcceptAt', header: '요청수락 일시' },
  ];

  // 더미 데이터
  const dummyData = [
    {
      name: '000',
      id: 'dbwjd0411',
      fire: '광산구 소방서',
      'sex/age': 'M/50',
      callStartAt: '20250115',
      transferAcceptAt: '20250115',
      'pre-KTAS': 3,
      symptom: '흉통',
    },
    {
      name: '000',
      id: 'dbwjd0411',
      fire: '광산구 소방서',
      'sex/age': 'M/50',
      callStartAt: '20250115',
      transferAcceptAt: '-',
      'pre-KTAS': 3,
      symptom: '흉통',
    },
  ];

  return (
    <div className="w-full p-10">
      <h1 className="text-[32px] font-bold pl-20 mb-5">실시간 이송 요청</h1>
      <div className="flex flex-col items-center">
        <div className="w-[80%] min-w-[800px] border border-[#dde1e6] bg-white">
          {/* 테이블 헤더 */}
          <div className="flex w-full bg-[#A7A6A6] text-white text-sm font-medium">
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
export default HospitalListForm;
