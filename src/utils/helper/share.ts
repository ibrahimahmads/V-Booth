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

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  // 2. Hanya jalankan Web Share API jika benar-benar di Mobile dan didukung browser
  if (isMobile && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
        fallbackCopyToClipboard(shareUrl);
      }
    }
  } else {
    // 3. Jika di PC / Desktop / Laptop, SELALU jalankan Copy to Clipboard
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