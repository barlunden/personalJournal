import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import styles from "./JournalEntry.module.css";

export default function JournalEntry() {
  const { entryId } = useParams();
  const [entry, setEntry] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Always use entryId for template literals

  const deleteEntry = async () => {
    await fetch(`/api/delete-entry/${entryId}`, {
      method: "delete",
    }).then(async (data) => {
      const response = await data.json();

      if (response.success) {
        navigate("/");
      }
    });
  };

  useEffect(() => {
    // Validating ID
    console.log("entryId from useparams:", entryId);
    if (!entryId || !/^\d+$/.test(entryId)) {
      setError("Not a valid ID");
      setEntry(null);
      return;
    }

    // Getting data from backend
    const idNum = parseInt(entryId, 10);
    fetch(`/api/get-entry/${idNum}`)
      .then((res) => {
        if (!res.ok) throw new Error("Entry not found");
        return res.json();
      })
      .then((data) => {
        setEntry(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setEntry(null);
      });
  }, [entryId]);

  if (error) return <p>Error: {error}</p>;
  if (!entry) return <p>Loading...</p>;

  const formattedDate = format(
    new Date(entry.dateCreated),
    "d. MMMM yyyy 'kl.' HH:mm",
    { locale: nb }
  );

  return (
    <section>
      <h1>{entry.title}</h1>
      <p>{formattedDate}</p>
      <ReactMarkdown>{entry.content}</ReactMarkdown>
      {entry.imageUrl && (
        <img src={entry.imageUrl} alt={entry.imageAlt || "Image"} />
      )}
      {entry.keywords && entry.keywords.length > 0 ? (
        <div>
          {entry.keywords.map((kw, idx) => (
            <span key={kw.id ?? idx}>{kw.value ?? kw}</span>
          ))}
        </div>
      ) : (
        <p>No keywords</p>
      )}
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={deleteEntry}>
          Delete entry
        </button>
        <button className={styles.button}>
          <Link to={`/update-entry/${entryId}`}>Update entry</Link>
        </button>
      </div>
      {/* vis meir info her */}
    </section>
  );
}
