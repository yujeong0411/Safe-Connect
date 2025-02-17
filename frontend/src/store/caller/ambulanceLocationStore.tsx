// store/ambulance/ambulanceLocationStore.tsx
import { create } from 'zustand';

interface AmbulanceLocation {
  sessionId: string;
  lat: number;
  lng: number;
}

interface AmbulanceLocationState {
  location: AmbulanceLocation | null;
  setLocation: (location: AmbulanceLocation) => void;
  clearLocation: () => void;
}

export const useAmbulanceLocationStore = create<AmbulanceLocationState>((set) => ({
  location: null,
  setLocation: (location) => set({ location }),
  clearLocation: () => set({ location: null }),
}));