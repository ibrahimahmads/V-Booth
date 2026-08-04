import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, ArrowLeft, Save, Loader2, Sparkles } from 'lucide-react';
import Header from '../components/molecules/Header';
import AudioPreviewCard from '../components/organisms/AudioPreviewCard';
import Button from '../components/atoms/Button';
import BottomNav from '../components/molecules/BottomNav';
import { useGreetingFormStore } from '../stores/useGreetingStore';
import { getStoredGreetingId } from '../utils/helper/storage';
import { getGreetingById, updateGreeting } from '../services/greeting.service';
import { toast } from 'sonner';

export default function EditGreetingPage() {
  const navigate = useNavigate();
  const greetingId = getStoredGreetingId();

  // State Store Form (Foto & Audio Baru jika user mengedit)
  const {
    framedPhoto,
    recordedAudio,
    audioDuration,
    setStep,
    resetForm,
  } = useGreetingFormStore();

  // State Data Asli dari Backend
  const [initialData, setInitialData] = useState<{
    guestName: string;
    photoUrl: string;
    audioUrl: string;
  } | null>(null);

  // State Form Edit Lokal
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Data Ucapan dari Backend berdasarkan ID
  useEffect(() => {
    if (!greetingId) {
      navigate('/booth/step-1');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getGreetingById(greetingId);
        setInitialData({
          guestName: data.guestName,
          photoUrl: data.photoUrl,
          audioUrl: data.audioUrl,
        });
        setGuestName(data.guestName);
      } catch (err) {
        console.error('Gagal memuat ucapan:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [greetingId, navigate]);

  // Deteksi Apakah Ada Perubahan (Is Dirty Check)
  const isNameChanged = initialData ? guestName.trim() !== initialData.guestName : false;
  const isPhotoChanged = framedPhoto !== null;
  const isAudioChanged = recordedAudio !== null;
  const hasChanges = isNameChanged || isPhotoChanged || isAudioChanged;

  // Handler Ke Step 1 untuk Edit Foto
  const handleEditPhoto = () => {
    setStep(1);
    navigate('/booth/step-1?mode=edit');
  };

  // Handler Ke Step 3 untuk Edit Audio
  const handleEditAudio = () => {
    setStep(3);
    navigate('/booth/step-3?mode=edit');
  };

  const handleCancel = () => {
    resetForm();
    navigate('/');
  };

  // Handler Submit Update Data ke API Spring Boot
  const handleSaveUpdate = async () => {
    if (!guestName.trim()) {
      toast.warning('Nama Tidak Boleh Kosong', {
        description: 'Silakan isi nama Anda terlebih dahulu sebelum menyimpan.',
      });
      return;
    }
    if (!hasChanges) {
      toast.info('Tidak Ada Perubahan', {
        description: 'Anda belum mengubah nama, foto, maupun suara.',
      });
      return;
    }
    if (!greetingId) return;

    try {
      setIsSubmitting(true);

      await updateGreeting(greetingId, {
        guestName: guestName.trim(),
        photo: framedPhoto || undefined, // Hanya kirim File jika ada foto baru
        audio: recordedAudio || undefined, // Hanya kirim File jika ada audio baru
      });

      // Reset form state setelah berhasil update
      resetForm();

      // Navigasi ke Halaman Sukses
      navigate('/booth/success');
    } catch (err) {
      console.error('Gagal memperbarui ucapan:', err);
      toast.error('Gagal Menyimpan Perubahan', {
        description: 'Terjadi masalah pada koneksi server. Silakan coba lagi.',
      });
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#4648d4]" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f7f9fb] flex flex-col justify-between pb-24">
      <Header />

      <main className="max-w-md w-full mx-auto px-4 py-4 space-y-5 flex-1">
        <div className="flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" /> Batal
          </button>
          <h2 className="text-base font-bold text-[#111827]">Edit Ucapan Anda</h2>
        </div>

        {/* 1. PREVIEW FOTO (DENGAN TOMBOL EDIT PEN) */}
        <div className="relative w-full aspect-9/16 max-h-380px bg-slate-950 rounded-3xl overflow-hidden shadow-lg border-2 border-white">
          <img
            src={
              framedPhoto
                ? URL.createObjectURL(framedPhoto) // Tampilkan foto baru jika di-edit
                : initialData?.photoUrl // Tampilkan foto lama dari Cloudinary
            }
            alt="Preview Foto"
            className="w-full h-full object-contain"
          />

          {/* Tombol Icon Pen Edit Foto */}
          <button
            type="button"
            onClick={handleEditPhoto}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all shadow-md active:scale-90 cursor-pointer z-10"
            title="Ubah Foto"
          >
            <Pencil className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* 2. PREVIEW AUDIO (DENGAN TOMBOL EDIT PEN) */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-bold text-slate-500 uppercase">
              Pesan Suara
            </label>
            <button
              type="button"
              onClick={handleEditAudio}
              className="text-xs font-semibold text-[#4648d4] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Pencil className="w-3 h-3" /> Ubah Suara
            </button>
          </div>

          <AudioPreviewCard
            audioSource={
              recordedAudio
                ? recordedAudio // Pake file audio baru jika di-edit
                : initialData?.audioUrl || null // Pake URL audio lama
            }
            initialDuration={recordedAudio ? audioDuration : 0}
          />
        </div>

        {/* 3. INPUT NAMA TAMU */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase px-1">
            Nama Tamu
          </label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Masukkan nama Anda"
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#4648d4]/30 focus:border-[#4648d4] transition-all"
          />
        </div>

        {/* 4. TOMBOL SIMPAN PERUBAHAN */}
        <Button
          variant="primary"
          fullWidth
          icon={<Save className="w-5 h-5" />}
          onClick={handleSaveUpdate}
          disabled={!hasChanges || isSubmitting || !guestName.trim()}
          className={!hasChanges ? 'opacity-50 cursor-not-allowed' : ''}
        >
          Simpan Perubahan
        </Button>
      </main>

      {/* 
        5. OVERLAY LOADING FULLSCREEN (PERSIS SEPERTI STEP 4)
        Akan muncul saat isSubmitting === true
      */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
          <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4 max-w-xs w-full">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-[#4648d4]/20 border-t-[#4648d4] animate-spin" />
              <Sparkles className="w-6 h-6 text-[#4648d4] absolute" />
            </div>
            
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">
                Memperbarui Ucapan...
              </h3>
              <p className="text-xs text-slate-500">
                Mohon tunggu sebentar, perubahan Anda sedang disimpan.
              </p>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}