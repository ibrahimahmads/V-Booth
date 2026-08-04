import { Play, Pause } from 'lucide-react';

interface AudioPlayButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export default function AudioPlayButton({ isPlaying, onToggle }: AudioPlayButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-[#4648d4] shadow-md hover:bg-white active:scale-95 transition-all flex items-center justify-center"
    >
      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
    </button>
  );
}