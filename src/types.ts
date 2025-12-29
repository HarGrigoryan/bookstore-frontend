export interface BookSearchResponseDTO {
  id: number;
  bookId?: string;
  title?: string;
  publishDate?: string | null;
  firstPublishDate?: string | null;
  description?: string | null;
  format?: string | null;
  isbn?: string | null;
  edition?: string | null;
  pageNumber?: number | null;
  price?: number | null;
  publisherId?: number | null;
  languageId?: number | null;
}

export interface PageResponseDTO<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}
