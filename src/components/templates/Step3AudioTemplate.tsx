import { ArrowRight, ArrowLeft } from 'lucide-react';
import Header from '../molecules/Header';
import StepHeader from '../molecules/StepHeader';
import Button from '../atoms/Button';
import AudioRecorderPanel from '../organisms/AudioRecorderPanel';

interface Step3AudioTemplateProps {
  hasRecording: boolean;
  onRecordingComplete: (audioBlob: File, duration: number) => void;
  isEditMode?:boolean;
  onResetRecording: () => void;
  onNextStep: () => void;
  onBackStep: () => void;
}

export default function Step3AudioTemplate({
  hasRecording,
  isEditMode,
  onRecordingComplete,
  onResetRecording,
  onNextStep,
  onBackStep,
}: Step3AudioTemplateProps) {
  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col justify-between pb-20">
      {/* Header Aplikasi (V-Booth Event) */}
      <Header />

      <main className="max-w-md w-full mx-auto px-4 py-4 space-y-6 flex-1 justify-center flex flex-col">
        {/* Step Indicator (Bahasa Indonesia) */}
        <StepHeader 
          currentStep={3} 
          totalSteps={4} 
          stepTitle="Rekam Ucapan Anda" 
        />

        {/* Panel Utama Perekam Suara */}
        <AudioRecorderPanel 
          onRecordingComplete={onRecordingComplete}
          onResetRecording={onResetRecording}
        />

        {/* Navigation Action Footer */}
        <div className="flex justify-between items-center pt-3">
        {/* Tombol Kembali: Gunakan variant "ghost" */}
            <Button 
                variant="ghost" 
                className="text-[#4648d4] font-semibold gap-2.5"
                icon={<ArrowLeft className="w-5 h-5" />} 
                onClick={onBackStep}
            >
                Kembali
            </Button>
            
            {/* Tombol Next Step: Gunakan variant "tertiary" */}
            <Button
                variant="tertiary"
                className="gap-2.5"
                icon={<ArrowRight className="w-5 h-5" />}
                onClick={onNextStep}
                disabled={!hasRecording}
            >
                {isEditMode ? 'Simpan Audio' : 'Next Step'}
            </Button>
        </div>
      </main>
    </div>
  );
}