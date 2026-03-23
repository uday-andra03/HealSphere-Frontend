import { FaStar } from "react-icons/fa";
import { getDoctorById } from "../../../../services/doctorApi";
import { useEffect, useState } from "react";

export default function DoctorCard({ doctor }) {
  const [doctorDetails, setDoctorDetails] = useState(null);

  useEffect(() => {
    if (doctor?.id) {
      loadDoctorDetails();
    }
  }, [doctor]);

  const loadDoctorDetails = async () => {
    try {
      const response = await getDoctorById(doctor.id);
      setDoctorDetails(response?.data?.data || null);
    } catch (error) {
      console.error("Doctor Detail API Error:", error);
    }
  };

  const specialization =
    doctorDetails?.specialization?.name ||
    doctorDetails?.specialization ||
    doctor.specialization ||
    "General Medicine";

  return (
    <div className="doctor-card">
      <div className="avatar">{doctor.initials}</div>

      <div>
        <h3>{doctorDetails?.name || doctor.name}</h3>

        <p>
          {specialization} · {doctor.exp} yrs
        </p>

        <div className="doctor-meta">
          <FaStar className="star-small" />
          {doctor.rating}
          <span className="available">
            {doctor.available ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>
    </div>
  );
}