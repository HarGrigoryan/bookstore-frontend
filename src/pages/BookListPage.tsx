import { useEffect, useState } from 'react';
import type { BookSearchResponseDTO, GenreDTO} from '../types';
import { fetchBooks, fetchGenres, fetchLanguages } from '../api/api';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';


const ACCENT = '#2563eb'; 
const CARD_BG = '#ffffff';
const MUTED = '#6b7280';

function Price({ v }: { v?: number | null }) {
  if (v === null || v === undefined || Number.isNaN(v)) return <span style={{ color: MUTED }}>—</span>;
  return <span>${Number(v).toFixed(2)}</span>;
}

export default function BookListPage() {
  const [books, setBooks] = useState<BookSearchResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0); // 0-based
  const [totalPages, setTotalPages] = useState(1);
  const [pageInput, setPageInput] = useState('1'); // UI is 1-based
  const [expanded, setExpanded] = useState<Record<number, boolean>>({}); 
  const [title, setTitle] = useState('');
  const [isbn, setIsbn ] = useState('');
  const [authorName, setAuthorName ] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('jwt'))
  );
  const [languages, setLanguages] = useState<{ id: number; language: string }[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(''); // single string
  const [genres, setGenres] = useState<GenreDTO[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>(''); // single string
  const [characterName, setCharacterName ] = useState('');
  const location = useLocation();
  const [readyToLoad, setReadyToLoad] = useState(false);

  useEffect(() => {
    if (!location.state) {
      setReadyToLoad(true);
      return;
    }
    const s = location.state as any;
    setTitle(s.title ?? '');
    setIsbn(s.isbn ?? '');
    setAuthorName(s.authorName ?? '');
    setSelectedLanguage(s.selectedLanguage ?? '');
    setSelectedGenre(s.selectedGenre ?? '');
    setCharacterName(s.characterName ?? '');
    setReadyToLoad(true);
  }, []);

  useEffect(() => {
    if (!readyToLoad) return;

    const initialPage = (location.state as any)?.page ?? 0;
    load(initialPage); 
  }, [readyToLoad]);

  useEffect(() => {
    if (readyToLoad) load(0);
  }, [selectedLanguage, selectedGenre]);


  useEffect(() => {
  if (!isAuthenticated) return;

  async function loadLanguages() {
    try {
      const data = await fetchLanguages(); 
      setLanguages(data);                  
    } catch (err) {
      console.error('Failed to fetch languages', err);
    }
  }

  loadLanguages();
  }, [isAuthenticated]);

  useEffect(() => {
  if (!isAuthenticated) return;

  async function loadGenres() {
    try {
      const data = await fetchGenres(); 
      setGenres(data);                  
    } catch (err) {
      console.error('Failed to fetch genres', err);
    }
  }

  loadGenres();
  }, [isAuthenticated]);



  useEffect(() => {
    const syncAuth = () => setIsAuthenticated(Boolean(localStorage.getItem('jwt')));
    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
  }, []);

  async function load(requestedPage = 0) {
    setLoading(true);
    setError(null);

    try {
      const resp = await fetchBooks({
        title: title || undefined,
        isbn: isbn || undefined,
        authorName: authorName || undefined,
        languageName: selectedLanguage || undefined,
        genre: selectedGenre || undefined,
        characterName: characterName || undefined,
        page: requestedPage,
        size: 15,
        sortBy: 'title',
      });

      setBooks(resp.content || []);
      setPage(resp.pageNumber ?? 0);
      setPageInput(String((resp.pageNumber ?? 0) + 1));
      setTotalPages(Math.max(1, resp.totalPages ?? 1));
      setExpanded({});
      console.log('[LOAD] response:', resp);
    } catch (e: any) {
      setError(String(e?.message || e));
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }


  function toggleExpand(id: number) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <>
    <Header/>
    <div
      style={{
        width: '99vw',             
        fontFamily: 'Inter, system-ui, Arial',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        
      }}
    >
      <main style={{ 
        marginBottom: 20,
        padding: '0 20px 0 20px', 
      }}>
        <section style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
          <input
            type="text"
            placeholder="title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                load(0); // reset to first page
              }
            }}
            style={{
              width: 280,
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #ddd',
              fontSize: 14
            }}
          />

          <input
            type="text"
            placeholder="isbn…"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                load(0);
              }
            }}
            style={{
              width: 280,
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #ddd',
              fontSize: 14,
              marginLeft: 10  
            }}
          />

          <input
            type="text"
            placeholder="author…"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                load(0);
              }
            }}
            style={{
              width: 280,
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #ddd',
              fontSize: 14,
              marginLeft: 10  
            }}
          />

          {isAuthenticated && (
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{marginLeft: 10}}
            >
              <option value="">Select language…</option>
              {languages.map(lang => (
                <option key={lang.id} value={lang.language}>{lang.language}</option>
              ))}
            </select>
          )}

          {isAuthenticated && (
            <input
              type="text"
              placeholder="character…"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  load(0);
                }
              }}
              style={{
                width: 280,
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #ddd',
                fontSize: 14,
                marginLeft: 10  
              }}
            />
          )}

          {isAuthenticated && (
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              style={{marginLeft: 10}}
            >
              <option value="">Select genre...</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.name}>{genre.name}</option>
              ))}
            </select>
          )}
        </section>

        <section style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontWeight: 600 }}>{loading ? 'Loading…' : `${books.length} books`}</div>
            <div style={{ color: MUTED }}>• Page {page + 1} / {totalPages}</div>
          </div>
          {error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}
        </section>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 12,
          justifyContent: 'center'
        }}>
          {books.map(b => {
            if (!b.id) return null;
              const id = b.id;
            const long = (b.description ?? '').length > 500;
            const isExpanded = !!expanded[id];
            return (
              <article key={id} style={{
                background: CARD_BG,
                border: `1px solid #e6e9ee`,
                padding: 12,
                borderRadius: 10,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 16 }}>
                    {isAuthenticated &&(
                       <Link
                          to={`/books/${id}/details`}
                          state={{
                            page,
                            title,
                            isbn,
                            authorName, 
                            selectedLanguage,
                            selectedGenre,
                            characterName,
                          }}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {b.title || '—'}
                    </Link>
                    )}
                    { !isAuthenticated &&(
                      b.title || '—'
                    )
                    }
                   
                  </h3>

                  <div style={{ textAlign: 'right', fontSize: 12, color: MUTED }}>
                    <div>{b.format ?? ''}</div>
                    <div style={{ marginTop: 6 }}><Price v={b.price ?? undefined} /></div>
                  </div>
                </div>

                <div style={{ fontSize: 13, color: MUTED, marginTop: 8 }}>
                  <div style={{ marginBottom: 8 }}>
                    <strong style={{ color: '#111' }}>ISBN:</strong> {b.isbn ?? '—'}
                  </div>

                  <div style={{ lineHeight: 1.4 }}>
                    {b.description ? (
                      <>
                        <div>
                          {(!long || isExpanded) ? b.description : (b.description.slice(0, 220) + '…')}
                        </div>
                        {long && (
                          <button
                            onClick={() => toggleExpand(id)}
                            style={{
                              marginTop: 8,
                              background: 'transparent',
                              color: ACCENT,
                              border: 'none',
                              cursor: 'pointer',
                              padding: 0,
                              fontSize: 13
                            }}
                          >
                            {isExpanded ? 'Show less' : 'Show more'}
                          </button>
                        )}
                      </>
                    ) : <em style={{ color: MUTED }}>No description</em>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {!loading && books.length === 0 && !error && (
          <div style={{ marginTop: 16, color: MUTED }}>No books found.</div>
        )}

        <div 
          className="pagination-container"
          style={{ marginTop: 18, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>

          <button
            className="pagination-first"
            data-testid="first-page"
            onClick={() => {
            console.log('[CLICK] First clicked, current page:', page, 'totalPages:', totalPages);
            load(0);
            }}
            disabled={page <= 0 || loading}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: page <= 0 ? 'not-allowed' : 'pointer' }}>
            First
          </button>  
          <button
            className="pagination-prev"
            data-testid="prev-page"
            onClick={() => {
              console.log('[CLICK] Prev clicked, current page:', page);
              load(Math.max(0, page - 1))
            }}
            disabled={page <= 0 || loading}

            style={{
              padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: page <= 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Prev
          </button>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const p = Number(pageInput);
                    if (!Number.isNaN(p) && p >= 1 && p <= totalPages) {
                      load(p - 1);
                    }
                  }
                }}
                style={{
                  width: 60,
                  textAlign: 'center',
                  padding: '6px 8px',
                  borderRadius: 8,
                  border: '1px solid #ddd'
                }}
              />
              <span style={{ color: MUTED }}>/ {totalPages}</span>
            </div>
          </div>

          <button
            className="pagination-next"
            data-testid="next-page"
            onClick={
              () => {
                console.log('[CLICK] Next clicked, current page:', page, 'totalPages:', totalPages);
                load(Math.min(totalPages - 1, page + 1))
              }
            }
            disabled={page >= totalPages - 1 || loading}
            style={{
              padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>

          <button
            className="pagination-last"
            data-testid="last-page"
            onClick={() => {
              console.log('[CLICK] Last clicked, current page:', page, 'totalPages:', totalPages);
              load(totalPages - 1);
            }}
            disabled={page >= totalPages - 1 || loading}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer' }}>
            Last
          </button>
        </div>
      </main>

      <footer
      style={{         
        position: 'fixed', 
        bottom: 0,       
        left: 0,   
        width: '100%',
        padding: '12px 20px',    
        marginTop: 'auto',
        backgroundColor: '#f8fafc', 
        color: MUTED,
        fontSize: 13,
        textAlign: 'center',
      }}
    >
      Tip: click{' '}
      <span
        style={{
          backgroundColor: '#e0f2fe',
          padding: '0px 4px',
          borderRadius: 2,
          lineHeight: 0.8,
        }}
      >
        Show more
      </span>{' '}
      to read full description.
    </footer>

    </div>
  </>
  );
}