import React from 'react';
import Webcam from 'react-webcam';
import { Camera, ArrowRight } from 'lucide-react';
import Header from '../molecules/Header';
import StepHeader from '../molecules/StepHeader';
import CameraFrameCanvas, {
  type AspectRatioType,
} from '../organisms/CameraFrameCanvas';
import Button from '../atoms/Button';
import BottomNav from '../molecules/BottomNav';

interface Step1CaptureTemplateProps {
  photos: string[];
  webcamRef: React.RefObject<Webcam | null>;
  selectedIndex: number | null;
  aspectRatio: AspectRatioType;
  onChangeAspectRatio: (ratio: AspectRatioType) => void;
  onSelectPhoto: (index: number | null) => void;
  onDeletePhoto: (index: number) => void;
  onTakePhoto: () => void;
  onNextStep: () => void;
}

export default function Step1CaptureTemplate({
  photos,
  webcamRef,
  selectedIndex,
  aspectRatio,
  onChangeAspectRatio,
  onSelectPhoto,
  onDeletePhoto,
  onTakePhoto,
  onNextStep,
}: Step1CaptureTemplateProps) {
  const isMaxPhotos = photos.length >= 3;
  const hasPhotos = photos.length > 0;

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col justify-between pb-24">
      <Header />

      <main className="max-w-md w-full mx-auto px-4 py-4 space-y-4 flex-1">
        <StepHeader currentStep={1} totalSteps={4} stepTitle="Capture Photo" />

        {/* Organism Kamera & Preview Canvas */}
        <CameraFrameCanvas
          photos={photos}
          aspectRatio={aspectRatio}
          onChangeAspectRatio={onChangeAspectRatio}
          webcamRef={webcamRef}
          selectedIndex={selectedIndex}
          onSelectPhoto={onSelectPhoto}
          onDeletePhoto={onDeletePhoto}
        />

        {/* Area Tombol Aksi */}
        <div className="space-y-3 pt-1">
          {/* Tombol Take Photo / Buka Kamera */}
          <Button
            variant="primary"
            fullWidth
            icon={<Camera className="w-5 h-5" />}
            onClick={
              selectedIndex !== null && !isMaxPhotos
                ? () => onSelectPhoto(null)
                : onTakePhoto
            }
            disabled={isMaxPhotos && selectedIndex === null}
            className={
              isMaxPhotos && selectedIndex === null
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }
          >
            {selectedIndex !== null && !isMaxPhotos
              ? 'Buka Kamera untuk Foto Lagi'
              : isMaxPhotos
              ? 'Maksimal 3 Foto Tercapai'
              : `Take Photo (${photos.length}/3)`}
          </Button>

          {/* Tombol Next Step (Edit & Frame) */}
          {hasPhotos && (
            <Button
              variant="tertiary"
              fullWidth
              icon={<ArrowRight className="w-5 h-5" />}
              onClick={onNextStep}
            >
              Next Step (Edit & Frame)
            </Button>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}