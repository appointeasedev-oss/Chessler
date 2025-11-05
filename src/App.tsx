import { useState, useEffect } from 'react';

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function App() {
  const [countdown, setCountdown] = useState<CountdownState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const targetDate = new Date('2025-11-13T00:00:00').getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-white via-gray-50 to-gray-200 flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 opacity-50 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-80 sm:w-96 h-80 sm:h-96 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-[15%] right-[5%] w-72 sm:w-80 h-72 sm:h-80 bg-gray-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[5%] left-[10%] w-72 sm:w-80 h-72 sm:h-80 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="text-center relative z-10 w-full px-4 flex flex-col items-center justify-center">
        <div className="mb-4 sm:mb-6 md:mb-8 animate-fade-in-scale flex-shrink-0">
          <img
            src="/ChatGPT_Image_Oct_28__2025__07_26_08_PM-removebg-preview.png"
            alt="Sparrow AI Solutions Logo"
            className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 mx-auto object-contain animate-float"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-2 animate-fade-in-up tracking-tight flex-shrink-0">
          Sparrow AI Solutions
        </h1>

        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 animate-fade-in-up-delay-1 font-light flex-shrink-0">
          A TruCount subsidiary
        </p>

        <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 rounded-lg shadow-md animate-fade-in-up-delay-2 hover:shadow-xl hover:from-gray-300 hover:to-gray-400 transition-all duration-300 border border-gray-400 backdrop-blur-sm flex-shrink-0">
          <p className="text-xs sm:text-sm md:text-base font-medium animate-pulse-subtle">
            Under Development
          </p>
        </div>

        <div className="my-4 sm:my-6 animate-fade-in-up-delay-3 flex-shrink-0">
          <div className="h-1 w-10 sm:w-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full mx-auto animate-expand"></div>
        </div>

        <div className="animate-fade-in-up-delay-4 flex-shrink-0">
          <p className="text-gray-700 text-xs sm:text-sm md:text-base mb-4 font-light tracking-wide">Estimated Time Left</p>
          <div className="flex gap-2 sm:gap-3 md:gap-4 justify-center flex-wrap">
            {[
              { value: countdown.days, label: 'Days' },
              { value: countdown.hours, label: 'Hours' },
              { value: countdown.minutes, label: 'Minutes' },
              { value: countdown.seconds, label: 'Seconds' },
            ].map((item, index) => (
              <div
                key={item.label}
                className="animate-fade-in-up-delay-5 group flex-shrink-0"
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-400 rounded-lg p-2 sm:p-3 md:p-4 backdrop-blur-md hover:border-gray-500 transition-all duration-300 shadow-md hover:shadow-lg">
                  <div className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tabular-nums min-w-[2.5rem] sm:min-w-[3rem] md:min-w-[3.5rem]">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] sm:text-xs md:text-sm text-gray-600 mt-1 sm:mt-2 font-medium tracking-widest uppercase">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
