import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from './KeywordList.module.css';

export default function KeywordList() {
  const [keywords, setKeywords] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/keywords")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch keywords");
        return res.json();
      })
      .then(data => setKeywords(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h3>Keywords:</h3>
      <div className={styles.keywordListContainer}>
        {keywords
        .filter(kw => (kw._count?.entries ?? 0) > 0)
        .map(kw => (
          <Link
            key={kw.id}
            to={`/search?keyword=${encodeURIComponent(kw.value)}`}
            className={styles.keywordBadge}
          >
            {kw.value.toLowerCase()}{" "}
            <span className={styles.keywordCount}>({kw._count?.entries ?? 0})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}