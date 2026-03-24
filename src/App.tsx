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
  // Initialize Lenis smooth scrolling
  useLenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  // loader lifecycle: mounted -> visible -> fade-out -> unmount
  const [loaderMounted, setLoaderMounted] = useState(true); // controls render
  const [loaderVisible, setLoaderVisible] = useState(true); // controls CSS visibility

  useEffect(() => {
    const minimumVisibleMs = 1200;
    const fadeDurationMs = 300;

    const hideLoader = () => {
      setLoaderVisible(false);
      window.setTimeout(() => setLoaderMounted(false), fadeDurationMs);
    };

    const timer = window.setTimeout(hideLoader, minimumVisibleMs);

    return () => {
      window.clearTimeout(timer);
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
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <Chatbot />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
