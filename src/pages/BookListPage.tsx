import React, { useEffect, useState } from 'react';
import type { BookSearchResponseDTO, PageResponseDTO } from '../types';
import { fetchBooks } from '../api';
import { Link } from 'react-router-dom';



// small design tokens
const ACCENT = '#2563eb'; // blue
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
  const [expanded, setExpanded] = useState<Record<number, boolean>>({}); 

  useEffect(() => {
    load(page);
  }, []);


  async function load(requestedPage = 0) {
    setLoading(true);
    setError(null);

    try {
      const resp = await fetchBooks({
        page: requestedPage, // <- send page
        size: 10,
        sortBy: 'title',
      });

      setBooks(resp.content || []);
      setPage(resp.pageNumber ?? 0);
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
    <div style={{ padding: 20, maxWidth: 960, margin: '0 auto', fontFamily: 'Inter, system-ui, Arial' }}>
      <header style={{ display: 'flex',  flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 12, textAlign: 'center'}}>
        <h1 style={{ margin: 0 }}>Bookstore</h1>
      </header>

      <section style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontWeight: 600 }}>{loading ? 'Loading…' : `${books.length} books`}</div>
          <div style={{ color: MUTED }}>• Page {page + 1} / {totalPages}</div>
        </div>
        {error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}
      </section>

      <main>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 12,
          justifyContent: 'center'
        }}>
          {books.map(b => {
            if (!b.id) return null;
              const id = b.id;
            const long = (b.description ?? '').length > 240;
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
                    <Link
                      to={`/books/${id}/details`}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {b.title || '—'}
                    </Link>
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
          <div style={{ marginTop: 16, color: MUTED }}>No books found for this page.</div>
        )}

        <div 
          className="pagination-container"
          style={{ marginTop: 18, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>

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
            <div style={{
              minWidth: 56,
              textAlign: 'center',
              padding: '6px 8px',
              borderRadius: 8,
              border: '1px solid #eee',
              background: '#fafafa'
            }}>
              {page + 1} / {totalPages}
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

      <footer style={{ marginTop: 20, color: MUTED, fontSize: 13 }}>
        Tip: click <span style={{ backgroundColor: '#e0f2fe', padding: '0px 4px', borderRadius: 2, lineHeight: 0.8 }}>Show more</span> to read full description.
      </footer>
    </div>
  );
}