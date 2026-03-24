const HEHO_API_URL = 'https://heho.vercel.app/api/v1/database/manage';
const HEHO_API_KEY = import.meta.env.VITE_HEHO_API_KEY;

type HehoAction = 'read' | 'add' | 'edit' | 'delete';
type HehoPrimitive = string | number | boolean | null;
type HehoRow = Record<string, unknown>;
type HehoQuery = Record<string, HehoPrimitive | HehoPrimitive[]>;

interface HehoRequest {
  action: HehoAction;
  tableName: string;
  data?: HehoRow;
  id?: string | number;
  query?: HehoQuery;
  options?: {
    limit?: number;
    orderBy?: { column: string; ascending: boolean }[];
  };
}

interface HehoResponse<TData = unknown> {
  data: TData | null;
  error: string | null;
}

const isHehoRow = (value: unknown): value is HehoRow =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

async function hehoRequest<TData = unknown>(payload: HehoRequest): Promise<HehoResponse<TData>> {
  try {
    const response = await fetch(HEHO_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HEHO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as unknown;

    if (!response.ok) {
      const errorMessage = isHehoRow(result) && typeof result.error === 'string'
        ? result.error
        : 'Heho API error';
      return { data: null, error: errorMessage };
    }

    return { data: result as TData, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    return { data: null, error: message };
  }
}

class HehoReadChain {
  private query: HehoQuery = {};
  private options: NonNullable<HehoRequest['options']> = {};

  constructor(private readonly tableName: string) {}

  limit(n: number) {
    this.options.limit = n;
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    const ascending = options?.ascending ?? true;
    const existing = this.options.orderBy ?? [];
    this.options.orderBy = [...existing, { column, ascending }];
    return this;
  }

  eq(column: string, value: HehoPrimitive) {
    this.query[column] = value;
    return this;
  }

  async execute() {
    return hehoRequest<unknown[]>({
      action: 'read',
      tableName: this.tableName,
      query: Object.keys(this.query).length ? this.query : undefined,
      options: Object.keys(this.options).length ? this.options : undefined,
    });
  }

  then<TResult1 = HehoResponse<unknown[]>, TResult2 = never>(
    onfulfilled?: ((value: HehoResponse<unknown[]>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return this.execute().then(onfulfilled ?? undefined, onrejected ?? undefined);
  }
}

export const heho = {
  from: (tableName: string) => ({
    select: (_columns = '*') => new HehoReadChain(tableName),
    insert: async (rows: HehoRow[]) => {
      const row = rows[0];
      if (!row) {
        return { data: null, error: 'Insert requires at least one row' };
      }

      return hehoRequest({ action: 'add', tableName, data: row });
    },
    update: (data: HehoRow) => ({
      eq: (column: string, value: string | number) => {
        void column;
        return hehoRequest({ action: 'edit', tableName, id: value, data });
      },
    }),
    delete: () => ({
      eq: (column: string, value: string | number) => {
        void column;
        return hehoRequest({ action: 'delete', tableName, id: value });
      },
    }),
  }),
};
