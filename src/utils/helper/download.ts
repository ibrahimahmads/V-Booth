import { BASE_URL } from "../constant/constant-api";
import { toast } from 'sonner';

export const downloadGreetingPhoto = (greetingId:string) => {
  if (!greetingId) {
    toast.error('Gagal Download', {
      description: 'ID foto ucapan tidak valid.',
    });
    return;
  }

  try {
    const downloadUrl = `${BASE_URL}/greetings/${greetingId}/download`;

    const link = document.createElement('a');
    link.href = downloadUrl;
    // Disarankan beri nama default file agar browser tahu ini adalah attachment
    link.setAttribute('download', `vbooth-greeting-${greetingId}.png`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.info('Download Foto', {
      description: 'Memulai unduhan foto ucapan...',
    });
  } catch (error) {
    console.error('Error triggering download:', error);
    toast.error('Gagal Download', {
      description: 'Terjadi kesalahan saat memicu unduhan.',
    });
  }
};