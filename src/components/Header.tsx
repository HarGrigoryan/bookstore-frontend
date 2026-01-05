import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isManager, isManagerOrStaff } from '../security/Utils';

const ACCENT = '#2563eb';
const HEADER_BG = '#f8fafc';

export default function Header({ showAuth = true }: { showAuth?: boolean }) {
    const [isAuthenticated, setIsAuthenticated] = useState(
        showAuth && Boolean(localStorage.getItem('jwt'))
        );
    
    const [manager, setManager] = useState(false);

    useEffect(() => {
        if (!showAuth || !isAuthenticated) {
            setManager(false);
            return;
        }
        setManager(isManagerOrStaff());
    }, [showAuth, isAuthenticated]);


    useEffect(() => {
    if (!showAuth) return;

    const syncAuth = () => {
        setIsAuthenticated(Boolean(localStorage.getItem('jwt')));   
        setManager(isManager());
    };

    window.addEventListener('storage', syncAuth);
    return () => window.removeEventListener('storage', syncAuth);
    }, [showAuth]);


  return (
    <header style={{
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        borderBottom: '1px solid #eee',
        backgroundColor: HEADER_BG,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',        
        left: 0,
        maxWidth: '100vw',
        marginBottom: 16
    }}>
      <h1 style={{ margin: 0, fontSize: 28, textShadow: '1px 1px 1px #000000'}}>
        <Link to="/" style={{color:'#00008b'}}>Bookstore</Link>
      </h1>
        <div style={{ display: 'flex', gap: 16, marginLeft: 'auto', alignItems: 'center' }}>
      
            <nav style={{display: 'flex', gap: 12}}>
                <Link to="/books">BookList</Link>
            </nav>

            <nav style={{display: 'flex', gap: 12}}>
                <Link to="/authors">Authors</Link>
            </nav>

            {showAuth  && isAuthenticated && manager && (
                <nav style={{display: 'flex', gap: 12}}>
                <Link to="/users">Users</Link>
            </nav>
            )}

            <nav style={{ display: 'flex', gap: 12 }}>
                {showAuth && !isAuthenticated && (
                <>
                    <Link to="/signup">Sign up</Link>
                    <Link to="/login" style={{ background: ACCENT, color: '#fff' }}>
                    Log in
                    </Link>
                </>
                )}

                {showAuth  && isAuthenticated && (
                <button
                    onClick={() => {
                    localStorage.clear();
                    setIsAuthenticated(false);
                    }}
                >
                    Log out
                </button>
                )}
            </nav>
        </div>
    </header>
  );
}
