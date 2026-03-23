import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NewHero.css";
// Image is served from the public folder as /download

const NewHomePage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/hospitals?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate("/hospitals");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="new-hero" style={{ backgroundImage: `url(/download)` }}>
            <div className="new-overlay">
                <div className="new-hero-content">

                    <div className="new-badge">♡ Trusted by 50,000+ patients</div>

                    <h1 className="text-hero" style={{ color: 'white' }}>
                        Your Health, <span className="new-gradient">Our</span>
                        <br />
                        <span className="new-gradient2">Priority</span>
                    </h1>

                    <p className="text-section-sub" style={{ color: 'rgba(255, 255, 255, 0.9)', textAlign: 'left', margin: '15px 0' }}>
                        Discover top-rated hospitals, connect with specialists, and track
                        healthcare excellence — all in one platform.
                    </p>

                    <div className="new-search-bar">
                        <span className="new-search-icon">🔍</span>
                        <input
                            placeholder="Search hospitals, specializations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button className="btn-primary" style={{ padding: '12px 24px' }} onClick={handleSearch}>Search</button>
                    </div>

                    <div className="new-hero-info">
                        <span>🕒 24/7 Support</span>
                        <span>⭐ 4.8 Average Rating</span>
                    </div>

                    {/* <div className="new-registration-cta" style={{ marginTop: '2rem' }}>
                        <Link to="/doctor-registration" className="new-reg-btn">
                            Register as a Doctor
                        </Link>
                    </div> */}

                </div>
            </div>
        </div>
    );
};

export default NewHomePage;

