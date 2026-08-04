import { useEffect } from 'react';
import { X } from 'lucide-react';
import AudioPreviewCard from './AudioPreviewCard';
import type { GreetingResponse } from '../../types/greeting.types';
// import { useGreetingFormStore } from '../../stores/useGreetingStore';

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
  // const {audioDuration } = useGreetingFormStore();
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

  return (
    /* 
      1. FIX Z-INDEX & OVERLAY CONTAINER
      Gunakan z-[100] atau z-50 agar PASTI berada di atas BottomNav (z-40/z-30)
      Gunakan flex items-end (mobile) atau items-center (desktop)
    */
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
        </div>

      </div>
    </div>
  );
}