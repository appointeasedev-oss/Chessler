
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper for inline elements like bold and links
const renderInline = (text: string) => {
    const regex = /(\s)|(\n)|(\*\*.*?\*\*)|(https?:\/\/[^\s]+)/g;
    const parts = text.split(regex).filter(Boolean);

    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.match(/^https?:\/\//)) {
            return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/90">{part}</a>;
        }
         if (part === '\n') {
            return <br key={index} />;
        }
        return <span key={index}>{part}</span>;
    });
};

// Helper component to parse and render clickable links and basic markdown
const MessageContent = ({ text }: { text: string }) => {
    const paragraphs = text.split(/\n\s*\n/);

    return (
        <div className="text-sm leading-relaxed space-y-2 text-black">
            {paragraphs.map((para, pIndex) => {
                const listItems = para.split(/\n\s*-\s/);
                if (listItems.length > 1 && listItems[0].trim() === '') {
                    return (
                        <ul key={pIndex} className="list-none space-y-1 pl-1">
                            {listItems.filter(item => item.trim() !== '').map((item, lIndex) => (
                                <li key={lIndex} className="flex items-start">
                                    <span className="mr-2 mt-1 text-primary">&bull;</span>
                                    <span>{renderInline(item)}</span>
                                </li>
                            ))}
                        </ul>
                    );
                }
                return <p key={pIndex}>{renderInline(para)}</p>;
            })}
        </div>
    );
};

interface ChatbotProps {
  siteData: string;
}

const API_KEYS = [
    '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',
    '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'
];
const REGISTRATION_FORM_LINK = "https://forms.gle/JoDkJv79wY7yvzfV8";
const MODEL_FALLBACK_CHAIN = [
    "google/gemini-2.0-flash-exp:free",
    "mistralai/mistral-small-3.1-24b-instruct:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "amazon/nova-2-lite-v1:free",
];

const Chatbot: React.FC<ChatbotProps> = ({ siteData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
        if (messages.length === 0) {
            setMessages([
                { sender: 'bot', text: "Hello! I'm the Chessler AI assistant. How can I help you with events, courses, or joining the club?" }
            ]);
        }
        setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages.length]);

  const getSystemPrompt = () => {
    return `You are the 'Chessler AI Assistant', a helpful and concise AI for the 'Chessler Chess Club' website.\n- Your answers must be short and to the point.\n- **Format your responses using Markdown, including lists for achievements/events and bolding for emphasis.**\n- Use the following live site data to answer questions: ${siteData}.\n- When asked about registration, joining, or signing up, you MUST provide this exact link: ${REGISTRATION_FORM_LINK}.\n- If you cannot answer using the provided data, politely say: "I'm not sure about that. You can find more information on the website or contact us directly."`;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage = { sender: 'user' as const, text: inputValue };
    setMessages(prev => [...prev, userMessage, { sender: 'bot', text: '' }]);
    setInputValue('');
    setLoading(true);

    let responseSent = false;

    for (const apiKey of API_KEYS) {
        if (responseSent) break;

        for (const model of MODEL_FALLBACK_CHAIN) {
            if (responseSent) break;
            try {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: model,
                        stream: true,
                        messages: [...messages, userMessage].slice(-8).map(m => ({ role: m.sender === 'bot' ? 'assistant' : 'user', content: m.text }))
                    })
                });

                if (!response.ok || !response.body) {
                    if (response.status === 401) {
                         console.warn(`API key ending with ...${apiKey.slice(-4)} failed with auth error. Trying next key.`);
                         break; // This key is bad, break from model loop to try next key.
                    }
                    console.warn(`Model ${model} failed with status: ${response.statusText}`);
                    continue; // Try the next model with the same key.
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) {
                        responseSent = true;
                        break;
                    }

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const dataStr = line.substring(6).trim();
                            if (dataStr === '[DONE]') {
                                responseSent = true;
                                break;
                            }
                            try {
                                const parsed = JSON.parse(dataStr);
                                const delta = parsed.choices?.[0]?.delta?.content;
                                if (delta) {
                                    setMessages(prev => {
                                        const newMessages = [...prev];
                                        newMessages[newMessages.length - 1].text += delta;
                                        return newMessages;
                                    });
                                }
                            } catch (e) { /* Ignore JSON parsing errors */ }
                        }
                    }
                    if (responseSent) break;
                }
            } catch (error) {
                console.error(`Error with model ${model} and key ending in ...${apiKey.slice(-4)}:`, error);
            }
        }
    }


    if (!responseSent) {
        setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.text === '') {
                lastMessage.text = "Sorry, I couldn't get a response. Please try again.";
            }
            return newMessages;
        });
    }

    setLoading(false);
  };

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
            <header className="flex items-center justify-between p-4 border-b flex-shrink-0">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Bot className="text-primary" size={22} />
                Chessler AI Assistant
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close Chat</span>
              </Button>
            </header>

            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-6">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3.5 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                   {msg.sender === 'bot' && <div className="bg-primary text-primary-foreground p-2.5 rounded-full flex-shrink-0"><Bot size={18} /></div>}
                  <div className={`max-w-[85%] p-3 rounded-xl ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                     <MessageContent text={msg.text} />
                  </div>
                  {msg.sender === 'user' && <div className="bg-muted text-muted-foreground p-2.5 rounded-full flex-shrink-0"><User size={18} /></div>}
                </div>
              ))}
              {loading && messages[messages.length - 1]?.text === '' && (
                <div className="flex items-start gap-3.5">
                  <div className="bg-primary text-primary-foreground p-2.5 rounded-full flex-shrink-0 animate-pulse"><Bot size={18} /></div>
                  <div className="max-w-[85%] p-3 rounded-lg bg-muted flex items-center space-x-1.5">
                    <div className="h-2 w-2 bg-foreground/30 rounded-full animate-pulse"></div>
                    <div className="h-2 w-2 bg-foreground/30 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="h-2 w-2 bg-foreground/30 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-background/80 backdrop-blur-sm flex-shrink-0">
              <div className="relative">
                <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask anything..."
                    className="pr-12 h-12 rounded-full bg-muted focus-visible:ring-primary/40 text-black placeholder:text-muted-foreground"
                    disabled={loading}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-9 h-9"
                  disabled={loading || !inputValue.trim()}
                  aria-label="Send Message"
                >
                    <Send className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

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
