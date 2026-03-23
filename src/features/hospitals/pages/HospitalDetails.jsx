import { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import {
  getHospitalById,
  getWeeklyActivity,
  getHospitalStats
} from "../../../services/hospitalApi";

import { getDoctorsByHospitalId } from "../../../services/doctorApi";

import HospitalHeader from "../components/hospital/HospitalHeader";
import StatCard from "../components/common/StatCard";
import WeeklyChart from "../components/hospital/WeeklyChart";
import DoctorCard from "../components/hospital/DoctorCard";
import HospitalReviews from "../components/hospital/HospitalReviews";

import {
  FaBed,
  FaUserMd,
  FaUsers,
  FaHeartbeat,
  FaChevronDown,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";

export default function HospitalDetails() {
  const { id } = useParams();

  const [isDoctorsExpanded, setIsDoctorsExpanded] = useState(false);
  const [hospitalStats, setHospitalStats] = useState({});
  const [doctorSearchTerm, setDoctorSearchTerm] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("All");
  const [filterAvailability, setFilterAvailability] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const [hospitalFromBackend, setHospitalFromBackend] = useState(null);
  const [hospitalDoctors, setHospitalDoctors] = useState([]);

  useEffect(() => {
    loadHospitalDetails();
    loadHospitalDoctors();
  }, [id]);

  const loadHospitalDetails = async () => {
    if (isNaN(id)) return;

    try {
      const response = await getHospitalById(id);

      const h = response?.data?.data || response?.data || {};

      if (Object.keys(h).length) {
        setHospitalFromBackend({
          id: h.id,
          name: h.name,
          location:
            h.location ||
            `${h.city || ""}, ${h.state || ""}, ${h.country || ""}`,
          beds: h.totalBeds || h.beds || 0,
          rating: h.rating || 0,
          specializations: h.specializations || [],
          about: h.aboutHospital || h.about || "",
          contact: {
            phone: h.phone || "",
            email: h.email || "",
          },
          doctorsCount: h.doctorCount || 0,
          patients: h.patients || 0,
        });
      }
    } catch (error) {
      console.error("Hospital Details API Error:", error);
    }
  };

  const loadHospitalDoctors = async () => {
    try {
      const response = await getDoctorsByHospitalId(id);

      console.log("Doctors API:", response.data);

      const doctors = response?.data?.data || [];

      setHospitalDoctors(doctors);
    } catch (error) {
      console.error("Doctors API Error:", error);
      setHospitalDoctors([]);
    }
  };

  const hospital = hospitalFromBackend;

  const currentHospitalId = localStorage.getItem("current_hospital_id");

  const isOwner =
    currentHospitalId &&
    hospital &&
    currentHospitalId === hospital?.id?.toString();

  const staffCount =
    hospitalDoctors.length > 0
      ? hospitalDoctors.length
      : hospital?.doctorsCount || 0;

  const baseDoctors = useMemo(() => {
    return hospitalDoctors.map((dr) => ({
      id: dr.id,
      name: dr.name,
      specialization:
        dr.specialization?.name ||
        dr.specialization ||
        "General Medicine",
      exp: dr.experienceYears || 5,
      rating: 4.5,
      available: dr.available ?? true,
      initials: dr.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      bio:
        dr.description ||
        `${dr.name} is a dedicated medical professional.`,
    }));
  }, [hospitalDoctors]);

  const specializations = useMemo(() => {
    const specs = baseDoctors.map((d) => d.specialization);
    return ["All", ...new Set(specs)];
  }, [baseDoctors]);

  const filteredDoctors = useMemo(() => {
    return baseDoctors.filter((doc) => {
      const matchesSearch = doc.name
        .toLowerCase()
        .includes(doctorSearchTerm.toLowerCase());

      const matchesSpec =
        filterSpecialization === "All" ||
        doc.specialization === filterSpecialization;

      const matchesAvail = !filterAvailability || doc.available;

      return matchesSearch && matchesSpec && matchesAvail;
    });
  }, [baseDoctors, doctorSearchTerm, filterSpecialization, filterAvailability]);

  useEffect(() => {
    loadWeeklyActivity();
  }, [id]);

  const loadWeeklyActivity = async () => {
    if (isNaN(id)) {
      setWeeklyActivity([]);
      return;
    }

    try {
      const response = await getWeeklyActivity(id);

      const apiData =
        (response?.data?.data?.["Weekly activity"] || response?.data?.data || []).map(
          (item) => ({
            day: item.day || item.date || item.Day || "N/A",
            admissions: item.admissions ?? item.Admissions ?? 0,
            discharges: item.discharges ?? item.Discharges ?? 0,
            surgeries: item.surgeries ?? item.Surgeries ?? 0,
          })
        );

      setWeeklyActivity(apiData);
    } catch (error) {
      console.error("Weekly Activity API Error:", error);
      setWeeklyActivity([]);
    }
  };

  useEffect(() => {
    loadHospitalStats();
  }, [id]);

  const loadHospitalStats = async () => {
    if (isNaN(id)) {
      setHospitalStats({});
      return;
    }

    try {
      const response = await getHospitalStats(id);
      const stats = response?.data?.data || {};
      setHospitalStats(stats);
    } catch (error) {
      console.error("Hospital Stats API Error:", error);
      setHospitalStats({});
    }
  };

  if (!hospital) {
    return (
      <div
        className="details-container"
        style={{ textAlign: "center", padding: "100px 20px" }}
      >
        <h2>Hospital Not Found</h2>
      </div>
    );
  }

  return (
    <div className="details-container">
      <HospitalHeader hospital={hospital} isOwner={isOwner} />

      <div className="stats-grid">
        <StatCard icon={<FaBed />} value={hospitalStats.totalBeds || hospital.beds || 0} label="Total Beds" />
        <StatCard icon={<FaUserMd />} value={hospitalStats.totalDoctors || staffCount} label="Doctors" />
        <StatCard icon={<FaUsers />} value={hospitalStats.totalPatients || hospital.patients || 0} label="Patients Served" />
        <StatCard icon={<FaHeartbeat />} value={hospitalStats.totalSpecializations || (hospital.specializations || []).length} label="Specializations" />
      </div>

      <div className="info-grid">
        <div className="about-card">
          <h2>About</h2>
          <p>{hospital.about || "No description available."}</p>

          <div className="tags">
            {(hospital.specializations || []).map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>

        <div className="contact-card">
          <h2>Contact</h2>
          <p>{hospital.contact?.phone || "N/A"}</p>
          <p>{hospital.contact?.email || "N/A"}</p>
          <p>{hospital.location || "Bangalore"}</p>
        </div>
      </div>

      <WeeklyChart data={weeklyActivity} />

      <div className="collapsible-doctors">
        <div
          className={`doctors-toggle-header ${isDoctorsExpanded ? "active" : ""}`}
          onClick={() => setIsDoctorsExpanded(!isDoctorsExpanded)}
        >
          <div className="toggle-title-group">
            <FaUserMd className="title-icon" />
            <h2 className="section-title" style={{ margin: 0 }}>
              Our Doctors
            </h2>
            <span className="doctor-count-badge">{baseDoctors.length}</span>
          </div>
          <FaChevronDown className={`chevron-icon ${isDoctorsExpanded ? "rotate" : ""}`} />
        </div>

        <div className={`doctors-expandable-content ${isDoctorsExpanded ? "show" : ""}`}>
          {selectedDoctor ? (
            <div className="doctor-profile-view">
              <button className="back-to-list-btn" onClick={() => setSelectedDoctor(null)}>
                <FaArrowLeft /> Back to Staff List
              </button>

              <div className="profile-container">
                <div className="profile-main">
                  <div className="profile-avatar-large">{selectedDoctor.initials}</div>
                  <div className="profile-info">
                    <h1>{selectedDoctor.name}</h1>
                    <p className="profile-spec">{selectedDoctor.specialization}</p>
                  </div>
                </div>

                <div className="profile-details">
                  <h3>Biography</h3>
                  <p>{selectedDoctor.bio}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="doctor-filter-bar">
                <div className="search-box-wrapper">
                  <FaSearch className="search-icon-inline" />
                  <input
                    type="text"
                    placeholder="Search doctor by name..."
                    value={doctorSearchTerm}
                    onChange={(e) => setDoctorSearchTerm(e.target.value)}
                    className="doctor-search-input"
                  />
                </div>

                <div className="filter-controls">
                  <div className="filter-select-group">
                    <FaFilter className="filter-icon-inline" />
                    <select
                      value={filterSpecialization}
                      onChange={(e) => setFilterSpecialization(e.target.value)}
                      className="spec-select"
                    >
                      {specializations.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label className="avail-toggle-label">
                    <input
                      type="checkbox"
                      checked={filterAvailability}
                      onChange={(e) => setFilterAvailability(e.target.checked)}
                    />
                    <FaCheckCircle className={filterAvailability ? "active" : ""} />
                    Available Only
                  </label>
                </div>
              </div>

              <div className="doctor-grid" style={{ marginTop: "20px" }}>
                {filteredDoctors.map((doc, i) => (
                  <div key={doc.id || i} onClick={() => setSelectedDoctor(doc)} style={{ cursor: "pointer" }}>
                    <DoctorCard doctor={doc} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <HospitalReviews hospitalId={id} />
    </div>
  );
}