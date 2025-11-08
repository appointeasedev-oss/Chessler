import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Calendar, Trophy, Lightbulb, Star, Award, Zap, Target, Rocket, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TimelineEvent {
  id: number;
  year: string;
  eventName: string;
  description: string;
  photo: string;
  date?: string; // Add optional date field for full date info
}

interface OurStarPlayersProps {
  maxEvents?: number;
  showTitle?: boolean;
  title?: string;
  className?: string;
}

const OurStarPlayers = ({
  maxEvents,
  showTitle = true,
  title = "Our Star Players",
  className = "pt-20 bg-black text-white pb-40"
}: OurStarPlayersProps) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimelineEvents = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('timeline')
          .select('*')
          .order('year', { ascending: false })
          .order('id', { ascending: false });

        if (maxEvents) {
          query = query.limit(maxEvents);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        if (data) {
          const formattedEvents = data.map(event => ({
            ...event,
            eventName: event.event_name
          }));
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error('Error fetching timeline events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineEvents();
  }, [maxEvents]);

  const getDateColor = (index: number) => {
    const colors = [
      'bg-orange-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-blue-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-teal-500',
    ];
    return colors[index % colors.length];
  };

  const getDateColorHex = (index: number) => {
    const colors = ['#f97316', '#22c55e', '#a855f7', '#3b82f6', '#ef4444', '#6366f1', '#ec4899', '#14b8a6'];
    return colors[index % colors.length];
  };

  const getCheckpointIcon = (index: number) => {
    const icons = [Calendar, Trophy, Lightbulb, Star, Award, Zap, Target, Rocket];
    return icons[index % icons.length];
  };

  if (loading) {
    return (
      <section className={className}>
        <div className="container mx-auto px-4 flex justify-center items-center h-64">
          <p className="text-xl text-white">Loading timeline...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={className}>
      <div className="container mx-auto px-4">
        {showTitle && (
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {title}
            </h2>
          </div>
        )}

        <div className="max-w-7xl mx-auto relative">
          <div className="absolute left-1/2 transform -translate-x-0.5 top-0 bottom-0 w-1 bg-gray-400 hidden md:block" />

          {events.map((event, index) => {
            const CheckpointIcon = getCheckpointIcon(index);
            
            return (
              <div key={event.id} className="relative mb-16 hidden md:block">
                <div className="absolute left-1/2 transform -translate-x-1/2 top-8 z-20 hidden md:block">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-white"
                    style={{ backgroundColor: getDateColorHex(index) }}
                  >
                    <CheckpointIcon className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-1/2 pr-8 flex flex-col items-end">
                    {index % 2 === 0 && (
                      <>
                        <div className="mb-6 w-full max-w-lg">
                          <div className={`${getDateColor(index)} text-white px-6 py-5 rounded-full text-center font-bold relative shadow-lg w-full`}>
                            <div className="text-xl font-semibold whitespace-nowrap">
                              {event.year}
                            </div>
                            <div
                              className="absolute top-1/2 transform -translate-y-1/2 right-0 translate-x-full w-0 h-0"
                              style={{
                                borderTop: '15px solid transparent',
                                borderBottom: '15px solid transparent',
                                borderLeft: `15px solid ${getDateColorHex(index)}`
                              }}
                            />
                          </div>
                        </div>

                        <div className="bg-gray-100 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full max-w-lg">
                          <div className="p-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                              {event.eventName}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-base">
                              {event.description}
                            </p>
                            {event.photo !== "#" && (
                              <div className="w-full h-64 overflow-hidden rounded-lg mt-6">
                                <img
                                  src={event.photo}
                                  alt={event.eventName}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="w-1/2 pl-8 flex flex-col items-start">
                    {index % 2 === 1 && (
                      <>
                        <div className="mb-6 w-full max-w-lg">
                          <div className={`${getDateColor(index)} text-white px-6 py-5 rounded-full text-center font-bold relative shadow-lg w-full`}>
                            <div className="text-xl font-semibold whitespace-nowrap">
                              {event.year}
                            </div>
                            <div
                              className="absolute top-1/2 transform -translate-y-1/2 left-0 -translate-x-full w-0 h-0"
                              style={{
                                borderTop: '15px solid transparent',
                                borderBottom: '15px solid transparent',
                                borderRight: `15px solid ${getDateColorHex(index)}`
                              }}
                            />
                          </div>
                        </div>

                        <div className="bg-gray-100 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full max-w-lg">
                          <div className="p-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                              {event.eventName}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-base">
                              {event.description}
                            </p>
                            {event.photo !== "#" && (
                              <div className="w-full h-64 overflow-hidden rounded-lg mt-6">
                                <img
                                  src={event.photo}
                                  alt={event.eventName}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {events.map((event, index) => {
            
            return (
              <div key={`mobile-${event.id}`} className="relative mb-6 md:hidden">
                <div className="mb-6 text-center">
                  <div className={`${getDateColor(index)} text-white px-12 py-4 rounded-full inline-block font-bold shadow-lg`}>
                    <div className="text-xl font-semibold">
                      {event.year}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-lg shadow-lg overflow-hidden">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                      {event.eventName}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-base">
                      {event.description}
                    </p>
                    {event.photo !== "#" && (
                      <div className="w-full h-64 overflow-hidden rounded-lg mt-6">
                        <img
                          src={event.photo}
                          alt={event.eventName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        
{maxEvents && (
  <div className="text-center mt-14">
    <Link
      to="/star-players"
      className="inline-flex items-center justify-center gap-2 bg-white text-black py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium text-sm"
    >
      View All Star Players
      <ArrowRight className="h-4 w-4" />
    </Link>
  </div>
)}
      </div>
    </section>
  );
};

export default OurStarPlayers;