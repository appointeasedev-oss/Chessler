
import aboutData from '@/data/about.json';
import achievementsData from '@/data/achievements.json';
import eventsData from '@/data/events.json';

// This data is a placeholder for your live Supabase data.
// In App.tsx, you will replace this with a real-time fetch from your database.
export const chatbotData = `
  About the Club: ${JSON.stringify(aboutData)}

  Recent Events: ${JSON.stringify(eventsData.map(({ eventName, description, date, status }) => ({ eventName, description, date, status })), null, 2)}

  Member Achievements: ${JSON.stringify(achievementsData.map(({ eventName, position, year, description }) => ({ eventName, position, year, description })), null, 2)}
`;
