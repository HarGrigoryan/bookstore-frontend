import { useParams } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchAuthorsByBookId, fetchBookById, fetchBookInstances, fetchCharactersByBookId, fetchGenresByBookId, fetchLanguage } from '../api/api';
import { type BookSearchResponseDTO, type PageResponseDTO, type BookInstanceDTO, type CharacterDTO, type AuthorDTO, type GenreDTO, type LanguageDTO } from '../types';
import Header from '../components/Header';

const COLORS = {
  accent: '#2563eb',
  muted: '#6b7280',
  cardBg: '#ffffff',
  pageBg: '#fefefe',
  border: '#e5e7eb',
  statusAvailable: '#10b981',
  statusUnavailable: '#ef4444',
};

export default function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookSearchResponseDTO | null>(null);
  const [instances, setInstances] = useState<PageResponseDTO<BookInstanceDTO> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authors, setAuthors] = useState<AuthorDTO[] | null>(null);
  const [characters, setCharacters] = useState<CharacterDTO[] | null>(null); 
  const [expanded, setExpanded] = useState(false);
  const [charsExpanded, setCharsExpanded] = useState(false);
  const [genres, setGenres] = useState<GenreDTO[] | null>(null); 
  const [genresExpanded, setGenresExpanded] = useState(false);
  const [language, setLanguage] = useState<LanguageDTO | null>(null);


  const navigate = useNavigate();
  const location = useLocation();



  useEffect(() => {
      if (!id) {
        setLoading(false);
        setError('No book id provided');
        return;
      }

    const bookId = Number(id);

    setLoading(true);
    setError(null);

    Promise.all([
    fetchBookById(bookId),
    fetchBookInstances(bookId),
    fetchAuthorsByBookId(bookId),
    fetchCharactersByBookId(bookId),
    fetchGenresByBookId(bookId)  
      ]).then(([bookData, instancesData, authorsData, charactersData, genresData]) => {
            setBook(bookData);
            setInstances(instancesData);
            setAuthors(authorsData); 
            setCharacters(charactersData);
            setGenres(genresData);
          })
                .catch((err) => setError(String(err)))
                .finally(() => setLoading(false));
           
  }, [id]);

  useEffect(() => {
    if (book?.languageId == null) return;
    fetchLanguage(book.languageId).then(setLanguage);
  }, [book]);


  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;
  if (error) return <div style={{ padding: 40, color: 'red' }}>Error: {error}</div>;
  if (!book) return <div style={{ padding: 40 }}>No book found.</div>;

  const instanceList = instances?.content ?? [];

  return (
  <>
    <Header/>
    <button
      onClick={() =>
          navigate('/books', { state: location.state })
        }
        style={{
          alignSelf: 'flex-start',
          margin: '12px 0 0 40px',
          background: 'transparent',
          border: 'none',
          fontSize: 20,
          cursor: 'pointer',
        }}
      >
        ← Back
      </button>

    <div
      style={{
        minHeight: '100vh',
        padding: '0px 40px 40px 40px',
        fontFamily: 'Inter, sans-serif',
        background: COLORS.pageBg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Book Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: 32,
        }}
      >
        <h1 style={{ fontSize: 36, marginBottom: 8 }}>{book.title}</h1>
        <p style={{ color: COLORS.muted, fontSize: 16 }}>
            ISBN: <strong>{book.isbn ? <a href={`https://isbnsearch.org/isbn/${book.isbn}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{book.isbn}</a> : '—'}</strong> &nbsp;|&nbsp;
            Format: <strong>{book.format ?? '—'}</strong> &nbsp;|&nbsp;
            Price: <strong>{book.price != null ? `$${book.price.toFixed(2)}` : '—'}</strong> &nbsp;|&nbsp;
            Published: <strong>{book.publishDate ?? '—'}</strong> &nbsp;|&nbsp;
            Language: <strong>{language?.language}</strong>
            <br/>
            Author(s): <strong>{authors?.length ? authors.map(a => a.fullName).join(', ') : '—'} </strong>
        </p>
      </div>

      {/*Genres*/}
      {genres?.length ? (
        <div
          style={{
            maxWidth: 800,
            width: '100%',
            padding: 20,
            background: COLORS.cardBg,
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            marginBottom: 40,
            lineHeight: 1.6,
          }}
        >
          {(() => {
            const long = genres.length > 10;
            return (
            <>
              <div>
                <strong style={{ color: '#111' }}>Genres: </strong>{' '}
                {(!long || genresExpanded
                  ? genres
                  : genres.slice(0, 10) 
                ).map(g => g.name).join(', ')}               
                {long && (
                  <button
                    onClick={() => setGenresExpanded(!genresExpanded)}
                    style={{
                      marginTop: 8,
                      background: 'transparent',
                      color: COLORS.accent,
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      fontSize: 13,
                    }}
                  >
                    {genresExpanded ? 'Show less' : 'Show more'}
                  </button>
                )}
            </div>
            </>
            );
          })()}
        </div>
      ): null}


      {/* Book Description */}
      {book.description && (
        <div
            style={{
            maxWidth: 800,
            width: '100%',
            padding: 20,
            background: COLORS.cardBg,
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            marginBottom: 40,
            lineHeight: 1.6,
            }}
        >
          {(() => {
            const long = book.description.length > 500;
            return (
                <>
                <div>
                  <strong style={{ color: '#111' }}>Description:</strong>{' '}
                  <br/>
                  {!long || expanded ? book.description : book.description.slice(0, 220)}
                  {long && (
                      <button
                      onClick={() => setExpanded(!expanded)}
                      style={{
                          marginTop: 0,
                          background: 'transparent',
                          color: COLORS.accent,
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          fontSize: 13,
                      }}
                      >
                      {expanded ? 'Show less' : 'Show more'}
                      </button>  
                  )}
                  </div>
                </>
          );
          })()}
        </div>
        )
      }

      {/*Characters*/}
      {characters?.length ? (
        <div
          style={{
            maxWidth: 800,
            width: '100%',
            padding: 20,
            background: COLORS.cardBg,
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            marginBottom: 40,
            lineHeight: 1.6,
          }}
        >
          {(() => {
            const long = characters.length > 10;
            return (
            <>
              <div>
                <strong style={{ color: '#111' }}>Characters:</strong>{' '}
                <br/>
                {(!long || charsExpanded
                  ? characters
                  : characters.slice(0, 10) 
                ).map(c => c.fullName + (c.comment ? ` (${c.comment})` : '')).join(', ')}               
                {long && (
                  <button
                    onClick={() => setCharsExpanded(!charsExpanded)}
                    style={{
                      marginTop: 8,
                      background: 'transparent',
                      color: COLORS.accent,
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      fontSize: 13,
                    }}
                  >
                    {charsExpanded ? 'Show less' : 'Show more'}
                  </button>
                )}
            </div>
            </>
            );
          })()}
        </div>
      ): null}


      {/* Book Instances */}
      <section style={{ width: '100%', maxWidth: 960 }}>
        <h2 style={{ fontSize: 28, marginBottom: 24, textAlign: 'center' }}>Book Instances</h2>
        {instanceList.length === 0 ? (
          <p style={{ color: COLORS.muted, textAlign: 'center' }}>No instances currently available.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 20,
              justifyItems: 'center',
            }}
          >
            {instanceList.map((inst) => (
              <div
                key={inst.id}
                style={{
                  background: COLORS.cardBg,
                  borderRadius: 12,
                  padding: 20,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  width: '100%',
                  maxWidth: 280,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  const t = e.currentTarget;
                  t.style.transform = 'translateY(-4px)';
                  t.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  const t = e.currentTarget;
                  t.style.transform = 'translateY(0)';
                  t.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 16 }}>Instance #{inst.instanceNumber ?? '—'}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      background: inst.isRentable ? COLORS.statusAvailable : COLORS.statusUnavailable,
                      color: '#fff',
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  >
                    {inst.isRentable ? 'Rentable' : 'Not Rentable'}
                  </span>
                  <span
                    style={{
                      background: inst.isSellable ? COLORS.statusAvailable : COLORS.statusUnavailable,
                      color: '#fff',
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  >
                    {inst.isSellable ? 'Sellable' : 'Not Sellable'}
                  </span>
                </div>
                <div style={{ fontSize: 14, color: COLORS.muted }}>Status: {inst.status ?? '—'}</div>
                <div style={{ fontSize: 14, color: COLORS.muted }}>
                  Price: {inst.price != null ? `$${inst.price.toFixed(2)}` : '—'}
                </div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>
                  Max Rent Count: {inst.maxRentCount ?? '—'}
                </div>
                <div style={{ fontSize: 12, color: COLORS.muted }}> Last updated:{' '} {inst.updatedAt ? new Date(inst.updatedAt).toLocaleDateString() : '—'} </div>

              </div>
            ))}
          </div>
        )}
      </section>
    </div>

     <footer
      style={{
        width: '99vw',          
        boxSizing: 'border-box', 
        padding: '12px 20px',    
        marginTop: 20,
        backgroundColor: '#f8fafc', 
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
  </>
  );
}
