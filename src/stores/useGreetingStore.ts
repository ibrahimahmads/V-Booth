import { create } from 'zustand';

interface GreetingFormState {
  step: number; // 1: Capture, 2: Frame/Edit, 3: Audio, 4: Review/Submit
  rawPhotos: string[]; // Foto mentah dari Step 1 (max 3)
  framedPhoto: File | null; // Hasil export gambar Konva dari Step 2
  recordedAudio: Blob | null;
  audioDuration: number;
  guestName: string; // Nama tamu dari Step 4

  // Actions
  setStep: (step: number) => void;
  setRawPhotos: (photos: string[]) => void;
  setFramedPhoto: (file: File | null) => void;
  setRecordedAudio: (audio: Blob | null, duration?: number) => void;
  setGuestName: (name: string) => void;
  resetForm: () => void;
}

export const useGreetingFormStore = create<GreetingFormState>((set) => ({
  step: 1,
  rawPhotos: [],
  framedPhoto: null,
  recordedAudio: null,
  audioDuration:0,
  guestName: '',

  setStep: (step) => set({ step }),
  setRawPhotos: (rawPhotos) => set({ rawPhotos }),
  setFramedPhoto: (framedPhoto) => set({ framedPhoto }),
  setRecordedAudio: (audio, duration = 0) =>
    set({ recordedAudio: audio, audioDuration: duration }),
  setGuestName: (guestName) => set({ guestName }),
  resetForm: () =>
    set({
      step: 1,
      rawPhotos: [],
      framedPhoto: null,
      guestName: '',
      audioDuration: 0,
      recordedAudio: null,
    }),
}));