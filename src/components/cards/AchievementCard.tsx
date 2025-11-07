import { Calendar, Award, MapPin, Images } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

interface AchievementCardProps {
  eventName: string;
  position?: string;
  year?: string;
  description?: string;
  images?: string[];
  location?: string;
  onCardClick?: () => void;
}

const AchievementCard = ({ eventName, position, year, description, images, location, onCardClick }: AchievementCardProps) => {
  const handleCardClick = () => {
    if (images && images.length > 0 && onCardClick) {
      onCardClick();
    }
  };

  return (
    <div 
      className={`group relative overflow-hidden rounded-xl bg-card border border-border hover:border-foreground/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 h-full flex flex-col ${
        images && images.length > 0 ? 'cursor-pointer' : ''
      }`}
      onClick={handleCardClick}
    >
      {images && images.length > 0 && (
        <div className="aspect-video overflow-hidden relative">
          <OptimizedImage
            src={images[0]}
            alt={eventName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            {images.length > 1 && (
              <div className="px-2 py-1 bg-black/70 text-white rounded-full text-xs font-medium flex items-center gap-1">
                <Images className="h-3 w-3" />
                {images.length}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
          <h3 className="font-bold text-lg sm:text-xl text-black group-hover:text-black transition-colors">
            {eventName}
          </h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            {year && (
              <div className="flex items-center text-sm text-black/70 group-hover:text-black/70 transition-colors">
                <Calendar className="h-4 w-4 mr-1" />
                {year}
              </div>
            )}
          </div>
        </div>
        
        {position && (
          <div className="flex items-center text-sm text-amber-500 font-semibold mb-3">
            <Award className="h-4 w-4 mr-1.5" />
            {position}
          </div>
        )}

        <p className="text-black/60 group-hover:text-black/80 transition-colors flex-1 leading-relaxed text-sm mb-4">
          {description}
        </p>

        {location && (
          <div className="flex items-center text-sm text-black/50 group-hover:text-black/70 transition-colors mt-auto">
            <MapPin className="h-4 w-4 mr-1.5" />
            {location}
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementCard;