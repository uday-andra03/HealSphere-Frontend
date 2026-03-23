import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const stats = [
    { value: '500+', label: 'Hospitals Listed' },
    { value: '50K+', label: 'Patients Helped' },
    { value: '1,200+', label: 'Specialists' },
    { value: '4.8★', label: 'Average Rating' },
];

const steps = [
    {
        number: '01',
        title: 'Search for a Hospital',
        desc: 'Use our powerful search to find top-rated hospitals by specialization, location, or name — all from one place.',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        ),
    },
    {
        number: '02',
        title: 'Explore Hospital Profiles',
        desc: 'Browse detailed profiles with departments, facilities, verified patient reviews, and ratings.',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
    },
    {
        number: '03',
        title: 'Connect with Specialists',
        desc: 'Discover verified specialists in your area with their full credentials and hospital affiliations.',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
    {
        number: '04',
        title: 'Make Informed Decisions',
        desc: 'Read authentic patient reviews, compare hospitals, and choose the best care for you and your family.',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        ),
    },
];

const highlights = [
    {
        emoji: '🏥',
        title: 'Verified Hospitals',
        desc: 'Every hospital on HealSphere is manually verified by our team for accuracy and quality.',
        bg: '#f0fdfa',
        border: '#99f6e4',
    },
    {
        emoji: '⭐',
        title: 'Authentic Reviews',
        desc: 'Only verified patients can leave reviews, ensuring you always get honest, reliable feedback.',
        bg: '#fefce8',
        border: '#fde68a',
    },
    {
        emoji: '🔒',
        title: 'Secure & Private',
        desc: 'Your data is protected with industry-standard encryption. Your privacy is our top priority.',
        bg: '#eff6ff',
        border: '#bfdbfe',
    },
    {
        emoji: '📊',
        title: 'Live Activity Dashboard',
        desc: 'Track hospital activity, trends, and analytics in real time — all in a beautiful dashboard.',
        bg: '#fdf4ff',
        border: '#e9d5ff',
    },
    {
        emoji: '🌐',
        title: 'Wide Coverage',
        desc: 'Hospitals across multiple cities and specializations listed on a single unified platform.',
        bg: '#fff7ed',
        border: '#fed7aa',
    },
    {
        emoji: '💬',
        title: '24/7 Support',
        desc: 'Our support team is always ready to help patients and hospitals with any queries.',
        bg: '#f0fdf4',
        border: '#bbf7d0',
    },
];

