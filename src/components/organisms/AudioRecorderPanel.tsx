import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Square, Play, RotateCcw, AlertTriangle } from 'lucide-react';
import Button from '../atoms/Button';

interface AudioRecorderPanelProps {
  onRecordingComplete: (audioFile: File, duration:number) => void;
  onResetRecording: () => void;
}

const MAX_RECORDING_TIME = 30;

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Helper untuk memilih MIME Type audio terbaik yang didukung browser
const getSupportedMimeType = (): { mimeType: string; ext: string } => {
  const types = [
    { mimeType: 'audio/mp4', ext: 'm4a' },
    { mimeType: 'audio/aac', ext: 'aac' },
    { mimeType: 'audio/webm;codecs=opus', ext: 'webm' },
    { mimeType: 'audio/webm', ext: 'webm' },
  ];

  for (const t of types) {
    if (MediaRecorder.isTypeSupported(t.mimeType)) {
      return t;
    }
  }
  return { mimeType: '', ext: 'wav' };
};

export default function AudioRecorderPanel({
  onRecordingComplete,
  onResetRecording,
}: AudioRecorderPanelProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const recordingTimeRef = useRef(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerIntervalRef = useRef<number | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const selectedMimeTypeRef = useRef<{ mimeType: string; ext: string }>({
    mimeType: '',
    ext: 'webm',
  });
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current !== null) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const stopRecordingAction = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerIntervalRef.current !== null) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  }, [isRecording]);

  useEffect(() => {
    if (recordingTime >= MAX_RECORDING_TIME) {
      stopRecordingAction();
    }
  }, [recordingTime, stopRecordingAction]);

  useEffect(() => {
  recordingTimeRef.current = recordingTime;
}, [recordingTime]);

  const startRecording = async () => {
    setPermissionError(null);
    setAudioUrl(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioConfig = getSupportedMimeType();
      selectedMimeTypeRef.current = audioConfig;

      const options = audioConfig.mimeType
        ? { mimeType: audioConfig.mimeType }
        : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const currentConfig = selectedMimeTypeRef.current;
        const audioBlob = new Blob(audioChunksRef.current, {
          type: currentConfig.mimeType || 'audio/webm',
        });

        const audioFile = new File(
          [audioBlob],
          `voice-greeting.${currentConfig.ext}`,
          { type: audioBlob.type }
        );

        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // GUNAKAN REF UNTUK MEMASTIKAN DETIK REKAMAN TERAKHIR TERCATAT 100% AKURAT
        // Batasi maksimal 30 detik jika ada sedikit 'overflow' milidetik dari timer
        const finalDuration = Math.min(30, Math.max(1, recordingTimeRef.current));
        
        onRecordingComplete(audioFile, finalDuration);
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Gagal akses microphone:', err);
      setPermissionError('Gagal mengakses mikrofon. Pastikan izin diberikan.');
    }
  };

  const playPreview = () => {
    if (audioUrl && audioPlayerRef.current) {
      audioPlayerRef.current.play();
    }
  };

  const resetRecording = () => {
    setAudioUrl(null);
    setRecordingTime(0);
    onResetRecording();
  };

  const renderPrimaryActionButton = () => {
    if (isRecording) {
      return (
        <Button
          variant="primary"
          className="w-full justify-center py-3 rounded-xl bg-red-500 hover:bg-red-600 shadow-red-500/20"
          icon={<Square className="w-5 h-5 fill-white" />}
          onClick={stopRecordingAction}
        >
          Berhenti Merekam
        </Button>
      );
    }

    if (audioUrl) {
      return (
        <Button
          variant="secondary"
          className="w-full justify-center py-3 rounded-xl"
          icon={<RotateCcw className="w-5 h-5 text-slate-700" />}
          onClick={resetRecording}
        >
          Rekam Ulang Ucapan
        </Button>
      );
    }

    return (
      <Button
        variant="primary"
        className="w-full justify-center py-3 rounded-xl"
        icon={<Mic className="w-5 h-5" />}
        onClick={startRecording}
      >
        Mulai Merekam
      </Button>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center gap-6">
      <div className="text-center space-y-2.5">
        <h2 className="text-3xl font-bold text-[#111827]">Ucapan Suara</h2>
        <p className="text-base text-slate-500 max-w-xs mx-auto">
          Tinggalkan pesan hangat untuk tuan rumah acara!
        </p>
      </div>

      <div className="relative my-2">
        <div
          className={`rounded-full p-10 transition-colors duration-300 ${
            isRecording ? 'bg-red-50' : 'bg-slate-100'
          }`}
        >
          <Mic
            className={`w-12 h-12 transition-colors duration-300 ${
              isRecording ? 'text-red-500 animate-pulse' : 'text-slate-400'
            }`}
          />
        </div>
        {isRecording && (
          <div className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
          </div>
        )}
      </div>

      <div className="text-center w-full">
        <div className="flex items-center justify-center gap-3 font-mono">
          <span
            className={`text-4xl font-bold transition-colors ${
              isRecording ? 'text-red-600' : 'text-[#111827]'
            }`}
          >
            {formatTime(recordingTime)}
          </span>
          <span className="text-3xl text-slate-300">/</span>
          <span className="text-2xl text-slate-400 font-medium">00:30</span>
        </div>

        {permissionError && (
          <div className="flex items-center gap-2 justify-center mt-3 text-red-600 bg-red-50 px-3 py-1.5 rounded-lg text-xs">
            <AlertTriangle className="w-4 h-4" />
            {permissionError}
          </div>
        )}
      </div>

      <div className="w-full space-y-3 pt-2">
        {renderPrimaryActionButton()}

        {audioUrl && !isRecording && (
          <Button
            variant="secondary"
            className="w-full justify-center py-3 rounded-xl border border-slate-300"
            icon={<Play className="w-5 h-5 fill-slate-700 text-slate-700" />}
            onClick={playPreview}
          >
            Dengarkan Hasil Rekaman
          </Button>
        )}
      </div>

      <p className="text-xs text-slate-400 text-center px-4 leading-relaxed">
        Rekaman akan berhenti secara otomatis dalam 30 detik.
      </p>

      {audioUrl && <audio ref={audioPlayerRef} src={audioUrl} className="hidden" />}
    </div>
  );
}