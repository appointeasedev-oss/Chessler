import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const TopBar = () => {
  const [announcement, setAnnouncement] = useState<{ id: number; message: string } | null>(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('id, message')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is not an error here
        console.error('Error fetching announcement:', error);
      } else {
        setAnnouncement(data);
      }
    };

    fetchAnnouncement();
  }, []);

  if (!announcement) {
    return null;
  }

  return (
    <div className="bg-black text-white text-center py-2 px-4">
      <p className="text-sm">{announcement.message}</p>
    </div>
  );
};

export default TopBar;
