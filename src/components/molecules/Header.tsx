import { PartyPopper } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-[#f7f9fb] border-b border-[#e2e8f0]">
      <div className="flex items-center gap-2">
        <PartyPopper className="w-6 h-6 text-[#4648d4]" />
        <h1 className="text-xl font-bold text-[#4648d4]">V-Booth</h1>
      </div>
      <div className="w-9 h-9 rounded-full bg-[#e1e0ff] border border-[#4648d4]/30 flex items-center justify-center overflow-hidden">
        <span className="text-xs font-bold text-[#4648d4]">VB</span>
      </div>
    </header>
  );
}