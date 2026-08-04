import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Sparkles, Images } from 'lucide-react';
import Header from '../components/molecules/Header';
import Button from '../components/atoms/Button';
import { useGreetingFormStore } from '../stores/useGreetingStore';

export default function SuccessPage() {
  const navigate = useNavigate();
  const { resetForm } = useGreetingFormStore();

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const handleGoToGallery = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col justify-between pb-12">
      <Header />

      <main className="max-w-md w-full mx-auto px-4 py-8 flex-1 flex flex-col items-center justify-center text-center space-y-6">
        {/* Animated Check Icon Container */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-emerald-50 border-8 border-emerald-100 flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <div className="absolute -top-1 -right-1 text-amber-400 animate-pulse">
            <Sparkles className="w-8 h-8 fill-amber-300" />
          </div>
        </div>

        {/* Text Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#111827]">
            Terima Kasih!
          </h1>
          <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
            Foto dan ucapan suara Anda telah berhasil dikirimkan ke galeri acara.
          </p>
        </div>

        {/* Info Card Box */}
        <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3 text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#4648d4]/10 text-[#4648d4]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#111827]">Momen Tersimpan</h4>
              <p className="text-xs text-slate-400">
                Pesan Anda kini dapat dilihat oleh penyelenggara acara.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button (Hanya 'Lihat Galeri Acara') */}
        <div className="w-full pt-4">
          <Button
            variant="primary"
            className="w-full justify-center py-3.5 rounded-2xl text-sm font-semibold gap-2 shadow-md shadow-[#4648d4]/25"
            icon={<Images className="w-4 h-4" />}
            onClick={handleGoToGallery}
          >
            Lihat Galeri Acara
          </Button>
        </div>
      </main>
    </div>
  );
}