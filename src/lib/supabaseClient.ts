
// Migration from Supabase to Heho API
const HEHO_API_URL = 'https://heho.vercel.app/api/v1/database/manage';
const HEHO_API_KEY = import.meta.env.VITE_HEHO_API_KEY;

async function hehoRequest(payload: any) {
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
    return { data: result, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Network error' };
  }
}

export const supabase = {
  from: (tableName: string) => ({
    select: (columns: string = '*') => {
      const chain = {
        limit: (n: number) => chain,
        order: (column: string, options: any) => chain,
        eq: (column: string, value: any) => {
          // Heho uses query object for filtering in read action
          chain.query = { ...chain.query, [column]: value };
          return chain;
        },
        query: {} as any,
        async then(onfulfilled?: any, onrejected?: any) {
          const res = await hehoRequest({ 
            action: 'read', 
            tableName, 
            query: Object.keys(chain.query).length > 0 ? chain.query : undefined 
          });
          return onfulfilled ? onfulfilled(res) : res;
        }
      };
      return chain;
    },
    insert: async (data: any[]) => {
      // Heho 'add' action takes a single object in 'data'
      return await hehoRequest({ action: 'add', tableName, data: data[0] });
    },
    update: (data: any) => ({
      eq: async (column: string, value: any) => {
        // Heho 'edit' action takes 'id' and 'data'
        return await hehoRequest({ action: 'edit', tableName, id: value, data });
      }
    }),
    delete: () => ({
      eq: async (column: string, value: any) => {
        // Heho 'delete' action takes 'id'
        return await hehoRequest({ action: 'delete', tableName, id: value });
      }
    })
  })
};
