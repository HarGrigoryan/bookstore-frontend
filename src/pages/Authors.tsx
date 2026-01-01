import Header from "../components/Header";

export default function AuthorsPage() {
    return(
        <>
        <Header />
        <div
        style={{
            width: '99vw',             
            fontFamily: 'Inter, system-ui, Arial',
            minHeight: '89vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
            
        }}
        >
            <h1>AUTHORS</h1>
        </div>
        </>
    );
}