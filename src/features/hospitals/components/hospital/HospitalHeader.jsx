import { FaStar, FaMapMarkerAlt, FaCalendarAlt, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function HospitalHeader({ hospital, isOwner, isSystemAdmin }) {
  const editLink = isSystemAdmin ? `/hospital-profile?id=${hospital.id}` : "/hospital-profile";

  return (
    <div className="hospital-header">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
        <div>
          <h1 style={{ textTransform: 'capitalize' }}>{hospital.name}</h1>

          <p className="header-sub">
            <FaMapMarkerAlt /> {hospital.location}
            <span className="dot" />
            <FaCalendarAlt /> Est. {hospital.established}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          {(isOwner || isSystemAdmin) && (
            <Link
              to={editLink}
              className="submit-btn"
              style={{
                width: 'auto',
                padding: '8px 20px',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#0d9488', // Matching theme
                margin: 0
              }}
            >
              <FaEdit /> Manage Profile
            </Link>
          )}

          <div className="rating-box">
            <FaStar className="star" />
            <span className="rating">
              {hospital.rating || '0'}
              <small> / 5.0 ({hospital.reviews || '0'} reviews)</small>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}