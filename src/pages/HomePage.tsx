import Header from "../components/Header";

export default function HomePage() {
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
                <h1>HELLO</h1>
            </div>

            <footer
                style={{        
                boxSizing: 'border-box', 
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