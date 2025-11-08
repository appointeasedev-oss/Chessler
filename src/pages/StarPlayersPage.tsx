import OurStarPlayers from '@/components/sections/OurStarPlayers';

const StarPlayersPage = () => {
  return (
    <div className="pt-24 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
           Our Star Players
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of our club's top talents and their remarkable achievements.
          </p>
        </div>
      </div>
      
      <OurStarPlayers 
        showTitle={false}
        className="pb-20 bg-background"
      />
    </div>
  );
};

export default StarPlayersPage;