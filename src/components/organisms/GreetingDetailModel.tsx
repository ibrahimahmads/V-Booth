import { useEffect } from 'react';
import { X, Download, Share2 } from 'lucide-react';
import AudioPreviewCard from './AudioPreviewCard';
import type { GreetingResponse } from '../../types/greeting.types';
import Button from '../atoms/Button';
import { downloadGreetingPhoto } from '../../utils/helper/download';
import { shareGreeting } from '../../utils/helper/share';

interface GreetingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  greeting: GreetingResponse | null; 
}

export default function GreetingDetailModal({
  isOpen,
  onClose,
  greeting,
}: GreetingDetailModalProps) {
  // Lock scroll background body ketika modal terbuka agar tidak 'ghost scrolling'
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !greeting) return null;
  // Handler Download
    const handleDownload = () => {
      if (greeting.id) downloadGreetingPhoto(greeting.id);
    };
  
    // Handler Share
    const handleShare = () => {
      if (greeting) {
        shareGreeting({
          greetingId: greeting.id,
          guestName: greeting.guestName,
        });
      }
    };

  return (
    <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in">
      
      {/* Backdrop Clickable untuk Tutup Modal */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* 
        2. FIX SCROLLABLE MODAL CONTENT
        - max-h-[90vh]: Membatasi tinggi modal 90% layar agar tidak terpotong BottomNav
        - overflow-y-auto: Mengaktifkan scroll internal modal dengan mulus (smooth scrolling)
      */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl z-10 flex flex-col">
        
        {/* Tombol Close Mengambang (Sticky) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* GAMBAR FOTO UTAMA */}
        <div className="w-full bg-slate-950 rounded-t-3xl overflow-hidden flex items-center justify-center">
          <img
            src={greeting.photoUrl}
            alt={greeting.guestName}
            className="w-full h-auto max-h-[60vh] object-contain"
          />
        </div>

        {/* ISI CONTAINER DETAIL (NAMA, WAKTU, AUDIO) */}
        <div className="p-5 space-y-4 bg-white flex-1">
          <div>
            <h3 className="text-xl font-bold text-[#111827]">
              {greeting.guestName}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {greeting.tgl} • {greeting.jam} WIB
            </p>
          </div>

          {/* AUDIO PLAYER & KONTEN LAINNYA */}
          <div className="pt-2 border-t border-slate-100">
            {greeting.audioUrl ? (
              <AudioPreviewCard audioSource={greeting.audioUrl}/>
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-2">
                Tamu ini tidak meninggalkan pesan suara.
              </p>
            )}
          </div>
          <div className="pt-3 grid grid-cols-2 gap-3 border-t border-slate-100">
            {/* Tombol Download */}
            <Button
              variant="primary"
              fullWidth
              onClick={handleDownload}
              icon={<Download className="w-4 h-4" />}
            >
              Download Foto 
            </Button>

            <Button
              variant="secondary"
              fullWidth
              onClick={handleShare}
              icon={<Share2 className="w-4 h-4" />}
            >
              Bagikan
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}