export default function About() {
    return (
        <div className="about-page">

            {/* ── Hero ── */}
            <section className="ab-hero">
                <div className="ab-hero__badge">🏥 Healthcare Made Simple</div>
                <h1 className="ab-hero__title text-hero">
                    About <span className="ab-hero__teal">HealSphere</span>
                </h1>
                <p className="ab-hero__sub text-section-sub">
                    Bridging the gap between patients and world-class healthcare providers
                    through a trusted, transparent, and technology-driven platform.
                </p>
                <div className="ab-hero__actions">
                    <Link to="/hospitals" className="btn-primary">Explore Hospitals</Link>
                    <Link to="/help" className="btn-outline">Learn More</Link>
                </div>

                {/* decorative blobs */}
                <div className="ab-blob ab-blob--1" />
                <div className="ab-blob ab-blob--2" />
            </section>

            {/* ── Stats Banner ── */}
            <section className="ab-stats">
                {stats.map((s, i) => (
                    <div key={i} className="ab-stat">
                        <span className="ab-stat__value">{s.value}</span>
                        <span className="ab-stat__label">{s.label}</span>
                    </div>
                ))}
            </section>

            {/* ── Mission ── */}
            <section className="ab-section ab-mission">
                <div className="ab-mission__visual">
                    <div className="ab-visual-card">
                        <div className="ab-visual-card__icon">🎯</div>
                        <h3>Our Mission</h3>
                        <p>Quality healthcare accessible to everyone, everywhere.</p>
                    </div>
                    <div className="ab-visual-card ab-visual-card--teal">
                        <div className="ab-visual-card__icon">💡</div>
                        <h3>Our Vision</h3>
                        <p>A world where finding the right doctor is as easy as a search.</p>
                    </div>
                    <div className="ab-visual-card">
                        <div className="ab-visual-card__icon">❤️</div>
                        <h3>Our Values</h3>
                        <p>Trust, transparency, and compassion in every interaction.</p>
                    </div>
                </div>
                <div className="ab-mission__text">
                    <div className="ab-section-badge">Who We Are</div>
                    <h2 className="ab-section-title text-section-title">Revolutionizing Healthcare Accessibility</h2>
                    <p className="ab-section-desc">
                        At HealSphere, we believe that quality healthcare should be accessible to everyone,
                        everywhere. Our mission is to bridge the gap between patients and healthcare
                        providers through innovative digital solutions that simplify the process of
                        finding and receiving care.
                    </p>
                    <p className="ab-section-desc">
                        We provide a comprehensive platform for patients to search for hospitals,
                        view detailed information about services and specialists, and make confident
                        healthcare decisions — all in one place.
                    </p>
                    <div className="ab-checklist">
                        <div className="ab-check"><span>✓</span> Comprehensive Hospital Directory</div>
                        <div className="ab-check"><span>✓</span> Verified Specializations & Facilities</div>
                        <div className="ab-check"><span>✓</span> Transparent Patient Reviews</div>
                        <div className="ab-check"><span>✓</span> Secure & Reliable Platform</div>
                    </div>
                </div>
            </section>

            {/* ── How It Works (Roadmap) ── */}
            <section className="ab-roadmap">
                <div className="ab-roadmap__header">
                    <div className="ab-section-badge">How It Works</div>
                    <h2 className="ab-section-title">Your Journey to Better Healthcare</h2>
                    <p className="ab-section-desc" style={{ maxWidth: 560, margin: '12px auto 0' }}>
                        From search to specialist, we make the healthcare journey simple, clear, and fast.
                    </p>
                </div>
                <div className="ab-steps">
                    {steps.map((step, i) => (
                        <div key={i} className="ab-step">
                            <div className="ab-step__connector" />
                            <div className="ab-step__icon">{step.icon}</div>
                            <div className="ab-step__num">{step.number}</div>
                            <div className="ab-step__content">
                                <h3 className="ab-step__title">{step.title}</h3>
                                <p className="ab-step__desc">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Highlights Grid ── */}
            <section className="ab-highlights">
                <div className="ab-section-badge" style={{ textAlign: 'center', marginBottom: 12 }}>Why HealSphere</div>
                <h2 className="ab-section-title" style={{ textAlign: 'center', marginBottom: 8 }}>Everything You Need for Better Healthcare</h2>
                <p className="ab-section-desc" style={{ textAlign: 'center', marginBottom: 48 }}>
                    A platform built with patients and hospitals in mind — every feature crafted for your wellbeing.
                </p>
                <div className="ab-highlights__grid">
                    {highlights.map((h, i) => (
                        <div key={i} className="ab-highlight-card premium-card" style={{ borderColor: h.border }}>
                            <div className="ab-highlight-card__emoji">{h.emoji}</div>
                            <h3 className="ab-highlight-card__title">{h.title}</h3>
                            <p className="ab-highlight-card__desc">{h.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="ab-cta">
                <div className="ab-cta__inner">
                    <h2 className="ab-cta__title">Ready to Find the Right Hospital?</h2>
                    <p className="ab-cta__sub">
                        Join thousands of patients who trust HealSphere to connect them with top-rated healthcare.
                    </p>
                    <div className="ab-hero__actions">
                        <Link to="/hospitals" className="btn-primary" style={{ background: 'var(--white)', color: 'var(--teal-dark)' }}>Browse Hospitals</Link>
                        <Link to="/hospital-auth" className="btn-outline" style={{ border: '2px solid rgba(255, 255, 255, 0.7)', color: 'var(--white)' }}>Register Your Hospital</Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
