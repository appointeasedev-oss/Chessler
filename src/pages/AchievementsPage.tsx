import { useEffect, useState } from 'react';
import AchievementCard from '@/components/cards/AchievementCard';
import { ImageModal } from '@/components/ui/ImageModal';
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
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAchievement(null);
  };

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
          setAchievements(data as Achievement[]);
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
          <p className="text-xl text-muted-foreground max-w-2xl mx-.auto">
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
              onCardClick={() => handleAchievementClick(achievement)}
            />
          ))}
        </div>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        images={selectedAchievement?.images || []}
        title={selectedAchievement?.event_name || ''}
        description={selectedAchievement?.description}
      />
    </div>
  );
};

export default AchievementsPage;