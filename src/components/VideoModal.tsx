'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Auto-play may be blocked, user needs to click play
      });
    }
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors z-10"
          aria-label="Close video"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Video container */}
        <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl shadow-yellow-400/20 border border-yellow-400/20">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
                <p className="text-yellow-400 text-sm">वीडियो लोड हो रहा है...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center">
                <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-red-400">{error}</p>
                <button 
                  onClick={() => {
                    setError(null);
                    setIsLoading(true);
                    if (videoRef.current) {
                      videoRef.current.load();
                    }
                  }}
                  className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  पुनः प्रयास करें
                </button>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            className="w-full aspect-video"
            controls
            playsInline
            onLoadedData={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setError('वीडियो लोड करने में त्रुटि हुई');
            }}
            onCanPlay={() => setIsLoading(false)}
          >
            <source src={videoUrl} type="video/mp4" />
            आपका ब्राउज़र वीडियो टैग का समर्थन नहीं करता है।
          </video>
        </div>

        {/* Title */}
        <div className="mt-4 text-center">
          <h3 className="text-xl font-bold text-yellow-400">9INR - Earn Money Online</h3>
          <p className="text-gray-400 text-sm mt-1">ऐप डाउनलोड करें और आज ही कमाई शुरू करें</p>
        </div>
      </div>
    </div>
  );
}
