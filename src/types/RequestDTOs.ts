import { Format, AuthorRole } from './Enums';

export interface BookCreateDTO {
  bookId: string;
  title: string;
  publishDate?: string; // ISO date string (YYYY-MM-DD)
  firstPublishDate?: string; // ISO date string
  description?: string;
  format?: Format;
  isbn?: string;
  languageId?: number;
  publisherId?: number;
  edition?: string;
  pageNumber?: number;
  price?: number;
  authorIds?: number[];
  authorRoles?: AuthorRole[];
  genreIds?: number[];
  settingIds?: number[];
  characterIds?: number[];
  awardIds?: number[];
  seriesId?: number;
  seriesNumber?: string;
  coverImageURL?: string;
}
