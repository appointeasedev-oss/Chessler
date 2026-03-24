import { useEffect, useMemo, useRef, useState } from 'react';

const PANTRY_ID = '83203a8c-34e9-435d-9112-17a934c03cb9';
const BASKET_CANDIDATES = ['top-banner', 'banner', 'announcement'];

const TopBar = () => {
  const [bannerText, setBannerText] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const readBannerText = (payload: unknown): string | null => {
      if (!payload || typeof payload !== 'object') {
        return null;
      }

      const data = payload as Record<string, unknown>;
      const possibleText = data.text ?? data.message ?? data.bannerText ?? null;

      if (typeof possibleText !== 'string') {
        return null;
      }

      const trimmed = possibleText.trim();
      if (!trimmed || trimmed.toLowerCase() === 'null') {
        return null;
      }

      return trimmed;
    };

    const fetchBanner = async () => {
      for (const basket of BASKET_CANDIDATES) {
        try {
          const response = await fetch(`https://getpantry.cloud/apiv1/pantry/${PANTRY_ID}/basket/${basket}`);

          if (!response.ok) {
            continue;
          }

          const payload = await response.json();
          const text = readBannerText(payload);

          if (text) {
            setBannerText(text);
            return;
          }
        } catch (error) {
          console.error(`Error fetching pantry basket "${basket}":`, error);
        }
      }

      setBannerText(null);
    };

    fetchBanner();
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    if (!bannerText || !barRef.current) {
      root.style.setProperty('--top-banner-height', '0px');
      return;
    }

    const updateHeight = () => {
      const height = barRef.current?.offsetHeight ?? 0;
      root.style.setProperty('--top-banner-height', `${height}px`);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      root.style.setProperty('--top-banner-height', '0px');
    };
  }, [bannerText]);

  const minimumRepeats = 4;
  const calculatedRepeats = Math.ceil(90 / Math.max(8, (bannerText ?? '').length));
  const repeatCount = Math.min(12, Math.max(minimumRepeats, calculatedRepeats));
  const repeatedItems = useMemo(() => Array.from({ length: repeatCount }, (_, index) => index), [repeatCount]);

  if (!bannerText) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes banner-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div ref={barRef} className="bg-orange-500 py-2 overflow-hidden whitespace-nowrap">
        <div
          className="flex w-max items-center gap-8 pr-8 text-sm font-bold text-white"
          style={{ animation: 'banner-marquee 22s linear infinite' }}
        >
          {[0, 1].map((track) => (
            <div key={track} className="flex shrink-0 items-center gap-8">
              {repeatedItems.map((item) => (
                <span key={`${track}-${item}`} className="inline-flex items-center gap-8">
                  <span>{bannerText}</span>
                  <span aria-hidden="true">•</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TopBar;
