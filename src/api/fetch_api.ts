import { FetchArgs } from "@/types/FetchArgs";

export async function fetch_post(arg: FetchArgs): Promise<any> {
  try {
    const response = await fetch(arg.url + arg.payload.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(arg.payload.body, null, 2)
    });

    if (!response.ok) return { error: true };

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return { error: true };
  } catch (err) {
    console.error('fetch_post error:', err);
    return { error: true };
  }
}

export async function fetch_get(url: string): Promise<[]> {
  try {
    const response = await fetch(url);

    if (!response.ok) return [];

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return [];
  } catch (err) {
    console.error('fetch_get error:', err);
    return [];
  }
}

export async function fetch_delete(url: string): Promise<any> {
  try {
    const response = await fetch(url, { method: 'DELETE' });

    if (!response.ok) return { error: true };

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return { ok: true };
  } catch (err) {
    console.error('fetch_delete error:', err);
    return { error: true };
  }
}
