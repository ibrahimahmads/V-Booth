import { useNavigate } from 'react-router-dom';
import { Home, CameraOff, ArrowLeft } from 'lucide-react';
import Header from '../components/molecules/Header';
import Button from '../components/atoms/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col justify-between pb-12">
      <Header />

      <main className="max-w-md w-full mx-auto px-4 py-8 flex-1 flex flex-col items-center justify-center text-center space-y-6">
        {/* Visual Illustration Badge */}
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-indigo-50 border-8 border-indigo-100/60 flex items-center justify-center">
            <CameraOff className="w-12 h-12 text-[#4648d4]" />
          </div>
          <span className="absolute -bottom-2 bg-[#4648d4] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
            ERROR 404
          </span>
        </div>

        {/* Main Text */}
        <div className="space-y-2 pt-2">
          <h1 className="text-2xl font-extrabold text-[#111827]">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
            Waduh! Sepertinya link yang Anda cari salah atau bingkai foto ini sudah dipindahkan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3 pt-4">
          <Button
            variant="primary"
            className="w-full justify-center py-3.5 rounded-2xl text-sm font-semibold gap-2 shadow-md shadow-[#4648d4]/25"
            icon={<Home className="w-4 h-4" />}
            onClick={() => navigate('/booth/step-1')}
          >
            Kembali ke Photobooth
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-center py-3 text-sm font-semibold gap-2 text-slate-600"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
          >
            Ke Halaman Sebelumnya
          </Button>
        </div>
      </main>
    </div>
  );
}