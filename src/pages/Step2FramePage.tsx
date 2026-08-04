import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Konva from 'konva';
import Step2FrameTemplate from '../components/templates/Step2FrameTemplate';
import { type PhotoLayerItem } from '../components/organisms/KonvaFrameEditor';
import type { FrameItem } from '../types/frame.types';
import { getAllFrames } from '../services/frame.service';
import { useGreetingFormStore } from '../stores/useGreetingStore';
import { getStoredGreetingId } from '../utils/helper/storage';
import { toast } from 'sonner';


export default function Step2FramePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const stageRef = useRef<Konva.Stage | null>(null);

  const { rawPhotos, setFramedPhoto, setStep } = useGreetingFormStore();

  const [frames, setFrames] = useState<FrameItem[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<FrameItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Cek apakah user sedang dalam mode edit ucapan
  const searchParams = new URLSearchParams(location.search);
  const isEditMode = searchParams.get('mode') === 'edit' || !!getStoredGreetingId();

  // State untuk mengelola foto-foto yang tempel di Canvas
  const [photoLayers, setPhotoLayers] = useState<PhotoLayerItem[]>([]);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);

  // Fetch Bingkai
  useEffect(() => {
    const fetchFrames = async () => {
      try {
        setLoading(true);
        const data = await getAllFrames();
        setFrames(data);
        if (data.length > 0) setSelectedFrame(data[0]);
      } catch (err) {
        console.error('Gagal mengambil data bingkai:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFrames();
  }, []);

  useEffect(() => {
    if (rawPhotos.length === 0 && !isEditMode) {
      toast.warning('Ambil Foto Terlebih Dahulu', {
        description: 'Silakan ambil foto di Step 1 sebelum memilih bingkai.',
      });
      setStep(1);
      navigate('/booth/step-1', { replace: true });
    }
  }, [rawPhotos, isEditMode, navigate, setStep]);

  // Handler Tambah Foto ke Canvas (Dengan Normalisasi Orientasi)
  const handleAddPhotoToCanvas = (url: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;

    img.onload = () => {
      const newId = `photo-${Date.now()}-${Math.random()}`;

      const isLandscape = img.width > img.height;
      const targetWidth = 160;
      const initialScale = isLandscape 
        ? targetWidth / img.height 
        : targetWidth / img.width;

      const newLayer: PhotoLayerItem = {
        id: newId,
        url: url,
        x: 150,
        y: 220 + photoLayers.length * 30,
        scale: initialScale,
        rotation: isLandscape ? 90 : 0,
      };

      setPhotoLayers((prev) => [...prev, newLayer]);
      setSelectedPhotoId(newId);
    };
  };

  const handleUpdatePhotoLayer = (id: string, newAttrs: Partial<PhotoLayerItem>) => {
    setPhotoLayers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...newAttrs } : item))
    );
  };

  const handleRemovePhotoLayer = (id: string) => {
    setPhotoLayers((prev) => prev.filter((item) => item.id !== id));
    if (selectedPhotoId === id) setSelectedPhotoId(null);
  };

  const handleNextStep = () => {
    if (photoLayers.length === 0) {
      toast.warning('Bingkai Masih Kosong', {
        description: 'Masukkan minimal 1 foto dari koleksi ke dalam bingkai.',
      });
      return;
    }

    if (!selectedFrame) {
      toast.warning('Pilih Bingkai', {
        description: 'Silakan pilih desain bingkai terlebih dahulu.',
      });
      return;
    }

    if (stageRef.current) {
      setSelectedPhotoId(null);

      setTimeout(() => {
        if (stageRef.current) {
          const dataUrl = stageRef.current.toDataURL({
            mimeType: 'image/jpeg',
            quality: 0.75,
            pixelRatio: 1.5,
          });
          fetch(dataUrl)
            .then((res) => res.blob())
            .then((blob) => {
              const framedFile = new File([blob], 'framed-greeting.jpg', {
                type: 'image/jpeg',
              });
              setFramedPhoto(framedFile);

              // JIKA DALAM MODE EDIT: Langsung balik ke Halaman Edit Hub
              if (isEditMode) {
                toast.success('Foto Berhasil Diperbarui!');
                navigate('/booth/edit');
              } else {
                setStep(3);
                navigate('/booth/step-3');
              }
            });
        }
      }, 50);
    }
  };

  const handleBackStep = () => {
    setStep(1);
    navigate(isEditMode ? '/booth/step-1?mode=edit' : '/booth/step-1');
  };

  return (
    <Step2FrameTemplate
      rawPhotos={rawPhotos}
      photoLayers={photoLayers}
      frames={frames}
      selectedFrame={selectedFrame}
      selectedPhotoId={selectedPhotoId}
      loading={loading}
      isEditMode={isEditMode}
      stageRef={stageRef}
      onSelectFrame={(frame) => setSelectedFrame(frame)}
      onSelectPhotoLayer={(id) => setSelectedPhotoId(id)}
      onAddPhotoToCanvas={handleAddPhotoToCanvas}
      onUpdatePhotoLayer={handleUpdatePhotoLayer}
      onRemovePhotoLayer={handleRemovePhotoLayer}
      onNextStep={handleNextStep}
      onBackStep={handleBackStep}
    />
  );
}