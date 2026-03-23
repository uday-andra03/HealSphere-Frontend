import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './TopHospitals.css'
import { getAllHospitals } from '../../../services/hospitalApi'

function StarIcon() {
    return (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
    )
}

export default function TopHospitals() {

    const [topRatedHospitals, setTopRatedHospitals] = useState([])

    useEffect(() => {
        loadTopHospitals()
    }, [])

    const loadTopHospitals = async () => {
        try {
            const response = await getAllHospitals()

            const hospitals =
                response?.data?.data?.hospitals ||
                response?.data?.data ||
                response?.data ||
                []

            const mappedHospitals = (Array.isArray(hospitals) ? hospitals : [])
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 5)
                .map((h, index) => ({
                    id: h.id,
                    initial: h.name?.charAt(0) || 'H',
                    name: h.name,
                    rating: h.rating || 0,
                    reviews: h.reviews || 0,
                    location: h.location || h.city || 'Unknown',
                    tags: h.specializations || [],
                    doctors: h.doctorsCount || h.doctors || 0,
                    beds: h.totalBeds || h.beds || 0,
                    gradient:
                        index % 2 === 0
                            ? 'linear-gradient(135deg, #0d9488 0%, #0e7490 60%, #0c4a6e 100%)'
                            : 'linear-gradient(135deg, #0d9488 0%, #0f766e 60%, #115e59 100%)'
                }))

            setTopRatedHospitals(mappedHospitals)

            console.log("Top Hospitals API:", mappedHospitals)

        } catch (error) {
            console.error("Top Hospitals API Error:", error)
            setTopRatedHospitals([])
        }
    }

    return (
        <section className="top-hospitals">
            <div className="top-hospitals__head">
                <div>
                    <Link to="/hospitals" className="top-hospitals__title-link">
                        <h2 className="top-hospitals__title text-section-title">Top Rated Hospitals</h2>
                    </Link>
                    <p className="top-hospitals__sub text-section-sub" style={{ margin: '8px 0 0' }}>
                        Highest rated facilities based on patient reviews
                    </p>
                </div>

                <Link
                    to="/hospitals"
                    className="top-hospitals__view-all btn-outline"
                    style={{ padding: '10px 24px', fontSize: '14px' }}
                >
                    View All →
                </Link>
            </div>

            <div className="hospitals-grid">
                {topRatedHospitals.map((h, i) => (
                    <Link key={h.id || i} to={`/hospital/${h.id}`} className="hospital-card-link">
                        <div className="hospital-card premium-card" style={{ padding: '0', overflow: 'hidden' }}>
                            <div className="hospital-card__banner" style={{ background: h.gradient }}>
                                <span className="hospital-card__initial">{h.initial}</span>

                                <div className="hospital-card__rating">
                                    <StarIcon />
                                    <span>{h.rating}</span>
                                    <span className="hospital-card__reviews">({h.reviews})</span>
                                </div>
                            </div>

                            <div className="hospital-card__body">
                                <h3 className="hospital-card__name">{h.name}</h3>

                                <p className="hospital-card__location">
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="#94a3b8">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                                    </svg>
                                    {h.location}
                                </p>

                                <div className="hospital-card__tags">
                                    {h.tags.slice(0, 3).map((t, j) => (
                                        <span key={j} className="hospital-card__tag">{t}</span>
                                    ))}

                                    {h.tags.length > 3 && (
                                        <span className="hospital-card__tag hospital-card__tag--more">
                                            +{h.tags.length - 3}
                                        </span>
                                    )}
                                </div>

                                <div className="hospital-card__footer">
                                    <span className="hospital-card__stat">
                                        {h.doctors} Doctors
                                    </span>

                                    <span className="hospital-card__stat">
                                        {h.beds} Beds
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
