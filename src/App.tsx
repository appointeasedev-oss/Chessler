
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
      window.removeEventListener('load', hideLoaderSequence);
      clearTimeout(fallback);
    };
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
          <Chatbot />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
