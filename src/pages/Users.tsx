import Header from "../components/Header";
import { fetchUsers, type UserSearchParams} from '../api/api';
import type { UserDTO} from '../types';
import { useEffect, useState } from 'react';
import { Role } from "../security/Enums";
import UserDetailsModal from '../components/UserDetailsModal'; 

const MUTED = '#6b7280';
const ACCENT = '#2563eb'; 

export default function UsersPage() {
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageInput, setPageInput] = useState('1');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [enabled, setEnabled] = useState();
    const [roleName, setRoleName] = useState<Role | undefined>(undefined);
    const [permissionName, setPermissionName] = useState();

    const [error, setError] = useState<string | null>(null);     
    const [loading, setLoading] = useState(false);   

    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    
    useEffect(() => {
        load(0);
    }, []);


    async function load(requestedPage = 0) {
        setLoading(true);
        setError(null);
        try {
            const resp = await fetchUsers({
            firstname: firstName || undefined,
            lastname: lastName || undefined,
            email: email || undefined,
            enabled: enabled || undefined,
            roleName: roleName || undefined,
            permissionName: permissionName || undefined,
            page: requestedPage,
            size: 15,
            sortBy: 'firstname',
            sortDirection: 'ASC'
            });

            setUsers(resp.content || []);
            setPage(resp.pageNumber ?? 0);
            setPageInput(String((resp.pageNumber ?? 0) + 1));
            setTotalPages(Math.max(1, resp.totalPages ?? 1));
            console.log('[LOAD] response:', resp);
        } catch (e: any) {
            setError(String(e?.message || e));
            setUsers([]);
        } finally{
            setLoading(false);
        }
    }


    return(
        <>
            <Header />
            <div
            style={{
                width: '99vw',             
                fontFamily: 'Inter, system-ui, Arial',
                minHeight: '82vh',
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
                            placeholder="first name..."
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
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
                            placeholder="last name..."
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
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
                            placeholder="email…"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                

                        <select
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value as Role || undefined)}
                            style={{marginLeft: 10}}
                        >
                            <option value="">Select role…</option>
                            {Object.values(Role).map(role => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                            ))}
                        </select>
                        </section>
                
                        <section style={{ marginBottom: 12 }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ fontWeight: 600 }}>{loading ? 'Loading…' : `${users.length} users`}</div>
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
                          {users.map(u => {
                            if (!u.id) return null;
                              const id = u.id;
                            return (
                              <article
                                key={id}
                                onClick={() => setSelectedUserId(id)}
                                style={{
                                    cursor: 'pointer',
                                    background: u.enabled ? '#dcfce7' : '#fee2e2',
                                    border: `1px solid #e6e9ee`,
                                    padding: 12,
                                    borderRadius: 10,
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                              }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, minWidth: 0 }}>
                                  <h3
                                    title={u.email}
                                    style={{
                                        margin: 0,
                                        fontSize: 16,
                                        maxWidth: '100%',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                    >
                                    {u.email}
                                    </h3>

                
                                  <div style={{ textAlign: 'right', fontSize: 12, color: MUTED }}>
                                    <div>{u.firstname ?? ''}<br/>{u.lastname}</div>
                                    <div style={{ marginTop: 6 }}>{u.createdAt ? u.createdAt.slice(0, 10) : ''}
</div>
                                  </div>
                                </div>
                              </article>
                            );
                          })}
                        </div>
                
                        {!loading && users.length === 0 && !error && (
                          <div style={{ marginTop: 16, color: MUTED }}>No users found.</div>
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
            
            {selectedUserId !== null && (
                <UserDetailsModal
                    userId={selectedUserId}
                    onClose={() => setSelectedUserId(null)}
                    onUpdated={() => {
                    setSelectedUserId(null);
                    load(page); // refresh current page
                    }}
                />
            )}

        </>
    );
}