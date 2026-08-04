import { useState, useEffect } from 'react';
import { Send, ArrowLeft, BadgeCheck } from 'lucide-react';
import Header from '../molecules/Header';
import StepHeader from '../molecules/StepHeader';
import Button from '../atoms/Button';
import AudioPreviewCard from '../organisms/AudioPreviewCard';
import { useGreetingFormStore } from '../../stores/useGreetingStore';

interface Step4ReviewTemplateProps {
  framedPhoto: File | null;
  recordedAudio: Blob | null;
  guestName: string;
  isSubmitting: boolean;
  onGuestNameChange: (name: string) => void;
  onSubmit: () => void;
  onBackStep: () => void;
}

export default function Step4ReviewTemplate({
  framedPhoto,
  recordedAudio,
  guestName,
  isSubmitting,
  onGuestNameChange,
  onSubmit,
  onBackStep,
}: Step4ReviewTemplateProps) {
  const {audioDuration } = useGreetingFormStore();
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

  // Buat Object URL untuk preview gambar terbingkai
  useEffect(() => {
    if (framedPhoto) {
      const url = URL.createObjectURL(framedPhoto);
      setPhotoPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [framedPhoto]);

  return (
    
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col justify-between pb-12">
      <Header />

      <main className="max-w-md w-full mx-auto px-4 py-4 space-y-5 flex-1">
        {/* Step Indicator */}
        <StepHeader
          currentStep={4}
          totalSteps={4}
          stepTitle="Review & Submit"
        />

        {/* Header Title */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-[#111827]">Nyaris Selesai!</h2>
          <p className="text-sm text-slate-500">
            Tinjau ucapan Anda sebelum dikirimkan ke galeri acara.
          </p>
        </div>

        {/* MAIN PREVIEW CARD CONTAINER */}
        <div className="bg-white rounded-3xl p-3.5 shadow-sm border border-slate-100 space-y-3">
          {/* Foto Hasil Step 2 */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-3/4 border border-slate-100">
            {photoPreviewUrl ? (
              <img
                src={photoPreviewUrl}
                alt="Preview Framed Photo"
                className="w-full h-full object-contain bg-slate-950"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                Foto tidak ditemukan
              </div>
            )}

            {/* Floating Badge "Preview Photo" */}
            <div className="absolute top-3 left-3 bg-[#4648d4] text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm">
              Preview Photo
            </div>
          </div>

          {/* Player Audio Ucapan */}
          <AudioPreviewCard audioSource={recordedAudio} initialDuration={audioDuration} />
        </div>

        {/* INPUT NAMA TAMU */}
        <div className="space-y-1.5 pt-1">
          <label htmlFor="guestName" className="block text-sm font-semibold text-[#111827]">
            Nama Tamu
          </label>
          <div className="relative">
            <input
              id="guestName"
              type="text"
              value={guestName}
              onChange={(e) => onGuestNameChange(e.target.value)}
              placeholder="Masukkan nama lengkap Anda"
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3.5 pr-11 text-sm text-[#111827] placeholder:text-slate-400 focus:outline-hidden focus:border-[#4648d4] focus:ring-2 focus:ring-[#4648d4]/20 transition-all"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <BadgeCheck className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* BUTTON ACTIONS */}
        <div className="space-y-2.5 pt-2">
          {/* Tombol Kirim Ucapan Utama */}
          <Button
            variant="primary"
            className="w-full justify-center py-3.5 rounded-2xl text-sm font-semibold gap-2 shadow-md shadow-[#4648d4]/25"
            icon={<Send className="w-4 h-4" />}
            onClick={onSubmit}
            disabled={!guestName.trim() || isSubmitting}
          >
            kirim ucapan
            {/* KONTEN OVERLAY SAAT SUBMITTING */}
            {isSubmitting && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex flex-col items-center justify-center p-6 text-white text-center">
                <div className="bg-white rounded-3xl p-6 text-slate-800 max-w-xs w-full space-y-4 shadow-2xl flex flex-col items-center animate-in fade-in zoom-in-95">
                  {/* Spinner Animasi */}
                  <div className="w-12 h-12 border-4 border-[#4648d4]/20 border-t-[#4648d4] rounded-full animate-spin" />
                  
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-[#111827]">Menyimpan Momen Anda</h3>
                    <p className="text-xs text-slate-500">
                      Sedang mengunggah foto & ucapan suara ke galeri...
                    </p>
                  </div>

                  {/* Mini Tips agar Tamu Sabar */}
                  <div className="text-[11px] text-slate-400 bg-slate-50 px-3 py-2 rounded-xl">
                    Mohon jangan tutup halaman ini ya!
                  </div>
                </div>
              </div>
            )}
          </Button>

          {/* Tombol Kembali */}
          <Button
            variant="secondary"
            className="w-full justify-center py-3.5 rounded-2xl text-sm font-semibold gap-2 text-slate-700 border border-slate-200"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={onBackStep}
            disabled={isSubmitting}
          >
            Kembali
          </Button>
        </div>
      </main>
    </div>
  );
}