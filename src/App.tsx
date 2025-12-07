
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import TopBar from "./components/layout/TopBar";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import AchievementsPage from "./pages/AchievementsPage";
import GalleryPage from "./pages/GalleryPage";
import TutorialsPage from "./pages/TutorialsPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import { useLenis } from "./hooks/useLenis";
import { useEffect, useState } from "react";
import Loader from "./components/ui/Loader";
import Play from "./pages/Play";
import AlumniPage from "./pages/AlumniPage";
import ContactPage from "./pages/ContactPage";
import Chatbot from "./components/ui/Chatbot";

const queryClient = new QueryClient();

const App = () => {
  useLenis(); 

  const [loaderMounted, setLoaderMounted] = useState(true);
  const [loaderVisible, setLoaderVisible] = useState(true); 
  const [siteData, setSiteData] = useState("Site data is currently loading...");

  useEffect(() => {
    const hideLoaderSequence = () => {
      const minVisible = 2000; 
      const fadeDuration = 500;
      const mountTime = Date.now();

      const elapsed = Date.now() - mountTime;
      const wait = Math.max(0, minVisible - elapsed);
      
      setTimeout(() => {
        setLoaderVisible(false);
        setTimeout(() => setLoaderMounted(false), fadeDuration);
      }, wait);
    };

    window.addEventListener("load", hideLoaderSequence);
    const fallback = setTimeout(hideLoaderSequence, 2000);

    return () => {
      window.removeEventListener("load", hideLoaderSequence);
      clearTimeout(fallback);
    };
  }, []);

  // --- LIVE DATA FETCHING --- 
  useEffect(() => {
    // This is the function where you should fetch your live data from Supabase
    // and from your site's pages. The chatbot is ready to use whatever data you provide here.
    const fetchLiveSiteData = async () => {
      try {
        // **EXAMPLE:**
        // 1. Fetch data from your Supabase tables
        // const { data: achievements, error: achievementsError } = await supabase.from('achievements').select('*');
        // const { data: events, error: eventsError } = await supabase.from('events').select('*');

        // 2. Fetch data from your page components (if needed, though Supabase is better)
        // This is more complex and might involve creating a shared data context.

        // 3. Format the data into a single string for the AI.
        //    This is where you combine all the data you fetched.
        const formattedData = `
          // --- You would format your live fetched data here ---
          // Example: 
          // About the Club: ${JSON.stringify(aboutData)}
          // Recent Events: ${JSON.stringify(events)}
          // Member Achievements: ${JSON.stringify(achievements)}
        `;
        
        // For now, we are using the static data as a placeholder.
        // Replace this with your live `formattedData`.
        const staticData = await import('./lib/static-data');
        setSiteData(staticData.chatbotData);

      } catch (error) {
        console.error("Error fetching live data for chatbot:", error);
        setSiteData("Error loading site data. The chatbot may not have complete information.");
      }
    };

    fetchLiveSiteData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <TopBar />
          <ScrollToTop />
          <div className="min-h-screen bg-background flex flex-col">
            {loaderMounted && <Loader visible={loaderVisible} />}
            <Header />
            <main className="flex-1">
              <Routes future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Route path="/" element={<HomePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/play" element={<Play />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/tutorials" element={<TutorialsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/alumni" element={<AlumniPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          {/* The chatbot now receives the live siteData from the state */}
          <Chatbot siteData={siteData} />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
