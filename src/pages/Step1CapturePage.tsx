import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import Step1CaptureTemplate from '../components/templates/Step1CaptureTemplate';
import { useNavigate } from 'react-router-dom';
import { useGreetingFormStore } from '../stores/useGreetingStore';
import type { AspectRatioType } from '../components/organisms/CameraFrameCanvas';
import { toast } from 'sonner';

// 1. Helper Function untuk memotong (crop) gambar mentah dari webcam secara nyata
const captureAndCropImage = (
  videoElement: HTMLVideoElement,
  aspectRatio: AspectRatioType
): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const videoWidth = videoElement.videoWidth;   // Lebar asli dari sensor kamera (misal: 1280)
  const videoHeight = videoElement.videoHeight; // Tinggi asli dari sensor kamera (misal: 720)

  let cropWidth = videoWidth;
  let cropHeight = videoHeight;

  // Hitung area potong (Crop) berdasarkan ratio target
  if (aspectRatio === '1:1') {
    const minDim = Math.min(videoWidth, videoHeight);
    cropWidth = minDim;
    cropHeight = minDim;
  } else if (aspectRatio === '9:16') {
    // Jika sensor bawaan HP landscape (lebar > tinggi), potong bagian tengahnya agar jadi portrait 9:16
    if (videoWidth / videoHeight > 9 / 16) {
      cropHeight = videoHeight;
      cropWidth = cropHeight * (9 / 16);
    } else {
      cropWidth = videoWidth;
      cropHeight = cropWidth * (16 / 9);
    }
  }

  // Set ukuran Canvas sesuai hasil potongan
  canvas.width = cropWidth;
  canvas.height = cropHeight;

  // Hitung koordinat tengah agar wajah tidak tergeser/meleset
  const startX = (videoWidth - cropWidth) / 2;
  const startY = (videoHeight - cropHeight) / 2;

  if (ctx) {
    ctx.drawImage(
      videoElement,
      startX, startY, cropWidth, cropHeight, // Area sumber dari webcam
      0, 0, cropWidth, cropHeight             // Area tujuan di Canvas
    );
  }

  // Return gambar MURNI PORTRAIT dalam bentuk DataURL
  return canvas.toDataURL('image/jpeg', 0.95);
};

export default function Step1CapturePage() {
  const navigate = useNavigate();
  const { setRawPhotos, setStep } = useGreetingFormStore();
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  // State Aspect Ratio (default 1:1 atau 9:16)
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('1:1');
  
  const webcamRef = useRef<Webcam | null>(null);

  // 2. Take Photo (Sudah menggunakan Crop Canvas)
  const handleTakePhoto = useCallback(() => {
    if (photos.length >= 3) return;

    if (webcamRef.current && webcamRef.current.video) {
      const videoElement = webcamRef.current.video;
      
      // Ambil & Crop foto secara nyata dari element video webcam
      const croppedImageSrc = captureAndCropImage(videoElement, aspectRatio);

      if (croppedImageSrc) {
        setPhotos((prev) => [...prev, croppedImageSrc]);
      }
    }
  }, [photos, aspectRatio]);

  const handleDeletePhoto = (indexToDelete: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== indexToDelete));
    setSelectedIndex(null);
  };

  const handleNextStep = () => {
    if (photos.length === 0) {
      toast.warning('Belum ada foto', {
        description: 'Ambil minimal 1 foto terlebih dahulu sebelum lanjut.',
      });
      return;
    }
    setRawPhotos(photos);
    setStep(2);
    navigate('/booth/step-2');
  };

  return (
    <Step1CaptureTemplate
      photos={photos}
      webcamRef={webcamRef}
      selectedIndex={selectedIndex}
      aspectRatio={aspectRatio}
      onChangeAspectRatio={setAspectRatio}
      onSelectPhoto={(idx) => setSelectedIndex(idx)}
      onDeletePhoto={handleDeletePhoto}
      onTakePhoto={handleTakePhoto}
      onNextStep={handleNextStep}
    />
  );
}