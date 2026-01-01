export interface BookSearchResponseDTO {
  id: number;
  bookId?: string;
  title?: string;
  publishDate?: string | null;
  firstPublishDate?: string | null;
  description?: string | null;
  format?: string | null;
  isbn?: string | null;
  characterName?: string | null;
  edition?: string | null;
  pageNumber?: number | null;
  price?: number | null;
  publisherId?: number | null;
  languageId?: number | null;
}

export interface BookInstanceDTO {
  id: number;
  instanceNumber?: number;
  isRentable?: boolean;
  isSellable?: boolean;
  maxRentCount?: number;
  price?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  bookId?: number;
};

export interface AuthorDTO {
    id: number,
    fullName: string,
    isOnGoodreads: boolean
}

export interface PageResponseDTO<T> {
  content: T[];
  pageNumber: number;
  pageSize: number; 
  totalPages: number;
  totalElements: number;
}

export interface AuthorResponseDTO{
    id: number;
    fullName: string,
    isOnGoodreads: boolean,
    authorRole: string
}

export interface LanguageDTO{
    id: number,
    language: string
}