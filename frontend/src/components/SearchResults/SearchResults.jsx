import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keyword.trim()) {
      setError("Please enter a keyword to search.");
      setResults([]);
      return;
    }
    setError("");
    setLoading(true);
    fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`)
      .then(res => {
        if (!res.ok) throw new Error("Search failed");
        return res.json();
      })
      .then(setResults)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [keyword]);

  return (
    <div>
      <h2>Søkeresultat for: <em>{keyword}</em></h2>
      {loading && <p>Laster...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {results.length === 0 && !loading && !error && <p>Ingen treff.</p>}
      <ul>
        {results.map(entry => (
          <li key={entry.id}>
            <Link to={`/entry/${entry.id}`}>{entry.title}</Link>
            {entry.keywords && entry.keywords.length > 0 && (
              <span> – {entry.keywords.map(k => k.value).join(", ")}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}