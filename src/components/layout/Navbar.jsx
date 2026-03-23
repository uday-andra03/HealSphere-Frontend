import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import './Navbar.css'


export default function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const dropdownRef = useRef(null)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    // Auth status (simulated)
    const [isHospitalLoggedIn, setIsHospitalLoggedIn] = useState(!!localStorage.getItem('current_hospital_id'))
    const [isWebsiteAdmin, setIsWebsiteAdmin] = useState(localStorage.getItem('is_website_admin') === 'true')
    const [isPatientLoggedIn, setIsPatientLoggedIn] = useState(localStorage.getItem('is_patient_logged_in') === 'true')

    // Sync auth status on location changes
    useEffect(() => {
        setIsHospitalLoggedIn(!!localStorage.getItem('current_hospital_id'))
        setIsWebsiteAdmin(localStorage.getItem('is_website_admin') === 'true')
        setIsPatientLoggedIn(localStorage.getItem('is_patient_logged_in') === 'true')
    }, [location])

    const isLoggedIn = isHospitalLoggedIn || isWebsiteAdmin || isPatientLoggedIn

    const allNavLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Hospitals', path: '/hospitals' },
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Help', path: '/help' }
    ]

    const navLinks = isLoggedIn
        ? allNavLinks
        : allNavLinks.filter(link => ['Home', 'About', 'Help'].includes(link.name))

    const isActive = (path) => location.pathname === path
    const isAccountActive = ['/patient-auth', '/hospital-auth'].includes(location.pathname)

    const handleSignOut = () => {
        localStorage.removeItem('current_hospital_id')
        localStorage.removeItem('is_website_admin')
        localStorage.removeItem('system_admin_mode')
        localStorage.removeItem('is_patient_logged_in')
        localStorage.removeItem('current_patient_email')
        setDropdownOpen(false)
        navigate('/')
        alert('You have been signed out.')
    }

    return (
        <nav className="navbar">
            <div className="navbar__left">
                {location.pathname !== '/' && (
                    <button
                        className="navbar__back-btn"
                        onClick={() => navigate(-1)}
                        title="Go Back"
                    >
                        <FaArrowLeft />
                    </button>
                )}
                <div className="navbar__brand">
                    <Link to="/" className="navbar__brand-link">
                        <div className="navbar__logo">
                            <img src="/logo.png" alt="HealSphere Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <span className="navbar__name">
                            <span className="navbar__med">Heal</span><span className="navbar__hub">Sphere</span>
                        </span>
                    </Link>
                </div>
            </div>

            <ul className="navbar__links">
                {navLinks.map(link => (
                    <li key={link.name}>
                        <Link
                            to={link.path}
                            className={`navbar__link${isActive(link.path) ? ' navbar__link--active' : ''}`}
                        >
                            {link.name}
                        </Link>
                    </li>
                ))}

                {/* Account dropdown */}
                <li className="navbar__dropdown-container" ref={dropdownRef}>
                    <button
                        className={`navbar__link navbar__account-btn${isAccountActive ? ' navbar__link--active' : ''}`}
                        onClick={() => setDropdownOpen(prev => !prev)}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Account
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px', transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>

                    {dropdownOpen && (
                        <div className="navbar__dropdown">
                            {isLoggedIn ? (
                                <>
                                    {isPatientLoggedIn && (
                                        <Link to="/patient-profile" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                            Edit Profile
                                        </Link>
                                    )}
                                    {isHospitalLoggedIn && (
                                        <Link to="/hospital-profile" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                                <polyline points="9 22 9 12 15 12 15 22" />
                                            </svg>
                                            Hospital Details
                                        </Link>
                                    )}
                                    <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleSignOut}>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                                        </svg>
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="navbar__dropdown-label">Sign in as</div>
                                    <Link to="/patient-auth?mode=signin" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        Patient Login
                                    </Link>
                                    <Link to="/hospital-auth" className="navbar__dropdown-item" onClick={() => setDropdownOpen(false)}>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                            <polyline points="9 22 9 12 15 12 15 22" />
                                        </svg>
                                        Hospital Login
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </li>
            </ul>
        </nav>
    )
}
