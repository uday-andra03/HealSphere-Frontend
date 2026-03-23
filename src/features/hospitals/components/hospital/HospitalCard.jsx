import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaMapMarkerAlt,
  FaBed,
  FaUserMd,
  FaEdit,
  FaTrash
} from "react-icons/fa";

export default function HospitalCard({ hospital, isAdmin, onDelete }) {
  const navigate = useNavigate();
  console.log(hospital);
  const initial = hospital?.name?.charAt(0)?.toUpperCase() || "H";

  const specializations =
    Array.isArray(hospital?.specializations)
      ? hospital.specializations
      : hospital?.specialization
        ? [hospital.specialization]
        : [];

  return (
    <div
      className="hospital-card"
      onClick={() => navigate(`/hospital/${hospital.id}`)}
    >
      {/* ===== Gradient Header ===== */}
      <div className="hospital-card-header">
        <div className="hospital-initial">{initial}</div>

        <div className="rating-badge">
          <FaStar className="star" />
          {hospital?.rating ?? 0}
          <span>({hospital?.reviewCount ?? hospital?.reviews ?? 0})</span>
        </div>

        {isAdmin && (
          <div
            className="admin-card-actions"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="admin-edit-btn"
              onClick={() => navigate(`/hospital-profile?id=${hospital.id}`)}
              title="Edit Hospital"
            >
              <FaEdit />
            </button>

            <button
              className="admin-delete-btn"
              onClick={() => onDelete()}
              title="Delete Hospital"
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>

      {/* ===== Content ===== */}
      <div className="hospital-card-body">
        <span className="hospital-id-badge">{hospital?.id}</span>

        <h3 className="hospital-title">{hospital?.name}</h3>

        <p className="location">
          <FaMapMarkerAlt />{" "}
          {hospital?.city || hospital?.location || "N/A"}
        </p>

        <div className="tags">
          {specializations.length > 0 ? (
            <>
              {specializations.slice(0, 3).map((sp, index) => (
                <span key={index}>{sp}</span>
              ))}

              {specializations.length > 3 && (
                <span>+{specializations.length - 3}</span>
              )}
            </>
          ) : (
            <span>General Care</span>
          )}
        </div>

        <div className="card-footer">
          <span>
            <FaUserMd /> {hospital?.doctorCount ?? hospital?.doctor_count ?? hospital?.doctors ?? 0} Doctors
          </span>

          <span>
            <FaBed /> {hospital?.totalBeds ?? hospital?.total_beds ?? hospital?.beds ?? 0} Beds
          </span>
        </div>
      </div>
    </div>
  );
}
