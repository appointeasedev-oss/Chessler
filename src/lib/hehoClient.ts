
const HEHO_API_URL = 'https://heho.vercel.app/api/v1/database/manage';
const HEHO_API_KEY = import.meta.env.VITE_HEHO_API_KEY;

interface HehoRequest {
  action: 'read' | 'add' | 'edit' | 'delete';
  tableName: string;
  data?: any;
  id?: any;
  query?: any;
}

async function hehoRequest(payload: HehoRequest) {
  try {
    const response = await fetch(HEHO_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HEHO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      return { data: null, error: result.error || 'Heho API error' };
    }

    // Heho returns data directly or in a data property depending on the action
    // For 'read', it usually returns an array.
    return { data: result, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Network error' };
  }
}

export const heho = {
  from: (tableName: string) => ({
    select: (columns: string = '*') => ({
      limit: (n: number) => hehoRequest({ action: 'read', tableName }), // Heho API might not support limit/select columns in this simple way, but we'll map it
      then: (callback: any) => hehoRequest({ action: 'read', tableName }).then(callback),
      // To match Supabase's async/await pattern:
      async then(onfulfilled?: any, onrejected?: any) {
          const res = await hehoRequest({ action: 'read', tableName });
          return onfulfilled ? onfulfilled(res) : res;
      }
    }),
    insert: (data: any[]) => hehoRequest({ action: 'add', tableName, data: data[0] }),
    update: (data: any) => ({
      eq: (column: string, value: any) => hehoRequest({ action: 'edit', tableName, id: value, data })
    }),
    delete: () => ({
      eq: (column: string, value: any) => hehoRequest({ action: 'delete', tableName, id: value })
    }),
    // Add a generic read for more complex queries if needed
    read: (query?: any) => hehoRequest({ action: 'read', tableName, query })
  })
};
