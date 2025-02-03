import { RegisterDetailProps } from '@features/admin/types/detailProps.types.ts';

const AdminRegisterDetailDialog = ({ isOpen, onClose, userData }: RegisterDetailProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">사용자 상세 정보</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">이름</label>
            <div className="mt-1 p-2 bg-gray-50 rounded">{userData.name}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">아이디</label>
            <div className="mt-1 p-2 bg-gray-50 rounded">{userData.id}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">부서</label>
            <div className="mt-1 p-2 bg-gray-50 rounded">{userData.department}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">활성화 상태</label>
            <div
              className={`mt-1 p-2 rounded ${userData.isActive ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}
            >
              {userData.isActive ? '활성' : '비활성'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">생성일시</label>
            <div className="mt-1 p-2 bg-gray-50 rounded">{userData.createdAt}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegisterDetailDialog;
