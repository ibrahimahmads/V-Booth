import { useState } from 'react';
import GreetingCard from '../organisms/GreetingCard';
import Header from '../molecules/Header';
import BottomNav from '../molecules/BottomNav';
import type { GreetingResponse } from '../../types/greeting.types';
import GreetingDetailModal from '../organisms/GreetingDetailModel';

interface GalleryTemplateProps {
  greetings: GreetingResponse[];
  loading: boolean;
  onNavigateToAdd: () => void;
}

export default function GalleryTemplate({
  greetings,
  loading,
}: GalleryTemplateProps) {
  // State untuk menyimpan item ucapan yang sedang diklik/dibuka detailnya
  const [selectedGreeting, setSelectedGreeting] = useState<GreetingResponse | null>(null);

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col justify-between pb-24">
      <Header />

      {/* Hero Header Event */}
      <div className="text-center py-6 px-4 space-y-1 border-b border-[#e2e8f0]/60 bg-white">
        <span className="text-xs uppercase tracking-[0.2em] text-[#64748B] font-medium">
          WEDDING MEMORIES OF
        </span>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#4648d4]">
          Rina & Farhan
        </h2>
        <p className="text-xs text-[#64748B] tracking-widest">16 AGUSTUS 2026</p>
      </div>

      {/* Content Area */}
      <main className="max-w-md w-full mx-auto px-4 py-4 flex-1">
        {loading && (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && greetings.length === 0 && (
          <div className="text-center py-12 space-y-3">
            <p className="text-sm text-slate-500">Belum ada ucapan. Jadilah yang pertama!</p>
          </div>
        )}

        {/* 2-Column Gallery Grid */}
        {!loading && greetings.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {greetings.map((item, index) => (
              <GreetingCard
                key={index}
                greeting={item}
                onClick={() => setSelectedGreeting(item)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal Detail Pop-up */}
      <GreetingDetailModal
        isOpen={Boolean(selectedGreeting)}
        greeting={selectedGreeting}
        onClose={() => setSelectedGreeting(null)}
      />

      {/* Bottom Nav */}
      <BottomNav/>
    </div>
  );
}