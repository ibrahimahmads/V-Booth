import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Step4ReviewTemplate from '../components/templates/Step4ReviewTemplate';
import { useGreetingFormStore } from '../stores/useGreetingStore'; 
import { createGreeting } from '../services/greeting.service'; 
import { setStoredGreetingId } from '../utils/helper/storage';
import { toast } from 'sonner';

export default function Step4ReviewPage() {
  const navigate = useNavigate();
  const {
    framedPhoto,
    recordedAudio,
    guestName,
    setGuestName,
    setStep,
  } = useGreetingFormStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Guard Clause: Pastikan foto dan audio sudah ada sebelum masuk halaman review
  useEffect(() => {
    if (!framedPhoto) {
      setStep(2);
      navigate('/booth/step-2', { replace: true });
    } else if (!recordedAudio) {
      setStep(3);
      navigate('/booth/step-3', { replace: true });
    }
  }, [framedPhoto, recordedAudio, navigate, setStep]);

  // Handler Submit Ucapan ke Backend API
  const handleSubmit = async () => {
    if (!guestName.trim()) {
      toast.warning('Nama belum diisi!', {
        description: 'Tolong beri tahu pengantin siapa nama Anda.',
      });
      return;
    }
    if (!framedPhoto || !recordedAudio) return;

    try {
      setIsSubmitting(true);

      const response = await createGreeting({
        guestName: guestName.trim(),
        photo: framedPhoto,
        audio: recordedAudio,
      });

      if (response && response.id) {
      setStoredGreetingId(response.id);
    }

      navigate('/booth/success');
    } catch (error) {
      console.error('Gagal mengirim ucapan:', error);
      alert('Terjadi kesalahan saat mengirim ucapan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackStep = () => {
    setStep(3);
    navigate('/booth/step-3');
  };

  return (
    <Step4ReviewTemplate
      framedPhoto={framedPhoto}
      recordedAudio={recordedAudio}
      guestName={guestName}
      isSubmitting={isSubmitting}
      onGuestNameChange={setGuestName}
      onSubmit={handleSubmit}
      onBackStep={handleBackStep}
    />
  );
}