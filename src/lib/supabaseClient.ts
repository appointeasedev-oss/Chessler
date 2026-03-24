const HEHO_API_URL = 'https://heho.vercel.app/api/v1/database/manage';
const HEHO_API_KEY = 'heho_5da32c1c719a81c3d01c6197';

type Primitive = string | number | boolean | null;
type Row = Record<string, unknown>;
type Query = Record<string, Primitive | Primitive[]>;

interface HehoResponse<T = unknown> {
  data: T | null;
  error: string | null;
}

interface RequestPayload {
  action: 'read' | 'add' | 'edit' | 'delete';
  tableName: string;
  data?: Row;
  id?: Primitive;
  query?: Query;
}

async function hehoRequest<T = unknown>(payload: RequestPayload): Promise<HehoResponse<T>> {
  try {
    const response = await fetch(HEHO_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HEHO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      const message = typeof result?.error === 'string' ? result.error : 'Heho API error';
      return { data: null, error: message };
    }

    return { data: result as T, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    return { data: null, error: message };
  }
}

class ReadChain {
  private readonly query: Query = {};

  constructor(private readonly tableName: string) {}

  eq(column: string, value: Primitive) {
    this.query[column] = value;
    return this;
  }

  order(_column: string, _options?: { ascending?: boolean }) {
    return this;
  }

  limit(_count: number) {
    return this;
  }

  async execute() {
    return hehoRequest<unknown[]>({
      action: 'read',
      tableName: this.tableName,
      query: Object.keys(this.query).length > 0 ? this.query : undefined,
    });
  }

  then<TResult1 = HehoResponse<unknown[]>, TResult2 = never>(
    onfulfilled?: ((value: HehoResponse<unknown[]>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return this.execute().then(onfulfilled ?? undefined, onrejected ?? undefined);
  }
}

export const supabase = {
  from: (tableName: string) => ({
    select: (_columns = '*') => new ReadChain(tableName),
    insert: (rows: Row[]) => {
      const firstRow = rows[0];
      if (!firstRow) {
        return Promise.resolve({ data: null, error: 'Insert requires at least one row' });
      }

      return hehoRequest({ action: 'add', tableName, data: firstRow });
    },
    update: (data: Row) => ({
      eq: (_column: string, value: Primitive) =>
        hehoRequest({ action: 'edit', tableName, id: value, data }),
    }),
    delete: () => ({
      eq: (_column: string, value: Primitive) =>
        hehoRequest({ action: 'delete', tableName, id: value }),
    }),
  }),
};
