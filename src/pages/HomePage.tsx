import Header from "../components/Header";

export default function HomePage() {
    return(
        <>
            <Header />
            <div
            style={{
                width: '99vw',             
                fontFamily: 'Inter, system-ui, Arial',
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
                © {new Date().getFullYear()} HG. All rights reserved.
            </footer>

        </>
    );
}