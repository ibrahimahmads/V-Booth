import { toast } from 'sonner';

interface ShareDataProps {
  greetingId: string;
  guestName: string;
}

export const shareGreeting = async ({ greetingId, guestName }: ShareDataProps) => {
  // Construct URL detail ucapan (sesuaikan dengan route detail/modal kamu)
  const shareUrl = `${window.location.origin}/greeting/${greetingId}`;
  
  const shareData = {
    title: `Foto Ucapan dari ${guestName} - V-Booth`,
    text: `Lihat foto dan ucapan dari ${guestName} di V-Booth!`,
    url: shareUrl,
  };

  // 1. Cek Apakah Browser Mendukung Web Share API (HP/Mobile Browser)
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      // Panggilan sukses (user memilih aplikasi untuk share)
    } catch (error) {
      // Menangani jika user membatalkan share (AbortError)
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
        fallbackCopyToClipboard(shareUrl);
      }
    }
  } else {
    // 2. Fallback untuk Desktop/Browser yang tidak mendukung Web Share API
    fallbackCopyToClipboard(shareUrl);
  }
};

// Helper Fungsi Fallback: Salin Link ke Clipboard
const fallbackCopyToClipboard = async (url: string) => {
  try {
    await navigator.clipboard.writeText(url);
    toast.success('Link Tersalin!', {
      description: 'Link foto ucapan berhasil disalin ke clipboard.',
    });
  } catch (err) {
    console.error('Gagal menyalin link:', err);
    toast.error('Gagal Menyalin Link', {
      description: 'Silakan salin URL secara manual.',
    });
  }
};