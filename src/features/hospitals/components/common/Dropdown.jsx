import { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function Dropdown({ label, options, onSelect }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="dropdown-wrapper" ref={dropdownRef}>
      <button
        className={`dropdown-btn ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
      >
        {label}
        <FaChevronDown className={`arrow ${open ? "rotate" : ""}`} />
      </button>

      <div className={`dropdown-menu ${open ? "show" : ""}`}>
        {options.map((opt) => (
          <div
            key={opt}
            className="dropdown-item"
            onClick={() => {
              onSelect(opt);
              setOpen(false);
            }}
          >
            {opt}
          </div>
        ))}
      </div>
    </div>
  );
}