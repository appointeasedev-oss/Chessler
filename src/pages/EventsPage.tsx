import { useEffect, useState } from 'react';
import EventCard from '@/components/cards/EventCard';
import { ImageModal } from '@/components/ui/ImageModal';
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
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

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
          setEvents(data as Event[]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const registrationsOpenEvents = events.filter(event => event.status === 'Registrations open');
  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const pastEvents = events.filter(event => event.status === 'completed' || event.status === 'Completed');

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

        {/* Registrations Open Events */}
        {registrationsOpenEvents.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Registrations Open</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {registrationsOpenEvents.map((event) => (
                <EventCard
                  key={event.id}
                  eventName={event.event_name}
                  image={event.image}
                  images={event.images}
                  description={event.description}
                  joiningUrl={event.joining_url}
                  date={event.date}
                  status={event.status}
                  onCardClick={() => handleEventClick(event)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  eventName={event.event_name}
                  image={event.image}
                  images={event.images}
                  description={event.description}
                  joiningUrl={event.joining_url}
                  date={event.date}
                  status={event.status}
                  onCardClick={() => handleEventClick(event)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event) => (
                <EventCard
                  key={event.id}
                  eventName={event.event_name}
                  image={event.image}
                  images={event.images}
                  description={event.description}
                  joiningUrl={event.joining_url}
                  date={event.date}
                  status={event.status}
                  onCardClick={() => handleEventClick(event)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal rendered at page level */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        images={selectedEvent?.images || []}
        title={selectedEvent?.event_name || ''}
        description={selectedEvent?.description}
      />
    </div>
  );
};

export default EventsPage;