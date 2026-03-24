import { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const CHATBOT_URL = 'https://heho.vercel.app/deploy/nhts1a991ki9v686u4zihw';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {open && (
        <div
          className={
            isMobile
              ? 'fixed inset-0 z-[70] bg-background'
              : 'fixed bottom-24 right-6 z-[70] h-[600px] w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border bg-background shadow-2xl'
          }
        >
          <button
            onClick={() => setOpen(false)}
            aria-label="Close chatbot"
            className="absolute right-3 top-3 z-10 rounded-full bg-black/70 p-2 text-white"
          >
            <X size={18} />
          </button>

          <iframe
            src={CHATBOT_URL}
            title="Chessler Chatbot"
            allow="microphone; camera"
            className="h-full w-full border-0"
          />
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? 'Hide chatbot' : 'Open chatbot'}
        className="fixed bottom-6 right-6 z-[71] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  );
};

export default Chatbot;
