import { Calendar, ExternalLink, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OptimizedImage from '@/components/OptimizedImage';

interface EventCardProps {
  eventName: string;
  image?: string;
  images?: string[];
  description: string;
  joiningUrl?: string;
  date?: string;
  status?: string;
}

const EventCard = ({ eventName, images, description, joiningUrl, date, status }: EventCardProps) => {

  const getStatusConfig = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'registrations open':
        return { label: 'Registrations Open', icon: <Award className="h-4 w-4 mr-1.5" />, className: 'text-blue-500 font-semibold' };
      case 'upcoming':
        return { label: 'Upcoming', icon: <Calendar className="h-4 w-4 mr-1.5" />, className: 'text-amber-500 font-semibold' };
      default:
        return { label: status || 'Archive', icon: null, className: 'text-black/50' };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <div 
      className="group relative overflow-hidden rounded-xl bg-card border border-border hover:border-foreground/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 h-full flex flex-col"
    >
      {images && images.length > 0 && (
        <div className="aspect-video overflow-hidden relative">
          <OptimizedImage
            src={images[0]}
            alt={eventName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex-1 flex flex-col p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
          <h3 className="font-bold text-lg sm:text-xl text-black group-hover:text-black transition-colors">
            {eventName}
          </h3>
          {date && (
              <div className="flex items-center text-sm text-black/70 group-hover:text-black/70 transition-colors flex-shrink-0">
                <Calendar className="h-4 w-4 mr-1.5" />
                {new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
          )}
        </div>
        
        {status && (
          <div className={`flex items-center text-sm mb-3 ${statusConfig.className}`}>
            {statusConfig.icon}
            {statusConfig.label}
          </div>
        )}

        <p className="text-black/60 group-hover:text-black/80 transition-colors flex-1 leading-relaxed text-sm mb-4">
          {description}
        </p>

        {joiningUrl && joiningUrl !== '#' && (
          <Button asChild className="mt-auto w-full sm:w-auto">
            <a href={joiningUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <ExternalLink className="h-4 w-4 mr-2" />
              Register
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
