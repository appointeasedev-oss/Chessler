import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AchievementCard from '@/components/cards/AchievementCard';
import { supabase } from '@/utils/supabase';

interface Achievement {
  id: number;
  event_name: string;
  position?: string;
  year?: string;
  description?: string;
  images?: string[];
  location?: string;
}

const AchievementsPreview = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const { data, error } = await supabase
          .from('achievements')
          .select('*')
          .order('year', { ascending: false })
          .limit(3);

        if (error) {
          throw error;
        }

        if (data) {
          const processedAchievements = data.map((achievement) => {
            const { images: imagesData, ...rest } = achievement;
            let imageLinks: string[] = [];

            if (Array.isArray(imagesData)) {
              imageLinks = imagesData;
            } else if (typeof imagesData === 'string') {
              const trimmedString = imagesData.trim();
              if (trimmedString.startsWith('[') && trimmedString.endsWith('J')) {
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
            
            return { ...rest, images: imageLinks };
          });
          setAchievements(processedAchievements);
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
      }
    };

    fetchAchievements();
  }, []);

  return (
    <section className="min-h-screen flex flex-col justify-center py-20 bg-black text-white">
      <div className="container mx-auto px-4 flex-1 flex flex-col justify-center">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our Achievements
          </h2>
          <p className="text-xl text-secondary-foreground/80 max-w-2xl mx-auto mb-8">
            A showcase of our club's accomplishments and victories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              eventName={achievement.event_name}
              position={achievement.position}
              year={achievement.year}
              description={achievement.description}
              images={achievement.images}
              location={achievement.location}
            />
          ))}
        </div>

        <div className="flex justify-center mt-14">
          <Button asChild>
            <Link to="/achievements" className="flex items-center cursor-pointer">
              View All Achievements
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AchievementsPreview;
