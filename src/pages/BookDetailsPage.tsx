import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchAuthor, fetchBookById, fetchBookInstances } from '../api/api';
import type { BookSearchResponseDTO, PageResponseDTO, BookInstanceDTO } from '../types';
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
  const [authors, setAuthors] = useState<PageResponseDTO<any> | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!id) return;
    const bookId = Number(id);

    setLoading(true);
    setError(null);

    Promise.all([
    fetchBookById(bookId),
    fetchBookInstances(bookId),
    fetchAuthor({ bookId }),]).then(([bookData, instancesData, authorsData]) => {
            setBook(bookData);
            setInstances(instancesData);
            setAuthors(authorsData); })
                .catch((err) => setError(String(err)))
                .finally(() => setLoading(false));
            }, [id]);

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>;
  if (error) return <div style={{ padding: 40, color: 'red' }}>Error: {error}</div>;
  if (!book) return <div style={{ padding: 40 }}>No book found.</div>;

  const instanceList = instances?.content ?? [];

  return (
  <>
    <Header/>
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
            Published: <strong>{book.publishDate ?? '—'}</strong>
            <br/>
            Author(s): <strong>{authors?.content?.length ? authors.content.map(a => a.fullName).join(', ') : '—'} </strong>
        </p>
      </div>

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
                <div>{!long || expanded ? book.description : book.description.slice(0, 220) + '…'}</div>
                {long && (
                    <button
                    onClick={() => setExpanded(!expanded)}
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
                    {expanded ? 'Show less' : 'Show more'}
                    </button>
                )}
                </>
            );
            })()}
        </div>
        )}

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
        width: '100vw',          
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
