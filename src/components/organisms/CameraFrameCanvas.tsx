import { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, Trash2, Grid, SwitchCamera } from 'lucide-react';
import Badge from '../atoms/Badge';
import IconButton from '../atoms/IconButton';

export type AspectRatioType = '1:1' | '9:16';

interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
  focusMode?: string[];
}

interface ExtendedMediaTrackConstraintSet extends MediaTrackConstraintSet {
  focusMode?: string;
}

interface CameraFrameCanvasProps {
  photos: string[];
  webcamRef: React.RefObject<Webcam | null>;
  selectedIndex: number | null;
  aspectRatio: AspectRatioType;
  onChangeAspectRatio: (ratio: AspectRatioType) => void;
  onSelectPhoto: (index: number | null) => void;
  onDeletePhoto: (index: number) => void;
}

export default function CameraFrameCanvas({
  photos,
  webcamRef,
  selectedIndex,
  aspectRatio,
  onChangeAspectRatio,
  onSelectPhoto,
  onDeletePhoto,
}: CameraFrameCanvasProps) {
  const isPreviewing = selectedIndex !== null;
  const isMaxPhotos = photos.length >= 3;

  // QoL States
  const [showGrid, setShowGrid] = useState(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Map untuk menyimpan aspek rasio tiap foto berdasarkan indeksnya
  const [photoRatios, setPhotoRatios] = useState<Record<number, AspectRatioType>>({});

  // Catat aspek rasio saat foto baru bertambah
  useEffect(() => {
    if (photos.length > 0) {
      const lastIdx = photos.length - 1;
      if (!photoRatios[lastIdx]) {
        setPhotoRatios((prev) => ({ ...prev, [lastIdx]: aspectRatio }));
      }
    }
  }, [photos, aspectRatio, photoRatios]);

  const handleToggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleTapToFocus = async () => {
    if (!webcamRef.current?.stream) return;
    const videoTrack = webcamRef.current.stream.getVideoTracks()[0];
    if (!videoTrack) return;

    if ('getCapabilities' in videoTrack) {
      const capabilities = videoTrack.getCapabilities() as ExtendedMediaTrackCapabilities;
      if (capabilities.focusMode && capabilities.focusMode.includes('continuous')) {
        try {
          const constraints: ExtendedMediaTrackConstraintSet = { focusMode: 'continuous' };
          await videoTrack.applyConstraints({
            advanced: [constraints as MediaTrackConstraintSet],
          });
        } catch (err) {
          console.warn('Auto focus tidak didukung di perangkat ini:', err);
        }
      }
    }
  };

  const videoConstraints = {
    facingMode: facingMode,
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    aspectRatio: aspectRatio === '1:1' ? 1 : 9 / 16,
  };

  const activeAspectRatio: AspectRatioType =
    isPreviewing && selectedIndex !== null && photoRatios[selectedIndex]
      ? photoRatios[selectedIndex]
      : aspectRatio;

  return (
    <div className="w-full">
      {/* 
        AREA KAMERA UTAMA 
        Tinggi diikat rapat dengan max-h agar tidak memanjang berlebihan di HP
      */}
      <div
        onClick={handleTapToFocus}
        className={`relative w-full rounded-3xl overflow-hidden shadow-xl bg-black flex items-center justify-center transition-all duration-300 ${
          activeAspectRatio === '1:1'
            ? 'aspect-square'
            : 'aspect-9/16 max-h-[58vh] md:max-h-500px'
        }`}
      >
        {/* KONTROL TOP-BAR (Grid, Switch Camera, Aspect Ratio) */}
        {!isPreviewing && !isMaxPhotos && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 pointer-events-auto">
            {/* Grid Toggle */}
            <button
              type="button"
              onClick={() => setShowGrid((prev) => !prev)}
              className={`p-1.5 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
                showGrid
                  ? 'bg-[#4648d4] border-[#4648d4] text-white'
                  : 'bg-black/40 border-white/20 text-slate-300 hover:text-white'
              }`}
              title="Garis Bantu (Grid)"
            >
              <Grid className="w-4 h-4" />
            </button>

            {/* Switch Camera */}
            <button
              type="button"
              onClick={handleToggleCamera}
              className="p-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-slate-300 hover:text-white active:scale-95 transition-all cursor-pointer"
              title={`Ganti Kamera (${facingMode === 'user' ? 'Depan' : 'Belakang'})`}
            >
              <SwitchCamera className="w-4 h-4" />
            </button>

            {/* Ratio Toggle */}
            <div className="flex gap-1 bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/20">
              <button
                type="button"
                onClick={() => onChangeAspectRatio('1:1')}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  aspectRatio === '1:1'
                    ? 'bg-[#4648d4] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                1:1
              </button>
              <button
                type="button"
                onClick={() => onChangeAspectRatio('9:16')}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  aspectRatio === '9:16'
                    ? 'bg-[#4648d4] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                9:16
              </button>
            </div>
          </div>
        )}

        {/* 1. LIVE CAMERA MODE */}
        {!isPreviewing && !isMaxPhotos && (
          <div className="w-full h-full relative overflow-hidden">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              screenshotQuality={0.85}
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover"
              mirrored={facingMode === 'user'}
            />

            {/* OVERLAY GRID 3x3 */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 z-10">
                <div className="border-r border-b border-white/25" />
                <div className="border-r border-b border-white/25" />
                <div className="border-b border-white/25" />
                <div className="border-r border-b border-white/25" />
                <div className="border-r border-b border-white/25" />
                <div className="border-b border-white/25" />
                <div className="border-r border-white/25" />
                <div className="border-r border-white/25" />
                <div />
              </div>
            )}

            {/* BADGE KIRI ATAS */}
            <div className="absolute top-3 left-3 pointer-events-none z-20">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-sm">
                <Camera className="w-3.5 h-3.5 text-slate-200" />
                <span>{facingMode === 'user' ? 'Depan' : 'Belakang'}</span>
                <span className="text-slate-400 text-[10px]">• {aspectRatio}</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. PREVIEW MODE */}
        {(isPreviewing || isMaxPhotos) && (
          <div className="w-full h-full relative flex items-center justify-center bg-slate-950">
            <img
              src={photos[selectedIndex ?? photos.length - 1]}
              alt="Preview Selected"
              className="w-full h-full object-contain"
            />

            <div className="absolute top-3 left-3 pointer-events-none z-10">
              <Badge>PREVIEW FOTO #{(selectedIndex ?? photos.length - 1) + 1}</Badge>
            </div>

            <div className="absolute top-3 right-3 flex gap-2 z-10 pointer-events-auto">
              {!isMaxPhotos && (
                <IconButton
                  icon={<Camera className="w-4 h-4 text-white" />}
                  onClick={() => onSelectPhoto(null)}
                  title="Kembali ke Kamera"
                />
              )}
              <IconButton
                icon={<Trash2 className="w-4 h-4 text-red-400" />}
                onClick={() => {
                  const targetIdx = selectedIndex ?? photos.length - 1;
                  onDeletePhoto(targetIdx);
                  onSelectPhoto(null);
                }}
                title="Hapus Foto Ini"
              />
            </div>
          </div>
        )}

        {/* 
          3. FLOATING THUMBNAILS (NATIVE CAMERA STYLE)
          Thumbnail diletakkan Melayang di Pojok Kiri Bawah Kamera
        */}
        {photos.length > 0 && (
          <div className="absolute bottom-3 left-3 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 pointer-events-auto shadow-lg animate-in fade-in zoom-in-95">
            {photos.map((src, index) => {
              const isActive = selectedIndex === index;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Biar tidak memicu tap-to-focus
                    onSelectPhoto(isActive ? null : index);
                  }}
                  className={`relative w-10 h-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer active:scale-90 ${
                    isActive
                      ? 'border-[#4648d4] scale-105 ring-2 ring-[#4648d4]/40'
                      : 'border-white/70 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={src}
                    alt={`Thumb ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[8px] font-bold px-1 rounded-xs">
                    #{index + 1}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}