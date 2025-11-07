import React, { useMemo } from "react";

interface LoaderProps {
  visible: boolean;
}

// Helper to force remount on refresh (animation restart)
const getRandomKey = () => Math.random().toString(36).slice(2);

const Loader: React.FC<LoaderProps> = ({ visible }) => {
  // This key will change on every refresh, remounting the SVG and restarting the animation
  const svgKey = useMemo(() => getRandomKey(), []);
  if (!visible) return null;
  return (
    <div className="loader-overlay" style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
      <style>{`
        .svg-elem-1 {
          animation: slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        .svg-elem-2 {
          animation: slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s both;
        }
        .svg-elem-3 {
          animation: slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both;
        }
        .svg-elem-4 {
          animation: slide-in-bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s both;
        }

        @keyframes slide-in-bottom {
          0% {
            transform: translateY(50px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
      <svg
        key={svgKey}
        width="120"
        height="120"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ maxWidth: '80vw', maxHeight: '80vh' }}
      >
        <path className="svg-elem-1" d="M12 2C11.4477 2 11 2.44772 11 3V3.5C11 4.32843 10.3284 5 9.5 5C8.67157 5 8 4.32843 8 3.5V3C8 2.44772 7.55228 2 7 2C6.44772 2 6 2.44772 6 3V3.5C6 5.433 7.567 7 9.5 7H14.5C16.433 7 18 5.433 18 3.5V3C18 2.44772 17.5523 2 17 2C16.4477 2 16 2.44772 16 3V3.5C16 4.32843 15.3284 5 14.5 5C13.6716 5 13 4.32843 13 3.5V3C13 2.44772 12.5523 2 12 2Z" fill="#000000"/>
        <path className="svg-elem-2" d="M6 8C6 9.10457 6.89543 10 8 10H16C17.1046 10 18 9.10457 18 8V7H6V8Z" fill="#000000"/>
        <path className="svg-elem-3" d="M7 11H17V18C17 19.1046 16.1046 20 15 20H9C7.89543 20 7 19.1046 7 18V11Z" fill="#000000"/>
        <path className="svg-elem-4" d="M5 21H19V22H5V21Z" fill="#000000"/>
      </svg>
    </div>
  );
};

export default Loader;
