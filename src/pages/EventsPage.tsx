import { useEffect, useState } from 'react';
import EventCard from '@/components/cards/EventCard';
import { supabase } from '@/utils/supabase';

interface Event {
  id: number;
  event_name: string;
  image?: string;
  images?: string[];
  description: string;
  joining_url?: string;
  date?: string;
  status?: string;
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          const processedEvents = data.map((event) => {
            const { images: imagesData, ...rest } = event;
            let imageLinks: string[] = [];

            if (Array.isArray(imagesData)) {
              imageLinks = imagesData;
            } else if (typeof imagesData === 'string') {
              const trimmedString = imagesData.trim();
              if (trimmedString.startsWith('[') && trimmedString.endsWith(']')) {
                try {
                  imageLinks = JSON.parse(trimmedString);
                } catch (e) {
                  console.error('Failed to parse images JSON string:', e);
                  imageLinks = [];
                }
              } else if (trimmedString.length > 0) {
                imageLinks = [trimmedString];
              }
            }
            
            return { ...rest, images: imageLinks } as Event;
          });
          setEvents(processedEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-background flex justify-center items-center">
        <p className="text-xl text-muted-foreground">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            Chess Club Events
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join us for thrilling tournaments, casual chess meetups, and educational workshops.
          </p>
        </div>

        {events.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8">All Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  eventName={event.event_name}
                  image={event.image}
                  images={event.images}
                  description={event.description}
                  joiningUrl={event.joining_url}
                  date={event.date}
                  status={event.status}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
