import { useState, useRef, useEffect } from 'react';
import { Play, Pause, AudioLines } from 'lucide-react';

interface AudioPreviewCardProps {
  audioSource: Blob | File | string | null;
  initialDuration?: number; // Durasi dalam detik dari Zustand Store
}

export default function AudioPreviewCard({
  audioSource,
  initialDuration = 0,
}: AudioPreviewCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Pastikan jika ada initialDuration (dari store), nilai tersebut langsung dipakai & dibatasi max 30s
  const validInitial = initialDuration > 0 ? Math.min(30, initialDuration) : 0;
  const [duration, setDuration] = useState<number>(validInitial);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Sync state duration jika prop initialDuration berubah
  useEffect(() => {
    if (initialDuration > 0) {
      setDuration(Math.min(30, initialDuration));
    }
  }, [initialDuration]);

  useEffect(() => {
    if (!audioSource) {
      setAudioUrl(null);
      return;
    }

    if (typeof audioSource === 'string') {
      setAudioUrl(audioSource);
    } else {
      const url = URL.createObjectURL(audioSource);
      setAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [audioSource]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const cur = audioRef.current.currentTime;
      setCurrentTime(cur);

      // Jika durasi saat ini lebih kecil dari currentTime (misal karena metadata ngaco),
      // update durasi mengikuti waktu berjalan (dengan batas max 30s)
      if (initialDuration === 0 && duration === 0 && cur > 0) {
        const rawDur = audioRef.current.duration;
        if (isFinite(rawDur) && rawDur > 0) {
          setDuration(Math.min(30, Math.round(rawDur)));
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    // HANYA baca metadata browser jika initialDuration dari Store TIDAK ADA (misal saat dibuka dari gallery cloud URL)
    if (initialDuration === 0 && audioRef.current) {
      const rawDur = audioRef.current.duration;
      if (isFinite(rawDur) && rawDur > 0) {
        // Batasi maksimal 30 detik untuk rekaman aplikasi kita
        setDuration(Math.min(30, Math.round(rawDur)));
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0); 
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const formatSecs = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs) || secs < 0) return '0:00';
    // Gunakan Math.min agar tampilan waktu tidak pernah melebihi durasi total
    const displaySecs = duration > 0 ? Math.min(secs, duration) : secs;
    const m = Math.floor(displaySecs / 60);
    const s = Math.floor(displaySecs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center gap-3 shadow-xs">
      <button
        type="button"
        onClick={togglePlay}
        className="w-11 h-11 rounded-full bg-[#4648d4] text-white flex items-center justify-center shrink-0 hover:bg-[#3b3dbf] active:scale-95 transition-all shadow-md shadow-[#4648d4]/20 cursor-pointer"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 fill-white" />
        ) : (
          <Play className="w-5 h-5 fill-white ml-0.5" />
        )}
      </button>

      <div className="flex-1 space-y-1">
        <div className="relative w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#4648d4] rounded-full transition-all duration-100"
            style={{
              width: `${
                duration && isFinite(duration) && duration > 0
                  ? Math.min(100, (currentTime / duration) * 100)
                  : 0
              }%`,
            }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-medium text-slate-400">
          <span>{formatSecs(currentTime)}</span>
          {/* TERJAMIN SINKRON SESUAI WAKTU REKAMAN ASLI STEP 3 */}
          <span>{formatSecs(duration)}</span>
        </div>
      </div>

      <div className="text-pink-500 pl-1">
        <AudioLines className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
      </div>

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          preload="metadata"
          className="hidden"
        />
      )}
    </div>
  );
}