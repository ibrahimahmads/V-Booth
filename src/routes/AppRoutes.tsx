import { Routes, Route} from 'react-router-dom';
import GalleryPage from '../pages/GalleryPage';
import Step1CapturePage from '../pages/Step1CapturePage';
import Step2FramePage from '../pages/Step2FramePage';
import Step3AudioPage from '../pages/Step3AudioPage';
import Step4ReviewPage from '../pages/Step4ReviewPage';
import SuccessPage from '../pages/SuccessPage';
import NotFoundPage from '../pages/NotFoundPage';
import EditGreetingPage from '../pages/EditGreetingPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Halaman Utama / Galeri Memori */}
      <Route path="/" element={<GalleryPage />} />

      <Route path="/booth/step-1" element={<Step1CapturePage />} />
      <Route path="/booth/step-2" element={<Step2FramePage />} />
      <Route path="/booth/step-3" element={<Step3AudioPage />} />
      <Route path="/booth/step-4" element={<Step4ReviewPage />} />
      <Route path="/booth/edit" element={<EditGreetingPage />} />

      <Route path="/booth/success" element={<SuccessPage />} />

      {/* Wildcard Fallback: Jika URL tidak ditemukan, kembalikan ke Gallery */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}