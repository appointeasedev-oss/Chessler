import { heho } from './hehoClient';

// Keep existing imports/usages that reference `supabase` working
// while routing calls to Heho under the hood.
export const supabase = heho;
