import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./ShowEntries.module.css";
import ReactMarkdown from "react-markdown";

function ShowEntries({ limit, grid = false }) {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch("/api/get-entries");
        if (!res.ok) throw new Error("Network error: " + res.status);
        const data = await res.json();
        setEntries(Array.isArray(data) ? data : data.entries || []);
      } catch (err) {
        setError("Could not fetch entries: " + err.message);
      }
    }
    fetchEntries();
  }, []);

  if (error) return <div>{error}</div>;
  if (!entries.length) return <div>Loading...</div>;

  const entriesToShow = limit ? entries.slice(0, limit) : entries

  return (
    <section className={grid ? "grid-auto-fill" : "single-column"}>
      {entriesToShow.map((entry) => (
        <div className={styles.oppslag}>
          <h2>{entry.title}</h2>
          <p>{new Date(entry.dateCreated).toLocaleDateString("en-GB")}</p>
          <div style={{ margin: "0.4em 0" }}>
            {entry.keywords && entry.keywords.length > 0 && (
              <span>
                {entry.keywords.map((kw) => (
                  <span
                    key={kw.id}
                  >
                    {kw.value.toLowerCase()}
                  </span>
                ))}
              </span>
            )}
          </div>
          <ReactMarkdown>
            {entry.content.length > 200
              ? entry.content.slice(0, 200) + "... "
              : entry.content}
          </ReactMarkdown>
          <Link to={`/entry/${entry.id}`}>Read more</Link>
        </div>
      ))}
    </section>
  );
}

export default ShowEntries;
