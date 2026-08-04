import type { GreetingResponse } from "../../types/greeting.types";

interface GreetingCardProps {
  greeting: GreetingResponse;
  onClick: () => void;
}

export default function GreetingCard({ greeting, onClick }: GreetingCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-98 flex flex-col group"
    >
      {/* Photo Container */}
      <div className="relative aspect-3/4 w-full bg-slate-100 overflow-hidden">
        <img
          src={greeting.photoUrl}
          alt={`Ucapan dari ${greeting.guestName}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-white flex flex-col justify-between flex-1 border-t border-slate-50">
        <h4 className="font-bold text-sm text-[#0F172A] uppercase tracking-wide truncate">
          {greeting.guestName}
        </h4>
        <div className="flex justify-between items-center text-[11px] text-[#64748B] mt-1">
          <span>{greeting.tgl}</span>
          <span>{greeting.jam} WIB</span>
        </div>
      </div>
    </div>
  );
}