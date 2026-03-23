import { useState } from 'react'
import './Help.css'

const supportCards = [
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: 'Free Support Forum',
        desc: 'If you are using our free version, please let us know your query here.',
        action: 'Post your query',
        href: '#',
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 22V12h6v10" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: 'Hospital Support',
        desc: 'Are you a registered hospital facing issues? Raise a priority support request and get help fast.',
        action: 'Raise a support request',
        href: '#',
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" stroke="#0d9488" strokeWidth="1.8" />
                <path d="M12 8v8M8 12h8" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        ),
        title: 'Hospital Registration Help',
        desc: 'Need help registering your hospital? Our team will guide you through the process.',
        action: 'Get registration help',
        href: '#',
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="9" cy="7" r="4" stroke="#0d9488" strokeWidth="1.8" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        ),
        title: 'Patient Assistance',
        desc: 'Having trouble finding the right hospital or specialist? Let us help you connect.',
        action: 'Get patient support',
        href: '#',
    },
]

const popularSearches = [
    'How to register a hospital on HealSphere?',
    'How to reset my account password?',
    'How to find hospitals by specialization?',
    'How to update hospital profile information?',
    'How to view and manage patient reviews?',
    'How to contact a hospital directly?',
]

const faqs = [
    {
        q: 'What is HealSphere?',
        a: 'HealSphere is a comprehensive healthcare platform that connects patients with top-rated hospitals and specialists. You can search hospitals, browse specializations, and connect with the right medical professionals.',
    },
    {
        q: 'How do I register my hospital?',
        a: "Click on 'Hospital Portal' in the navbar, fill in your hospital details including specializations and facilities, and our team will verify and approve your listing.",
    },
    {
        q: 'Is HealSphere free to use for patients?',
        a: 'Yes! HealSphere is completely free for patients. Browse hospitals, read verified reviews, and connect with healthcare providers at no cost.',
    },
    {
        q: 'How are hospital ratings verified?',
        a: 'All reviews are submitted by verified patients who have visited the hospital. Our team reviews reports and removes any fraudulent content to ensure authenticity.',
    },
    {
        q: 'How can I contact support?',
        a: 'You can reach our support team through the Free Support Forum or by creating a Premium Support ticket. For sales queries, use the Sales Queries card above.',
    },
    {
        q: 'Can I search for specific specializations?',
        a: 'Absolutely! Use the search bar on the homepage or browse the Hospitals section to filter by specialization, location, and ratings.',
    },
]

export default function Help() {
    const [openFaq, setOpenFaq] = useState(null)

    return (
        <div className="help-page">

            {/* ── Hero ── */}
            <section className="help-hero">
                <div className="help-hero__text">
                    <h1 className="help-hero__title text-hero">Welcome! How can we help?</h1>
                    <p className="help-hero__sub text-section-sub">
                        Hi there, stuck somewhere? Don't worry we're here to help. Check out our
                        step-by-step documentation and browse the FAQ below.
                    </p>
                </div>
                <div className="help-hero__visual" aria-hidden="true">
                    <div className="help-browser">
                        <div className="help-browser__bar">
                            <span className="dot dot--red"></span>
                            <span className="dot dot--yellow"></span>
                            <span className="dot dot--green"></span>
                        </div>
                        <div className="help-browser__body"></div>
                    </div>
                    <div className="help-blob b1"></div>
                    <div className="help-blob b2"></div>
                </div>
            </section>

            {/* ── Support Cards ── */}
            <section className="help-cards-section">
                <div className="help-cards-grid">
                    {supportCards.map((c, i) => (
                        <div key={i} className="help-support-card premium-card">
                            <div className="help-support-card__icon">{c.icon}</div>
                            <h3 className="help-support-card__title">{c.title}</h3>
                            <p className="help-support-card__desc">{c.desc}</p>
                            <a href={c.href} className="help-support-card__link btn-outline" style={{ padding: '8px 20px', fontSize: '13px' }}>{c.action}</a>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Popular Searches ── */}
            <section className="help-searches-section">
                <div className="help-section-inner">
                    <h2 className="help-section-title text-section-title">Popular Searches</h2>
                    <p className="help-section-sub text-section-sub">
                        Do you have a question? Check out our most browsed knowledge base articles to get quick answers.
                    </p>
                    <div className="help-searches-grid">
                        {popularSearches.map((q, i) => (
                            <button key={i} className={`help-search-pill${i === 0 ? ' active' : ''}`}>
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="help-faq-section">
                <div className="help-section-inner">
                    <h2 className="help-section-title text-section-title">Frequently Asked Questions</h2>
                    <p className="help-section-sub text-section-sub">Find answers to the most common questions about HealSphere.</p>
                    <div className="help-faq-list">
                        {faqs.map((item, i) => (
                            <div
                                key={i}
                                className={`help-faq-item${openFaq === i ? ' open' : ''}`}
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            >
                                <div className="help-faq-q">
                                    <span>{item.q}</span>
                                    <svg className="help-faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                                {openFaq === i && <div className="help-faq-a">{item.a}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── No answers CTA ── */}
            <section className="help-cta-section">
                <div className="help-cta-inner">
                    <div className="help-cta-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h2 className="help-cta-title text-section-title" style={{ color: 'white' }}>No answers to your query?</h2>
                    <p className="help-cta-sub text-section-sub" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                        Our support team is ready to help. Reach out and we'll get back to you as soon as possible.
                    </p>
                    <a href="mailto:support@healsphere.com" className="btn-primary" style={{ background: 'white', color: 'var(--teal-dark)' }}>Contact Support</a>
                </div>
            </section>

        </div>
    )
}
