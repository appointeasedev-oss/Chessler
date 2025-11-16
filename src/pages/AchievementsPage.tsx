import { useEffect, useState } from 'react';
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

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const { data, error } = await supabase
          .from('achievements')
          .select('*')
          .order('year', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          const processedAchievements = data.map((achievement) => {
            const { images: imagesData, ...rest } = achievement;
            let imageLinks: string[] = [];

            if (Array.isArray(imagesData)) {
              // Data is already a proper array
              imageLinks = imagesData;
            } else if (typeof imagesData === 'string') {
              const trimmedString = imagesData.trim();
              if (trimmedString.startsWith('[') && trimmedString.endsWith('J')) {
                // Data is a JSON array string, e.g., "[\"url1\", \"url2\"]"
                try {
                  imageLinks = JSON.parse(trimmedString);
                } catch (e) {
                  console.error('Failed to parse images JSON string:', e);
                  imageLinks = [];
                }
              } else if (trimmedString.length > 0) {
                // Data is a single URL string, e.g., "https://.../image.png"
                imageLinks = [trimmedString];
              }
            }
            
            return { ...rest, images: imageLinks };
          });
          setAchievements(processedAchievements);
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-background flex justify-center items-center">
        <p className="text-xl text-muted-foreground">Loading achievements...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            Our Achievements
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
      </div>
    </div>
  );
};

export default AchievementsPage;
