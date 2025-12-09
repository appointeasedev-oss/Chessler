'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <div
          className={cn(
            'fixed z-50',
            isMobile ? 'bottom-4 right-4' : 'bottom-8 right-8',
          )}
        >
          <Button
            size="lg"
            className="bg-black text-white border border-white/20 rounded-full w-16 h-16 shadow-lg flex items-center justify-center hover:bg-gray-800"
            onClick={() => setIsOpen(true)}
          >
            <Bot size={32} />
          </Button>
        </div>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div
          className={cn(
            'fixed bg-black border border-gray-800 shadow-xl flex flex-col z-50 text-white',
            isMobile
              ? 'inset-0 rounded-none' // Full screen on mobile
              : 'bottom-8 right-8 w-full max-w-md h-[70vh] rounded-lg', // Popup on desktop
          )}
        >
          {/* Header */}
          <div
            className={cn(
              'p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900',
              isMobile ? 'rounded-none' : 'rounded-t-lg',
            )}
          >
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Bot size={22} /> Chessler Bot
            </h2>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Embedded Chatbot */}
          <div className="flex-1">
            <iframe
              src="https://chessler-sparrow-bot.vercel.app/"
              className="w-full h-full border-0"
              title="Chessler Bot"
              allow="microphone"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
