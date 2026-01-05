import Header from "../components/Header";

export default function HomePage() {
    return (
        <>
            <Header />
            <div
                style={{
                    width: '100%',        
                    maxWidth: '100%',     
                    boxSizing: 'border-box', 
                    fontFamily: 'Inter, system-ui, Arial',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    padding: '40px 20px 120px',
                    gap: 28,
                    color: '#0f172a',
                    lineHeight: 1.45,
                }}
                >

                {/* HERO */}
                <section
                    style={{
                        maxWidth: 1100,
                        width: '100%',
                        display: 'flex',
                        gap: 24,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap'
                    }}
                >
                    <div style={{ flex: '1 1 520px' }}>
                        <h1 style={{ margin: 0, fontSize: 42, letterSpacing: '-1px' }}>
                            HG Bookstore — Smart Books, Smarter Service
                        </h1>
                        <p style={{ marginTop: 12, color: '#334155', fontSize: 17 }}>
                            A production-ready backend powering a next-level bookstore experience:
                            intelligent renting, dynamic pricing, honest donations, and data-driven offers.
                            Our software makes the whole flow smooth, fast and reliable — so readers win, staff
                            move faster, and the community benefits.
                        </p>

                        <div style={{ marginTop: 18, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <a
                                href="#features"
                                style={{
                                    textDecoration: 'none',
                                    padding: '10px 16px',
                                    borderRadius: 8,
                                    backgroundColor: '#0ea5a4',
                                    color: 'white',
                                    fontWeight: 600,
                                    boxShadow: '0 6px 18px rgba(14,165,164,0.12)'
                                }}
                            >
                                Learn how it works
                            </a>
                        </div>
                    </div>

                    <div
                        style={{
                            flex: '0 1 420px',
                            background: 'linear-gradient(180deg, rgba(14,165,164,0.06), rgba(99,102,241,0.02))',
                            borderRadius: 12,
                            padding: 18,
                            minWidth: 280,
                            boxShadow: '0 8px 30px rgba(2,6,23,0.06)'
                        }}
                    >
                        <h3 style={{ marginTop: 0 }}>Why readers love us</h3>
                        <ul style={{ margin: '8px 0 0 18px', color: '#334155' }}>
                            <li>Affordable rentals with a guarantee: rented copies become cheaper to buy.</li>
                            <li>Transparent lifecycle — rent, buy, or donate (we handle it all).</li>
                            <li>Fast search & smooth checkout backed by enterprise-grade APIs.</li>
                        </ul>
                    </div>
                </section>

                {/* FEATURES */}
                <section id="features" style={{ maxWidth: 1100, width: '100%' }}>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                            gap: 16,
                        }}
                    >
                        <Card
                            title="Smart Renting & Selling"
                            subtitle="Flexible copy-level control"
                            content={
                                <>
                                    <p style={{ marginTop: 8 }}>
                                        Each physical copy (a <strong>Book Instance</strong>) can be rentable, sellable or both.
                                        Staff set <code>maxRentCount</code> per instance — the maximum times it can be rented.
                                        Every rent reduces the eventual sale price proportionally, so borrowers who rent help
                                        future buyers get a better deal. If a copy reaches its rent-limit and isn't sold,
                                        it can be donated automatically — purpose-built for community impact.
                                    </p>
                                </>
                            }
                        />
                        <Card
                            title="Data-Driven Offers"
                            subtitle="We don't guess — we measure"
                            content={
                                <>
                                    <p style={{ marginTop: 8 }}>
                                        We continuously check sales & rental reports and adapt offers accordingly —
                                        promotions, price adjustments, and donation thresholds are tuned from real data.
                                        That means smarter discounts, better inventory decisions, and happier readers.
                                    </p>
                                </>
                            }
                        />
                        <Card
                            title="Comprehensive Reports"
                            subtitle="PDF export, scheduling & email"
                            content={
                                <>
                                    <p style={{ marginTop: 8 }}>
                                        Our backend generates full sales reports (PDF) for any date range and can email
                                        them automatically. Managers use these reports to spot trends, verify campaigns,
                                        and improve user experience — all from one place.
                                    </p>
                                </>
                            }
                        />
                        <Card
                            title="Enterprise-Ready Tech"
                            subtitle="Secure, fast, and automatable"
                            content={
                                <>
                                    <p style={{ marginTop: 8 }}>
                                        JWT authentication, role + permission checks, bulk CSV imports (multi-threaded),
                                        async cover-image processing, and clean REST endpoints make automation and scaling simple.
                                        In short: an amazing backend that lets the storefront shine.
                                    </p>
                                </>
                            }
                        />
                    </div>
                </section>

                {/* PROMISE / SOFT-PRAISE */}
                <section style={{ maxWidth: 1100, width: '100%', marginTop: 8 }}>
                    <div
                        style={{
                            backgroundColor: '#f8fafc',
                            borderRadius: 10,
                            padding: 18,
                            boxShadow: 'inset 0 1px 0 rgba(2,6,23,0.02)'
                        }}
                    >
                        <h3 style={{ margin: '0 0 6px 0' }}>How our software makes it possible (the secret sauce)</h3>
                        <p style={{ marginTop: 6, color: '#334155' }}>
                            The magic is in the details: copy-level lifecycle control (<code>isRentable</code>, <code>isSellable</code>, <code>maxRentCount</code>),
                            automated price degradation tied to actual rent counts, and scheduled jobs that keep covers and reports up-to-date.
                            Because everything is tracked and auditable, staff can trust the system to run campaigns and donations reliably.
                        </p>

                        <p style={{ marginTop: 12, color: '#334155' }}>
                            Our <strong>comprehensive report generation capabilities</strong> let you export exact PDFs, email them, and base operational
                            decisions on hard numbers — so offers improve over time and customers always get the best possible experience.
                        </p>
                    </div>
                </section>

                {/* QUICK STATS / CTA */}
                <section style={{ maxWidth: 1100, width: '100%', display: 'flex', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 280px', padding: 16, borderRadius: 10, background: 'white', boxShadow: '0 8px 20px rgba(2,6,23,0.04)' }}>
                        <h4 style={{ margin: 0 }}>Deploy-ready</h4>
                        <p style={{ marginTop: 8, color: '#475569' }}>
                            Java + Spring Boot, tested Postman collection, scheduled image jobs and report exporters — plug into infra easily.
                        </p>
                    </div>
                    <div style={{ flex: '1 1 280px', padding: 16, borderRadius: 10, background: 'white', boxShadow: '0 8px 20px rgba(2,6,23,0.04)' }}>
                        <h4 style={{ margin: 0 }}>CSV bulk import</h4>
                        <p style={{ marginTop: 8, color: '#475569' }}>
                            Multi-threaded CSV ingest, deduplication helpers, and automated cover downloads — scale your catalog fast.
                        </p>
                    </div>
                    <div style={{ flex: '1 1 280px', padding: 16, borderRadius: 10, background: 'white', boxShadow: '0 8px 20px rgba(2,6,23,0.04)' }}>
                        <h4 style={{ margin: 0 }}>Security & ownership</h4>
                        <p style={{ marginTop: 8, color: '#475569' }}>
                            Role-based guards and SpEL ownership checks ensure users only act on their own payments or resources unless elevated.
                        </p>
                    </div>
                </section>
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

/* Small presentational Card component used above (kept inline so you can drop this file in without extra imports) */
function Card({ title, subtitle, content }: { title: string; subtitle?: string; content: any }) {
    return (
        <div
            style={{
                background: 'white',
                borderRadius: 10,
                padding: 16,
                boxShadow: '0 10px 30px rgba(2,6,23,0.05)',
                minHeight: 140,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
        >
            <div>
                <h4 style={{ margin: 0 }}>{title}</h4>
                {subtitle && <div style={{ marginTop: 6, color: '#64748b', fontSize: 13 }}>{subtitle}</div>}
                <div style={{ marginTop: 10, color: '#334155', fontSize: 14 }}>{content}</div>
            </div>
        </div>
    );
}
