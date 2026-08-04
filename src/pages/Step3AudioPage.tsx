import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Step3AudioTemplate from '../components/templates/Step3AudioTemplate';
import { useGreetingFormStore } from '../stores/useGreetingStore';
import { getStoredGreetingId } from '../utils/helper/storage';
import { toast } from 'sonner';

export default function Step3AudioPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setRecordedAudio, recordedAudio, setStep, framedPhoto } = useGreetingFormStore();

  // Cek apakah user sedang dalam mode edit ucapan
  const searchParams = new URLSearchParams(location.search);
  const isEditMode = searchParams.get('mode') === 'edit' || !!getStoredGreetingId();

  // Guard Clause: Hanya tendang ke Step 2 JIKA BUKAN MODE EDIT
  useEffect(() => {
    if (!framedPhoto && !isEditMode) {
      toast.warning('Selesaikan Bingkai Foto dahulu', {
        description: 'Anda harus menyelesaikan bingkai foto di Step 2 sebelum merekam suara.',
      });
      setStep(2);
      navigate('/booth/step-2', { replace: true });
    }
  }, [framedPhoto, isEditMode, navigate, setStep]);

  const handleRecordingComplete = (file: File, duration: number) => {
    setRecordedAudio(file, duration);
  };

  const handleResetRecording = () => {
    setRecordedAudio(null, 0);
  };

  const handleNextStep = () => {
    if (!recordedAudio) {
      toast.warning('Rekam Suara Anda', {
        description: 'Tekan tombol mikrofon untuk merekam pesan ucapan Anda.',
      });
      return;
    }

    // JIKA DALAM MODE EDIT: Langsung balik ke Halaman Edit Hub
    if (isEditMode) {
      toast.success('Pesan Suara Diperbarui!');
      navigate('/booth/edit');
    } else {
      setStep(4);
      navigate('/booth/step-4');
    }
  };

  const handleBackStep = () => {
    if (isEditMode) {
      navigate('/booth/edit');
    } else {
      setStep(2);
      navigate('/booth/step-2');
    }
  };

  return (
    <Step3AudioTemplate
      hasRecording={!!recordedAudio}
      onRecordingComplete={handleRecordingComplete}
      onResetRecording={handleResetRecording}
      onNextStep={handleNextStep}
      onBackStep={handleBackStep}
    />
  );
}