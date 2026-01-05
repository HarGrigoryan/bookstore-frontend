import Header from "../components/Header";

export default function AuthorsPage() {
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
                <h1>AUTHORS</h1>
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