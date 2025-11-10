import Hero from "@/components/sections/Hero";
import EventsPreview from "@/components/sections/EventsPreview";
import SponsorsSection from "@/components/sections/SponsorsSection";
import ContactSection from "@/components/sections/ContactSection";

const FounderSection = () => {
  return (
    <div className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            About the Founder
          </h2>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center">
          <div className="md:w-1/3 flex justify-center mb-8 md:mb-0">
            <img
              src="/assets/IMG-20251108-WA0001.jpg"
              alt="Founder Shubham Saini"
              className="rounded-full w-64 h-64 object-cover object-top"
            />
          </div>
          <div className="md:w-2/3 text-center md:text-left md:pl-12">
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              I’m an AICF Chess Trainer (CIS - Chess in School Program)and International FIDE-rated player with over 9 years of coaching experience and 18 years of passion for the game. I’ve won multiple district, state, and university titles, competed at the national level, and even participated in the South Asian Chess Championship 2016. Over the years, I’ve trained many young talents, helping several of them shine at district, state, and national tournaments. My goal is to inspire every student to think deeply, play confidently, and enjoy the beauty of chess.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FounderSection />
      <EventsPreview />
      <ContactSection />
      <SponsorsSection />
    </div>
  );
};

export default HomePage;
