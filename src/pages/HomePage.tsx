
import Hero from "@/components/sections/Hero";
import EventsPreview from "@/components/sections/EventsPreview";
import TimelineSection from "@/components/sections/TimelineSection";
import SponsorsSection from "@/components/sections/SponsorsSection";
import Footer from "@/components/layout/Footer";

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
          <div className="md:w-1/2 text-center md:text-left md:pr-12">
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet our founder, Shubham Saini, an International Fide Rated Chess Player and AICF-CIS Trainer. With 13 years of playing experience and 6 years of coaching, he has won numerous district, state, and university level tournaments. He is passionate about nurturing young talent and has coached many students to compete at the national level.
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
      <TimelineSection maxEvents={3} />
      <SponsorsSection />
      <Footer />
    </div>
  );
};

export default HomePage;
