import Button from '@/components/atoms/Button/Button';

const VideoCall = () => {
  return (
    <div className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden relative">
      <video className="w-full h-full object-cover" />
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button variant="blue" size="sm" width="auto">음소거</Button>
        <Button variant="blue" size="sm" width="auto">카메라 끄기</Button>
        <Button variant="red" size="sm" width="auto">통화 종료</Button>
      </div>
    </div>
  );
};

export default VideoCall;