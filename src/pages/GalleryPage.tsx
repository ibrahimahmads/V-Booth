import { useEffect, useState } from 'react';
import GalleryTemplate from '../components/templates/GalleryTemplate';
import { getAllGreetings } from '../services/greeting.service';
import type { GreetingResponse } from '../types/greeting.types';

export default function GalleryPage() {
  const [greetings, setGreetings] = useState<GreetingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGreetings = async () => {
    try {
      setLoading(true);
      const data = await getAllGreetings();
      setGreetings(data);
    } catch (err) {
      console.error('Gagal mengambil data galeri:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGreetings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GalleryTemplate
      greetings={greetings}
      loading={loading}
      onNavigateToAdd={() => {}}
    />
  );
}