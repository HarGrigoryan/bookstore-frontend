import type { PageResponseDTO, BookSearchResponseDTO } from './types';

export type SearchParams = {
  title?: string;
  authorName?: string;
  isbn?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string
};

function buildQuery(params: SearchParams) {
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    qp.set(k, String(v));
  });
  const qs = qp.toString();
  return qs ? `?${qs}` : '';
}

export async function fetchBooks(params: SearchParams = {}) {
  const defaults = { page: 0, size: 10, sortBy: 'title', sortDirection: "ASC"};
  const finalParams = { ...defaults, ...params };

  const url = `/books${buildQuery(finalParams)}`;
  console.log('[FETCH] url:', url, 'params:', finalParams);

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  const data = (await res.json()) as PageResponseDTO<BookSearchResponseDTO>;
  console.log('[FETCH] data received:', data);
  return data;
}

export async function fetchBookById(id: number) {
  console.log('[FETCH] fetchBookById called with id:', id);
  const res = await fetch(`/books/${id}`);
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    console.error('[FETCH] fetchBookById failed:', text);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  const data = await res.json();
  console.log('[FETCH] fetchBookById received:', data);
  return data;
}


export async function fetchBookInstances(bookId: number) {
  console.log('[FETCH] fetchBookInstances called with bookId:', bookId);
  const res = await fetch(`/book-instances?bookId=${bookId}`);
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    console.error('[FETCH] fetchBookInstances failed:', text);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  const data = await res.json();
  console.log('[FETCH] fetchBookInstances received:', data);
  return data;
}
