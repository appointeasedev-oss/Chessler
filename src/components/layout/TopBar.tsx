import { useEffect, useState } from 'react';

const PANTRY_ID = '83203a8c-34e9-435d-9112-17a934c03cb9';
const BASKET_CANDIDATES = ['top-banner', 'banner', 'announcement'];

const TopBar = () => {
  const [bannerText, setBannerText] = useState<string | null>(null);

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

  if (!bannerText) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes banner-marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
      <div className="bg-orange-500 py-2 overflow-hidden whitespace-nowrap">
        <div
          className="inline-block min-w-full text-center text-sm font-bold text-white"
          style={{ animation: 'banner-marquee 18s linear infinite' }}
        >
          {bannerText}
        </div>
      </div>
    </>
  );
};

export default TopBar;
