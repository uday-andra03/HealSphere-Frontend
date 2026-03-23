import './Features.css'

const features = [
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="#0d9488" />
            </svg>
        ),
        title: 'Find Hospitals',
        desc: 'Browse top-rated hospitals by specialization and location',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" fill="#0d9488" />
            </svg>
        ),
        title: 'Hospital Registration',
        desc: 'Hospitals can register and list their services, specializations, and facilities',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" fill="#0d9488" />
            </svg>
        ),
        title: 'Track Activity',
        desc: 'Real-time hospital activity dashboard with analytics',
    },
    {
        icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="#0d9488" />
            </svg>
        ),
        title: 'Verified Ratings',
        desc: 'Authentic patient reviews and hospital ratings',
    },
]

export default function Features() {
    return (
        <section className="features">
            <div className="features__header">
                <h2 className="features__title text-section-title">Everything You Need for Better Healthcare</h2>
                <p className="features__subtitle text-section-sub">
                    A comprehensive platform connecting patients, doctors, and hospitals for<br />
                    seamless healthcare management.
                </p>
            </div>

            <div className="features__grid">
                {features.map((f, i) => (
                    <div key={i} className="feature-card premium-card">
                        <div className="feature-card__icon">{f.icon}</div>
                        <h3 className="feature-card__title">{f.title}</h3>
                        <p className="feature-card__desc">{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
