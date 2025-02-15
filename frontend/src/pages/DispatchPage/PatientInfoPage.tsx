import DispatchMainTemplate from '@/features/dispatch/components/DispatchMainTemplate';
import Input from '@/components/atoms/Input/Input';
import Button from '@/components/atoms/Button/Button';
import {useDispatchPatientStore} from "@/store/dispatch/dispatchPatientStore.tsx";
import React from 'react';

const PatientInfoPage = () => {
  const {formData, updateFormData, savePatientInfo, preKtasAI} =useDispatchPatientStore();
  const ktasOptions = ['1', '2', '3', '4', '5']
  const mentalOptions = ['A', 'V', 'P', 'U'];
  const genderOptions = ['M', 'F'];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await savePatientInfo()
      if (response) {
        console.log("환자 저장 성공(페이지)", response)
      }
    } catch (error) {
      console.error("환자 저장 실패(페이지)",error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement|HTMLInputElement|HTMLSelectElement>) => {
    const {name, value} = e.target;

    // 체온 변환
    if (name === 'patientTemperature') {
      // 숫자 추출
      const numbers = value.replace(/[^\d]/g, '')
      if (numbers.length <= 3) {
        // 3자리까지만 입력(. 삽입)
        const formatted = numbers.length > 2
            ? `${numbers.slice(0, 2)}.${numbers.slice(2)}`
            : numbers
        // 문자열을 숫자로 변환
        const numValue = formatted === '' ? null : parseFloat(formatted);
        updateFormData({[name]: numValue});
      }
      return
    }

    // 다른 필드들도 3자리까지 입력
    if (['patientSystolicBldPress', 'patientDiastolicBldPress', 'patientPulseRate',
      'patientSpo2', 'patientBloodSugar'].includes(name)) {
      const numbers = value.replace(/[^\d]/g, '')
      if (numbers.length <= 3) {
        updateFormData({ [name] : numbers === '' ? null :Number(numbers)})
      }
      return;
    }

    // 나머지 필드들
    updateFormData({ [name]: value });
  }

  // pre-KTAS AI 예측
  const handlePreKtasAI = async () => {
    try {
      await preKtasAI();
    } catch (error) {
      console.error("prektas 실패(페이지)", error)
    }
  }

  return (
    <DispatchMainTemplate>
      <div className="p-8 max-w-5xl mx-auto">
        <form onSubmit={handleSave} className="space-y-5 bg-white p-6 rounded-lg shadow-sm">
          {/* 기본 정보 섹션 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">기본 정보</h3>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-2">
                <Input
                  label="이름"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  width="full"
                  className= "border-gray-800"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-black text-sm font-medium mb-1">성별</label>
                <select
                  value={formData.patientGender}
                  onChange={handleInputChange}
                  name="patientGender"
                  className=" w-full px-3 py-[0.85rem] border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택</option>
                  {genderOptions.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <Input
                  label="나이"
                  name="patientAge"
                  value={formData.patientAge}
                  onChange={handleInputChange}
                  width="full"
                  className= "border-gray-800"
                />
              </div>
              <div className="col-span-3">
                <Input
                  label="환자 연락처"
                  name="patientPhone"
                  value={formData.patientPhone}
                  onChange={handleInputChange}
                  width="full"
                  className= "border-gray-800"
                />
              </div>
              <div className="col-span-3">
                <Input
                  label="보호자 연락처"
                  name="patientProtectorPhone"
                  value={formData.patientProtectorPhone}
                  onChange={handleInputChange}
                  width="full"
                  className= "border-gray-800"
                />
              </div>
            </div>
          </div>

          {/* 생체 징후 섹션 */}
          <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 pt-2 border-b">생체 징후</h3>
          <div className="grid grid-cols-6 gap-3">
            <div className="col-span-1">
              <Input
                label="SBP"
                name="patientSystolicBldPress"
                value={formData.patientSystolicBldPress ?? ''}
                onChange={handleInputChange}
                width="full"
                className= "border-gray-800"
                maxLength={3}
                pattern="\d*"   // 숫자만 허용
              />
            </div>
            <div className="col-span-1">
              <Input
                label="DBP"
                name="patientDiastolicBldPress"
                value={formData.patientDiastolicBldPress ?? ''}
                onChange={handleInputChange}
                width="full"
                className= "border-gray-800"
                maxLength={3}
                pattern="\d*"
              />
            </div>
            <div className="col-span-1">
              <Input
                label="PR"
                name="patientPulseRate"
                value={formData.patientPulseRate ?? ''}
                onChange={handleInputChange}
                width="full"
                className= "border-gray-800"
                maxLength={3}
                pattern="\d*"
              />
            </div>
            <div className="col-span-1">
              <Input
                label="BT"
                name="patientTemperature"
                value={formData.patientTemperature ?? ''}
                onChange={handleInputChange}
                width="full"
                className= "border-gray-800"
                maxLength={4}
                pattern="[0-9]*\.?[0-9]*"   // 소숫점 허용 패턴
              />
            </div>
            <div className="col-span-1">
              <Input
                label="SPO2"
                name="patientSpo2"
                value={formData.patientSpo2 ?? ''}
                onChange={handleInputChange}
                width="full"
                className= "border-gray-800"
              />
            </div>
            <div className="col-span-1">
              <Input
                label="BST"
                name="patientBloodSugar"
                value={formData.patientBloodSugar ?? ''}
                onChange={handleInputChange}
                width="full"
                className= "border-gray-800"
                maxLength={3}
                pattern="\d*"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-1">
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <label className="block text-black text-sm font-medium mb-1">Pre-KTAS</label>
                  <button
                      type="button"
                      onClick={handlePreKtasAI}
                      className="text-base text-red-600 hover:text-red-800 font-medium"
                  >
                    AI 분류하기
                  </button>
                </div>
                <select
                    value={formData.patientPreKtas}
                    onChange={handleInputChange}
                    name="patientPreKtas"
                    className="w-full px-3 py-2 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택</option>
                  {ktasOptions.map((ktas) => (
                      <option key={ktas} value={ktas}>
                        {ktas}
                      </option>
                  ))}
                </select>
              </div>
            </div>

              <div className="col-span-1">
                <label className="block text-black text-sm font-medium mb-1">의식상태</label>
                <select
                    value={formData.patientMental}
                    onChange={handleInputChange}
                    name="patientMental"
                    className="w-full px-3 py-2 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택</option>
                  {mentalOptions.map((mental) => (
                      <option key={mental} value={mental}>
                        {mental}
                      </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 상세 정보 섹션 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 pt-2 border-b">상세 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dialog_content p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">기저 질환</h4>
                  <p className="text-gray-900">{formData?.diseases || '없음'}</p>
              </div>
              <div className="bg-dialog_content p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">복용 약물</h4>
                <p className="text-gray-900">{formData?.medications || '없음'}</p>
              </div>
            </div>
          </div>

          <div className="bg-dialog_content p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-2">신고 요약본</h4>
            <p className="text-gray-900">{formData?.callSummary || '없음'}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">증상 및 특이사항</h4>
            <textarea
              name="patientSymptom" // name 속성 추가
              value={formData.patientSymptom}
              onChange={handleInputChange}
              placeholder="증상 및 특이사항"
              className="w-full h-24 p-2 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-4 pt-2">
            <Button variant="gray" type="button" width="auto">
              취소
            </Button>
            <Button variant="blue" type="submit" width="auto">
              저장
            </Button>
          </div>
        </form>
      </div>
    </DispatchMainTemplate>
  );
};

export default PatientInfoPage;