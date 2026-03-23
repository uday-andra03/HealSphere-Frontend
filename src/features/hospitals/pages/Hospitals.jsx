import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/common/SearchBar";
import Dropdown from "../components/common/Dropdown";
import HospitalCard from "../components/hospital/HospitalCard";
import { searchDoctors } from "../../../services/doctorApi";
import {
  getHospitalList,
  getAdminHospitals,
  searchHospitals,
  filterHospitals,
  sortHospitals,
  deleteHospital
} from "../../../services/hospitalApi";

export default function Hospitals() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [speciality, setSpeciality] = useState("All Specializations");
  const [sort, setSort] = useState("Top Rated");
  const [backendHospitals, setBackendHospitals] = useState([]);
  const [searchedHospitals, setSearchedHospitals] = useState([]);
  const [filteredBackendHospitals, setFilteredBackendHospitals] = useState([]);
  const [sortedHospitals, setSortedHospitals] = useState([]);
  const [doctorResults, setDoctorResults] = useState([]);

  const [isAdmin, setIsAdmin] = useState(() => {
    return (
      localStorage.getItem("system_admin_mode") === "true" ||
      localStorage.getItem("is_website_admin") === "true"
    );
  });

  useEffect(() => {
    localStorage.setItem("system_admin_mode", isAdmin);
  }, [isAdmin]);

  const [refreshKey, setRefreshKey] = useState(0);


  const formatHospital = (hospital) => ({
    id: hospital.id,
    name: hospital.name,
    location: hospital.city || hospital.location || "N/A",
    rating: hospital.rating ?? 0,
    reviews: hospital.reviewCount ?? hospital.reviews ?? 0,
    doctors:
      hospital.doctorCount ??
      hospital.doctor_count ??
      hospital.doctors ??
      0,
    beds:
      hospital.totalBeds ??
      hospital.total_beds ??
      hospital.beds ??
      0,
    specializations: hospital.specialization
      ? [hospital.specialization]
      : hospital.specializations || [],
    about: hospital.aboutHospital || "",
    phone: hospital.phone || "",
    email: hospital.email || ""
  });

  const loadHospitalList = async () => {
    try {
      const response = await getHospitalList();

      const rawData =
        response?.data?.data?.["Hospital list"] ||
        response?.data?.data ||
        [];

      const apiHospitals = Array.isArray(rawData)
        ? rawData.map(formatHospital)
        : [];

      setBackendHospitals(Array.isArray(apiHospitals) ? apiHospitals : []);

      console.log("Hospital List API:", apiHospitals);
    } catch (error) {
      console.error("Hospital List API Error:", error);
      setBackendHospitals([]);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminHospitals();
    } else {
      loadHospitalList();
    }
  }, [isAdmin]);

  const loadAdminHospitals = async () => {
    try {
      const response = await getAdminHospitals();

      const rawData =
        response?.data?.data?.["Hospital list"] ||
        response?.data?.data ||
        [];

      const apiHospitals = Array.isArray(rawData)
        ? rawData.map(formatHospital)
        : [];
      setBackendHospitals(apiHospitals);

      console.log("Admin Hospital API:", apiHospitals);
    } catch (error) {
      console.error("Admin Hospital API Error:", error);
    }
  };

  // Re-read hospital list whenever backend refresh needed
  useEffect(() => {
    const refresh = () => setRefreshKey((k) => k + 1);

    window.addEventListener("hospitals-updated", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("hospitals-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  // Sync search state with URL parameter
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== search) {
      setSearch(urlSearch);
    }
  }, [searchParams, search]);

  // Backend Search API
  const handleSearchChange = async (value) => {
    setSearch(value);

    if (value) {
      setSearchParams({ search: value });

      try {
        const response = await searchHospitals(value);

        const rawData = response?.data?.data || [];

        const formattedHospitals = Array.isArray(rawData)
          ? rawData.map(formatHospital)
          : [];

        setSearchedHospitals(formattedHospitals);

        // Doctor search integration
        const doctorResponse = await searchDoctors(value);
        const doctors = doctorResponse?.data?.data || [];
        setDoctorResults(doctors);

      } catch (error) {
        console.error("Search API Error:", error);
        setSearchedHospitals([]);
        setDoctorResults([]);
      }

    } else {
      setSearchParams({});
      setSearchedHospitals([]);
      setDoctorResults([]);
    }
  };


  // Backend Filter API
  const handleSpecializationFilter = async (value) => {
    setSpeciality(value);

    if (value === "All Specializations") {
      setFilteredBackendHospitals([]);
      return;
    }

    try {
      const response = await filterHospitals(value);

      const rawData =
        response?.data?.data?.["Filtered Hospitals"] ||
        response?.data?.data ||
        [];

      const formattedHospitals = Array.isArray(rawData)
        ? rawData.map(formatHospital)
        : [];
      setFilteredBackendHospitals(formattedHospitals);

    } catch (error) {
      console.error("Filter API Missing → Frontend Filter Applied:", error);

      const localFiltered = backendHospitals.filter((h) =>
        Array.isArray(h.specializations) &&
        h.specializations.some(
          (spec) =>
            spec.toLowerCase().trim() === value.toLowerCase().trim()
        )
      );

      setFilteredBackendHospitals(localFiltered);
    }
  };

  // Backend Sort API
  const handleSortChange = async (value) => {
    setSort(value);

    let sortParam = "";

    if (value === "Top Rated") sortParam = "rating";
    if (value === "Most Doctors") sortParam = "doctorCount";
    if (value === "Name A-Z") sortParam = "name";

    try {
      const response = await sortHospitals(sortParam);

      const rawData = response?.data?.data || [];

      const formattedHospitals = Array.isArray(rawData)
        ? rawData.map(formatHospital)
        : [];

      setSortedHospitals(formattedHospitals);
    } catch (error) {
      console.error("Sort API Error:", error);
      setSortedHospitals([]);
    }
  };

  /* ================= BACKEND ONLY ================= */

  const allHospitals = useMemo(() => {
    const merged = [
      ...(searchedHospitals.length ? searchedHospitals : []),
      ...(filteredBackendHospitals.length ? filteredBackendHospitals : []),
      ...(sortedHospitals.length ? sortedHospitals : []),
      ...(Array.isArray(backendHospitals) ? backendHospitals : []),
    ];

    return merged.filter(
      (hospital, index, self) =>
        index === self.findIndex((h) => h.id === hospital.id)
    );
  }, [
    refreshKey,
    backendHospitals,
    searchedHospitals,
    filteredBackendHospitals,
    sortedHospitals
  ]);

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete this hospital?")) return;

      await deleteHospital(id);

      // ✅ Remove from UI immediately
      setBackendHospitals(prev => prev.filter(h => h.id !== id));

      // ✅ Trigger refresh (optional but good)
      window.dispatchEvent(new Event("hospitals-updated"));

      alert("Hospital deleted successfully");
    } catch (error) {
      console.error("Delete Hospital Error:", error);
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const filteredHospitals = useMemo(() => {
    let result = [...allHospitals];

    if (search.trim() !== "") {
      result = result.filter((h) =>
        `${h.name} ${h.location || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (speciality !== "All Specializations") {
      result = result.filter(
        (h) =>
          h.specializations &&
          h.specializations.includes(speciality)
      );
    }

    if (sort === "Top Rated") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    if (sort === "Name A-Z") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    if (sort === "Most Doctors") {
      result.sort((a, b) => (b.doctors || 0) - (a.doctors || 0));
    }

    return result;
  }, [search, speciality, sort, allHospitals]);

  const showAdminToggle =
    !!localStorage.getItem("current_hospital_id") ||
    localStorage.getItem("is_website_admin") === "true";

  useEffect(() => {
    if (!showAdminToggle) {
      setIsAdmin(false);
      localStorage.removeItem("system_admin_mode");
    }
  }, [showAdminToggle]);

  return (
    <div className="hospital-page">
      <div className="hospital-header-section">
        <h1>Browse Hospitals</h1>
        <p className="subtitle">
          Find the best healthcare facilities near you
        </p>

        {showAdminToggle && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              style={{
                padding: "6px 12px",
                fontSize: "0.8rem",
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                background: isAdmin ? "#fef2f2" : "#f8fafc",
                color: isAdmin ? "#ef4444" : "#64748b",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {isAdmin ? "🔴 Admin Mode: ON" : "⚪ Admin Access"}
            </button>
          </div>
        )}

        <div className="filter-row">
          <div className="search-grow">
            <SearchBar value={search} onChange={handleSearchChange} />
          </div>

          <Dropdown
            label={speciality}
            options={[
              "All Specializations",
              "Cardiology",
              "Neurology",
              "Orthopedics",
              "Dermatology",
              "Oncology",
              "Pediatrics",
              "Gynecology",
              "Psychiatry",
              "ENT",
              "Gastroenterology",
              "General Surgery",
              "Ophthalmology",
              "Pulmonology",
              "Urology",
              "Nephrology",
            ]}
            onSelect={handleSpecializationFilter}
          />

          <Dropdown
            label={sort}
            options={["Top Rated", "Name A-Z", "Most Doctors"]}
            onSelect={handleSortChange}
          />
        </div>

        <p className="hospital-count">
          {filteredHospitals.length} hospitals found
        </p>
      </div>

      <div className="grid">
        {filteredHospitals.map((h) => (
          <HospitalCard
            key={`${h.id}-${h.name}`}
            hospital={h}
            isAdmin={isAdmin}
            onDelete={() => handleDelete(h.id)}
          />
        ))}
      </div>
      {doctorResults.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h2>Doctors Found</h2>

          <div className="grid">
            {doctorResults.map((doctor, index) => (
              <div key={index} className="doctor-card">
                <p>{doctor.name}</p>
                <p>{doctor.specialization}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}