import React, { useState } from 'react';
import DispatchMainTemplate from '@/features/dispatch/components/DispatchMainTemplate';
import HospitalSearchSection from '@/features/dispatch/components/HospitalSearchSection';
import BulkTransferRequestDialog from '@/features/dispatch/components/BulkTransferRequestDialog';
import Map from '@/components/molecules/Map';

interface Hospital {
  id: string;
  name: string;
  distance: number;
  estimatedTime: number;
}

const TransferRequestPage = () => {
  const [showBulkRequestDialog, setShowBulkRequestDialog] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState(0);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  const handleSearch = (distance: number) => {
    setSelectedDistance(distance);
    setShowBulkRequestDialog(true);
    // API 호출하여 병원 목록 가져오기
  };

  return (
    <DispatchMainTemplate logoutDirect={() => Promise.resolve()}>
      <div className="flex h-[calc(100vh-120px)]">
        <div className="w-1/4 p-4">
          <HospitalSearchSection onSearch={handleSearch} />
        </div>
        <div className="flex-1">
          <Map className="w-full h-full" />
        </div>
        <BulkTransferRequestDialog
          open={showBulkRequestDialog}
          onClose={() => setShowBulkRequestDialog(false)}
          patientInfo={{
            name: "최유정",
            gender: "여",
            age: 30,
            symptoms: "복통, 구토",
            diagnosis: "당뇨",
            preKTAS: 3
          }}
          selectedHospitals={5}
        />
      </div>
    </DispatchMainTemplate>
  );
};

export default TransferRequestPage;