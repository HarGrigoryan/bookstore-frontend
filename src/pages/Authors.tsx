import Header from "../components/Header";
import { useEffect, useState } from 'react';
import type { AuthorDTO } from "../types";
import { fetchAuthors } from "../api/api";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';



const MUTED = '#6b7280';

export default function AuthorsPage() {

    const [authors, setAuthors] = useState<AuthorDTO[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageInput, setPageInput] = useState('1');

    const [fullName, setFullName] = useState('');
    const [isOnGoodreads, setIsOnGoodreads] = useState<boolean | undefined>(undefined);


    const [error, setError] = useState<string | null>(null);   
    const [loading, setLoading] = useState(false);  
    const [readyToLoad, setReadyToLoad] = useState(false);


    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        const s = location.state as any;
        if (s) {
            setFullName(s.fullName ?? '');
            setIsOnGoodreads(s.isOnGoodreads);
            setPage(s.page ?? 0);
        }
        setReadyToLoad(true);
    }, []);


    useEffect(() => {
        if (!readyToLoad) return;
        load(page);
    }, [readyToLoad, fullName, isOnGoodreads, page]);



    async function load(requestedPage = 0) {
        setLoading(true);
        setError(null);
        try {
            const resp = await fetchAuthors({
                fullName: fullName || undefined,
                isOnGoodreads: isOnGoodreads === undefined ? undefined : isOnGoodreads,
                page: requestedPage,
                size: 14,
                sortBy: 'firstname',
                sortDirection: 'ASC'
            });

            setAuthors(resp.content || []);
            setPage(resp.pageNumber ?? 0);
            setPageInput(String((resp.pageNumber ?? 0) + 1));
            setTotalPages(Math.max(1, resp.totalPages ?? 1));
            console.log('[LOAD] response:', resp);
        } catch (e: any) {
            setError(String(e?.message || e));
            setAuthors([]);
        } finally{
            setLoading(false);
        }
    }

    return(
        <>
            <Header />
            <div
            style={{
                width: '100vw',             
                fontFamily: 'Inter, system-ui, Arial',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
                
            }}
            >
   <main style={{ 
                        marginBottom: 20,
                        padding: '0 20px 0 20px', 
                      }}>
                        <section style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
                          <input
                            type="text"
                            placeholder="full name..."
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                setPage(0);
                                load(0); 
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
                
                          <select
                            value={
                                isOnGoodreads === undefined
                                ? ''
                                : isOnGoodreads
                                ? 'true'
                                : 'false'
                            }
                            onChange={(e) => {
                                const v = e.target.value;
                                setIsOnGoodreads(
                                v === '' ? undefined : v === 'true'
                                );
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setPage(0);
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
                            >
                            <option value="">GoodReads (any)</option>
                            <option value="true">On GoodReads</option>
                            <option value="false">Not on GoodReads</option>
                            </select>
                        </section>
                        <section style={{ marginBottom: 12 }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ fontWeight: 600 }}>{loading ? 'Loading…' : `${authors.length} users`}</div>
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
                          {authors.map(a => {
                            if (!a.id) return null;
                              const id = a.id;
                            return (
                              <article
                                key={id}
                                onClick={() => {
                                    navigate('/books', {
                                    state: {
                                        authorName: a.fullName,
                                        page: page,
                                        authorsState: {
                                            page,
                                            fullName,
                                            isOnGoodreads,
                                            },
                                    },
                                    });
                                }}
                                style={{
                                    cursor: 'pointer',
                                    background: a.isOnGoodreads? '#dcfce7' : 'transparent   ',
                                    border: `1px solid #e6e9ee`,
                                    padding: 12,
                                    borderRadius: 10,
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                              }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, minWidth: 0 }}>
                                  <h3
                                    title={a.fullName}
                                    style={{
                                        margin: 0,
                                        fontSize: 16,
                                        maxWidth: '100%',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                    >
                                    {a.fullName}
                                    </h3>

                                </div>
                              </article>
                            );
                          })}
                        </div>
                
                        {!loading && authors.length === 0 && !error && (
                          <div style={{ marginTop: 16, color: MUTED }}>No authors found.</div>
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
            </div>

            <footer
                style={{        
                position: 'fixed', 
                bottom: 0,       
                left: 0,         
                width: '100%',
                padding: '12px 20px',    
                backgroundColor: '#f8fafc', 
                fontSize: 13,
                textAlign: 'center',
                }}
            >
                © {new Date().getFullYear()} HG Bookstore. All rights reserved.
            </footer>

        </>
    );
}