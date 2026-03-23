export default function SearchBar({ value, onChange }) {
  return (
    <input
      className="search-input"
      placeholder="Search hospitals..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}