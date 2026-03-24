
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatbotProps {
  siteData?: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ siteData }) => {
  void siteData;
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = React.useState(window.innerWidth > 768);

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const desktopVariants = { hidden: { x: '100%' }, visible: { x: '0%' } };
  const mobileVariants = { hidden: { y: '100%' }, visible: { y: '0%' } };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={isDesktop ? desktopVariants : mobileVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            className="fixed inset-0 z-50 flex flex-col bg-background md:inset-auto md:top-0 md:bottom-0 md:right-0 md:w-full md:max-w-md md:border-l"
          >
            {/* Close button for mobile */}
            <div className="md:hidden flex justify-end p-2">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close Chat</span>
              </Button>
            </div>

            {/* Heho Chatbot iframe */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src="https://heho.vercel.app/deploy/nhts1a991ki9v686u4zihw"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '8px',
                }}
                allow="microphone; camera"
                title="Heho Chatbot"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button to open chatbot */}
      <motion.div
        initial={{ scale: 0, rotate: 90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-40"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-16 h-16 shadow-lg flex items-center justify-center"
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isOpen ? 'x' : 'msg'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </motion.div>
          </AnimatePresence>
        </Button>
      </motion.div>
    </>
  );
};

export default Chatbot;
