import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Sparkles } from 'lucide-react';
import Button from '../components/atoms/Button';
import { Helmet } from 'react-helmet-async';
import type { GreetingResponse } from '../types/greeting.types';
import { downloadGreetingPhoto } from '../utils/helper/download';
import { shareGreeting } from '../utils/helper/share';
import { BASE_URL } from '../utils/constant/constant-api';
import AudioPreviewCard from '../components/organisms/AudioPreviewCard';

export default function GreetingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [greeting, setGreeting] = useState<GreetingResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  // Fetch Data Detail Ucapan berdasarkan ID dari URL Route
  useEffect(() => {
    if (!id) return;

    const fetchGreetingDetail = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/greetings/${id}`);
        if (!response.ok) throw new Error('Ucapan tidak ditemukan');
        
        const data = await response.json();
        setGreeting(data);
      } catch (error) {
        console.error('Error fetching greeting detail:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGreetingDetail();
  }, [id]);

  const handleDownload = () => {
    if (id) downloadGreetingPhoto(id);
  };

  const handleShare = () => {
    if (greeting) {
      shareGreeting({
        greetingId: greeting.id,
        guestName: greeting.guestName,
      });
    }
  };

  // State 1: Loading Skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-white/80">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Memuat ucapan...</p>
        </div>
      </div>
    );
  }

  // State 2: Error / Data Tidak Ditemukan
  if (isError || !greeting) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Ucapan Tidak Ditemukan</h2>
            <p className="text-xs text-slate-500 mt-1">
              Link ucapan mungkin salah atau foto telah dihapus.
            </p>
          </div>
          <Button variant="primary" fullWidth onClick={() => navigate('/')}>
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  // State 3: Tampilan Utama Detail Ucapan
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-6">
        {greeting && (
        <Helmet>
          {/* Judul & Deskripsi Standar Browser */}
          <title>{`Foto Ucapan dari ${greeting.guestName} - V-Booth`}</title>
          <meta
            name="description"
            content={`Lihat foto ucapan dari ${greeting.guestName} yang dibuat di V-Booth!`}
          />

          {/* OpenGraph / Facebook / WhatsApp */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content={window.location.href} />
          <meta
            property="og:title"
            content={`Foto Ucapan dari ${greeting.guestName} ✨`}
          />
          <meta
            property="og:description"
            content={`Pesan ucapan dari ${greeting.guestName} pada tanggal ${greeting.tgl} di V-Booth.`}
          />
          <meta property="og:image" content={greeting.photoUrl} />
          <meta property="og:image:width" content="600" />
          <meta property="og:image:height" content="800" />

          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content={`Foto Ucapan dari ${greeting.guestName} ✨`}
          />
          <meta
            name="twitter:description"
            content={`Pesan ucapan dari ${greeting.guestName} di V-Booth.`}
          />
          <meta name="twitter:image" content={greeting.photoUrl} />
        </Helmet>
      )}
      
      {/* Header Navigasi Atas */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>V-Booth Gallery</span>
        </button>
      </div>

      {/* Kartu Utama Photo Strip */}
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-300">
        
        {/* Foto Strip Utama */}
        <div className="w-full bg-slate-950 flex items-center justify-center overflow-hidden">
          <img
            src={greeting.photoUrl}
            alt={greeting.guestName}
            className="w-full h-auto max-h-[65vh] object-contain"
          />
        </div>

        {/* Info Tamu, Waktu, Audio & Tombol Aksi */}
        <div className="p-5 space-y-4 bg-white">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {greeting.guestName}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {greeting.tgl} • {greeting.jam} WIB
            </p>
          </div>

          {/* Player Pesan Suara */}
          <div className="pt-2 border-t border-slate-100">
            {greeting.audioUrl ? (
              <AudioPreviewCard audioSource={greeting.audioUrl} />
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-2">
                Tamu ini tidak meninggalkan pesan suara.
              </p>
            )}
          </div>

          {/* Grid Tombol Download & Share */}
          <div className="pt-2 grid grid-cols-2 gap-3 border-t border-slate-100">
            <Button
              variant="primary"
              fullWidth
              icon={<Download className="w-4 h-4" />}
              onClick={handleDownload}
            >
              Download Foto 
            </Button>

            <Button
              variant="secondary"
              fullWidth
              icon={<Share2 className="w-4 h-4" />}
              onClick={handleShare}
            >
              Bagikan
            </Button>
          </div>
        </div>

      </div>

      {/* Footer Ringan */}
      <footer className="mt-6 text-center space-y-1">
        <p className="text-xs text-slate-500">
            Dibuat dengan ❤️ via V-Booth
        </p>
        <p className="text-xs text-slate-400">
            Developed by{' '}
            <a
            href="https://instagram.com/ibrahim.ahmd_"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
            >
            Ibrahim Ahmad
            </a>
        </p>
        </footer>
    </div>
  );
}