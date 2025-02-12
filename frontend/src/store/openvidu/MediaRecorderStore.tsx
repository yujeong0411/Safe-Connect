import { create } from 'zustand';

// 상태 인터페이스 정의
interface RecorderState {
  mediaRecorder: MediaRecorder | null;
  audioStream: MediaStream | null;
  isRecording: boolean;
  audioChunks: Blob[];
  audioBlob: Blob | null;
  error: string | null;
  onRecordingComplete: ((blob: Blob) => void) | null;
  
  // 메서드들의 타입 정의
  initializeRecorder: () => Promise<void>;
  startRecording: () => void;
  stopRecording: () => Promise<Blob>;
  cleanup: () => void;
  
}

const useRecorderStore = create<RecorderState>((set, get) => ({
  // 초기 상태에 타입 명시
  mediaRecorder: null,
  audioStream: null,
  isRecording: false,
  audioChunks: [],
  audioBlob: null,
  error: null,
  onRecordingComplete: null,
  

  initializeRecorder: async () => {
    try {
      if (!navigator.mediaDevices) {
        throw new Error('미디어 장치가 지원되지 않는 브라우저입니다.');
      }

      if (get().mediaRecorder) {
        return;
      }

      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 48000,    // 오디오 샘플링 레이트 설정 (1초당 오디오 샘플 수)
          channelCount: 1,       // 오디오 채널 수 설정
          echoCancellation: true, // 에코 제거 기능 활성화
          noiseSuppression: true // 주변 소음 제거 기능 활성화
        }
      });

      // MediaRecorder 옵션 타입 명시
      const recorder: MediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      // 이벤트 핸들러에 타입 명시
      recorder.ondataavailable = (event: BlobEvent) => {
        set((state) => ({
          audioChunks: [...state.audioChunks, event.data]
        }));
      };

      recorder.onstop = () => {
        const chunks = get().audioChunks;
        const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        set({ audioBlob: blob, audioChunks: [] });

        // 콜백 실행
        const callback = get().onRecordingComplete;
        if (callback && blob) {
          callback(blob);
        }
      };

      set({ 
        mediaRecorder: recorder,
        audioStream: stream,
        error: null
      });

    } catch (err) {
      // 에러 타입 체크 및 처리
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다.';
      set({ error: errorMessage });
      console.error('Recorder initialization failed:', err);
    }
  },

  startRecording: () => {
    console.log('녹음 시작'); // 테스트용. 제거 필요
    const { mediaRecorder } = get();
    if (mediaRecorder && mediaRecorder.state === 'inactive') {
      mediaRecorder.start();
      set({ isRecording: true });
    }
    
  },

  stopRecording: () => {
    return new Promise<Blob>((resolve) => {
      const { mediaRecorder } = get();
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.onstop = () => {
          const chunks = get().audioChunks;
          const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
          set({ audioBlob: blob, audioChunks: [] });
          resolve(blob);  // Blob 반환
        };
        mediaRecorder.stop();
        set({ isRecording: false });
      }
    });
  },

  cleanup: () => {
    const { audioStream } = get();
    if (audioStream) {
      audioStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    }
    set({
      mediaRecorder: null,
      audioStream: null,
      isRecording: false,
      audioChunks: [],
      audioBlob: null,
      error: null
    });
  }
}));

export default useRecorderStore;