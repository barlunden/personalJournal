import { useState } from "react";

export default function KeywordSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setResults([]);
    try {
      const res = await fetch(`/api/search?keyword=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Søk etter keyword"
        />
        <button type="submit">Søk</button>
      </form>
      {error && <p style={{color: "red"}}>{error}</p>}
      <ul>
        {results.map(entry => (
          <li key={entry.id}>
            <strong>{entry.title}</strong> – {entry.keywords.map(k => k.value).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}