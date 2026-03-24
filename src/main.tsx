
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Analytics } from '@vercel/analytics/react';

const applySystemTheme = () => {
	const root = document.documentElement;
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

	root.classList.remove('light', 'dark');
	root.classList.add(prefersDark ? 'dark' : 'light');
};

applySystemTheme();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applySystemTheme);

createRoot(document.getElementById("root")!).render(
	<>
		<App />
		<Analytics />
	</>
);
