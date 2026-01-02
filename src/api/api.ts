import type { PageResponseDTO, BookSearchResponseDTO, AuthorDTO, AuthorResponseDTO, LanguageDTO, CharacterDTO, GenreDTO } from '../types';
import { fetchWithAuth } from './fetchWithAuth';

export type BookSearchParams = {
  title?: string;
  authorName?: string;
  authorId?: number;
  languageName?: string;
  genre?: string; 
  characterName?: string;
  isbn?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string
};

export type AuthorSearchParams = {
  fullName?: string,
  isOnGoodreads?: boolean,
  bookId?: number,
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string
}

function buildQuery<T extends Record<string, unknown>>(params: T) {
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    qp.set(k, String(v));
  });
  const qs = qp.toString();
  return qs ? `?${qs}` : '';
}


export async function fetchBooks(params: BookSearchParams = {}) {
  const defaults = { page: 0, size: 9, sortDirection: "ASC"};
  const finalParams = { ...defaults, ...params };

  const url = `/api/books${buildQuery(finalParams)}`;
  console.log('[FETCH] url:', url, 'params:', finalParams);

  const res = await fetchWithAuth(url);
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  const data = (await res.json()) as PageResponseDTO<BookSearchResponseDTO>;
  console.log('[FETCH] data received:', data);
  return data;
}


export async function fetchLanguages() {
  const res = await fetchWithAuth('/api/languages');
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  const data = (await res.json()) as LanguageDTO[]; 
  console.log('[FETCH] languages received:', data);
  return data;
}


export async function fetchBookById(id: number) {
  console.log('[FETCH] fetchBookById called with id:', id);
  const res = await fetchWithAuth(`/api/books/${id}`);
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    console.error('[FETCH] fetchBookById failed:', text);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  const data = await res.json();
  console.log('[FETCH] fetchBookById received:', data);
  return data;
}

export async function fetchAuthor(params: AuthorSearchParams) {
  console.log('[FETCH] fetchAuthorByBookId called with id:', params.bookId)
  const defaults = { page: 0, size: 9, sortDirection: "ASC"};
  const finalParams = { ...defaults, ...params };
  const res =  await fetchWithAuth(`/api/authors${buildQuery(finalParams)}`)
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  console.log("[RECEIVED] raw data:", res)
  const data = (await res.json()) as PageResponseDTO<AuthorDTO>;
  console.log('[FETCH] fetchAuthor data received:', data);
  return data;
}

export async function fetchAuthorsByBookId(bookId: number){
  console.log('[FETCH] authorsByBookId called with bookId:', bookId);
  const res = await fetchWithAuth(`/api/books/${bookId}/authors`);
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    console.error('[FETCH] fetchAuthorsByBookId failed:', text);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  const data = await res.json() as AuthorResponseDTO[];
  console.log('[FETCH] fetchAuthorsByBookId received:', data);
  return data;
}

export async function fetchBookInstances(bookId: number) {
  console.log('[FETCH] fetchBookInstances called with bookId:', bookId);
  const res = await fetchWithAuth(`/api/book-instances?bookId=${bookId}`);
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    console.error('[FETCH] fetchBookInstances failed:', text);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  const data = await res.json();
  console.log('[FETCH] fetchBookInstances received:', data);
  return data;
}

export async function fetchCharactersByBookId(bookId:number) {
    console.log('[FETCH] fetchCharactersByBookId called with bookId:', bookId);
  const res = await fetchWithAuth(`/api/books/${bookId}/characters`);
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    console.error('[FETCH] fetchCharactersByBookId failed:', text);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  const data =  await res.json() as CharacterDTO[];
    console.log('[FETCH] fetchCharactersByBookId received:', data);
  return data;
}

export async function fetchGenres() {
  const res = await fetchWithAuth('/api/genres');
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  const data = (await res.json()) as GenreDTO[]; 
  console.log('[FETCH] genres received:', data);
  return data;
}


export async function fetchGenresByBookId(bookId:number) {
    console.log('[FETCH] fetchGenresByBookId called with bookId:', bookId);
  const res = await fetchWithAuth(`/api/books/${bookId}/genres`);
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    console.error('[FETCH] fetchGenresByBookId failed:', text);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  const data =  await res.json() as GenreDTO[];
    console.log('[FETCH] fetchGenresByBookId received:', data);
  return data;
}
