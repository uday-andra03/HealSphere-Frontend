import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaPaperPlane } from 'react-icons/fa';
import '../../styles/hospitalReviews.css';
import { addReviewApi } from "../../../../services/patientApi";
import { getHospitalReviews } from "../../../../services/hospitalApi";
export default function HospitalReviews({ hospitalId }) {

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [userName, setUserName] = useState('');

    // Fetch reviews from backend
    useEffect(() => {
        if (hospitalId) {
            fetchReviews();
        }
    }, [hospitalId]);

    const fetchReviews = async () => {
        try {
            const response = await getHospitalReviews(hospitalId);
            console.log("RAW API:", response.data);
            const apiReviews =
                response?.data?.data?.Reviews ||
                response?.data?.data?.reviews ||
                response?.data?.data ||
                response?.data ||
                [];

            const formattedReviews = (Array.isArray(apiReviews) ? apiReviews : []).map((r) => ({
                id: r.id,
                user: r.patientName || "User",
                comment: r.comment || "",
                rating: r.rating || 0,
                date: r.createdTime || ""
            }));
            console.log("RAW API:", response.data);
            setReviews(formattedReviews);

            console.log("Hospital Reviews API:", formattedReviews);

        } catch (error) {
            console.error("Error loading reviews:", error);
            setReviews([]);
        }
    };


    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .filter(n => n.length > 0)
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getAvatarColor = (name) => {

        const colors = [
            '#2563eb',
            '#0d9488',
            '#7c3aed',
            '#db2777',
            '#ea580c',
            '#16a34a',
            '#4f46e5',
            '#ca8a04'
        ];

        let hash = 0;

        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        return colors[Math.abs(hash) % colors.length];
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const patientId = localStorage.getItem("current_patient_id");

        console.log("Patient ID:", patientId);

        if (!patientId) {
            alert("Please login first");
            return;
        }

        if (!comment.trim() || !userName.trim()) return;

        try {
            const payload = {
                comment: comment.trim(),
                rating: rating
            };

            console.log("Sending review:", payload);

            // ✅ SAVE TO DATABASE
            await addReviewApi(patientId, hospitalId, payload);

            // ✅ KEEP YOUR EXISTING UI LOGIC
            const newReview = {
                id: Date.now(),
                user: userName,
                rating: rating,
                comment: comment.trim(),
                date: new Date().toLocaleDateString()
            };

            await fetchReviews();

            setComment('');
            setUserName('');
            setRating(5);

            alert('Review submitted successfully!');

        } catch (error) {
            console.error("Review Save Error:", error.response?.data || error);
            alert(error.response?.data?.message || "Failed to submit review");
        }
    };

    return (

        <div className="reviews-section">

            <h2 className="section-title">Patient Experiences</h2>
            <p className="section-subtitle">
                Real feedback from visitors and patients
            </p>

            <div className="reviews-container">

                <div className="reviews-form-card">

                    <div className="form-header">
                        <h3>Share Your Experience</h3>
                        <p>Your feedback helps others make informed decisions.</p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="review-form-group">
                            <label>Full Name</label>

                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="e.g. John Doe"
                                required
                            />
                        </div>

                        <div className="rating-selector-wrapper">

                            <label>Service Quality</label>

                            <div className="stars-row">

                                {[1, 2, 3, 4, 5].map((star) => (

                                    <span
                                        key={star}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                        className="star-clickable"
                                    >

                                        {(hoverRating || rating) >= star
                                            ? <FaStar className="star-filled" />
                                            : <FaRegStar className="star-empty" />}

                                    </span>
                                ))}

                                <span className="rating-number">{rating}.0</span>

                            </div>

                        </div>

                        <div className="review-form-group">

                            <label>Tell us more</label>

                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Describe your visit, the staff, or the facilities..."
                                rows="4"
                                required
                            ></textarea>

                        </div>

                        <button type="submit" className="submit-review-action">

                            <FaPaperPlane /> Post Review

                        </button>

                    </form>

                </div>


                <div className="reviews-feed">

                    {(Array.isArray(reviews) ? reviews : []).length === 0 ? (

                        <div className="empty-reviews-state">
                            <p>No testimonials yet. Be the first to share your journey with us.</p>
                        </div>

                    ) : (

                        (Array.isArray(reviews) ? reviews : []).map((rev, index) => (

                            <div key={rev.id || index} className="professional-review-card">

                                <div className="prof-review-header">

                                    <div className="prof-user-meta">

                                        <div
                                            className="initial-avatar"
                                            style={{ backgroundColor: getAvatarColor(rev.user || "User") }}
                                        >

                                            {getInitials(rev.user || "User")}

                                        </div>

                                        <div className="prof-user-details">

                                            <div className="prof-user-name">{rev.user}</div>
                                            <div className="prof-review-date">{rev.date}</div>

                                        </div>

                                    </div>

                                    <div className="prof-rating-display">

                                        <div className="prof-stars">

                                            {[...Array(5)].map((_, i) => (
                                                i < rev.rating
                                                    ? <FaStar key={i} className="star-filled" />
                                                    : <FaRegStar key={i} className="star-empty" />
                                            ))}

                                        </div>

                                        <span className="prof-rating-value">
                                            {rev.rating?.toFixed ? rev.rating.toFixed(1) : rev.rating}
                                        </span>

                                    </div>

                                </div>

                                <div className="prof-review-content">

                                    <p>{rev.comment}</p>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </div>

    );
}

