import { Link } from 'react-router-dom'
import './DoctorCTA.css'

export default function DoctorCTA() {
    return (
        <section className="doctor-cta">
            <div className="doctor-cta__container">
                <h2 className="doctor-cta__title">Register Your Hospital</h2>
                <p className="doctor-cta__text">
                    Join our growing network of trusted healthcare institutions. List your<br />
                    hospital and connect with thousands of patients today.
                </p>
                <Link to="/hospital-auth" className="doctor-cta__btn">
                    Register Now
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </Link>
            </div>
        </section>
    )
}
