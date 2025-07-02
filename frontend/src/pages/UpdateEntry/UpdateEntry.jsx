import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import styles from '../AddEntry/AddEntry.module.css'; // Shares styling with the AddEntry-component

export default function UpdateEntry() {
  const { entryId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    dateCreated: "",
    imageUrl: "",
    imageAlt: "",
    keywords: "",
  });
  const [error, setError] = useState(null);

  // Hent eksisterande data
  useEffect(() => {
    fetch(`/api/get-entry/${entryId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Your entry not found was.");
        return res.json();
      })
      .then((data) => {
        setFormData({
          title: data.title || "",
          content: data.content || "",
          dateCreated: data.dateCreated ? data.dateCreated.slice(0, 10) : "",
          imageUrl: data.imageUrl || "",
          imageAlt: data.imageAlt || "",
          keywords: data.keywords
            ? data.keywords.map((k) => k.value).join(", ")
            : "",
        });
      })
      .catch((err) => setError(err.message));
  }, [entryId]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const keywordsArray = formData.keywords
      ? formData.keywords
          .split(",")
          .map((k) => k.trim().toLowerCase())
          .filter(Boolean)
      : [];

    const body = {
      ...formData,
      dateCreated: formData.dateCreated
        ? new Date(formData.dateCreated).toISOString()
        : undefined,
      imageUrl: formData.imageUrl ? formData.imageUrl : undefined,
      imageAlt: formData.imageAlt ? formData.imageAlt : undefined,
      keywords: keywordsArray,
    };

    const response = await fetch(
      `http://localhost:4000/update-entry/${entryId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      navigate(`/entry/${entryId}`);
    } else {
      setError("Update your entry we couldn't");
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "2rem" }}>
      <form className={styles["add-entry-form"]} onSubmit={handleSubmit} style={{ flex: 1 }}>
        <h1>Update entry</h1>
        <label>
          Title:
          <input
            name="title"
            type="text"
            value={formData.title}
            onChange={handleFormChange}
            placeholder="Title"
          />
        </label>
        <label>
          Content (Markdown supported):
          <textarea
            name="content"
            value={formData.content}
            onChange={handleFormChange}
            rows={8}
            required
          />
        </label>
        <div style={{ marginTop: "1em" }}>
          <strong>Preview:</strong>
          <div style={{ background: "#232733", padding: "1em", borderRadius: "0.7em" }}>
            <ReactMarkdown>{formData.content}</ReactMarkdown>
          </div>
        </div>
        <label>
          Date:
          <input
            name="dateCreated"
            type="date"
            value={formData.dateCreated}
            onChange={handleFormChange}
          />
        </label>
        <label>
          Image URL:
          <input
            name="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={handleFormChange}
            placeholder="https://picsum.photos"
          />
        </label>
        <label>
          Image description:
          <input
            name="imageAlt"
            value={formData.imageAlt}
            onChange={handleFormChange}
            type="text"
            placeholder="Lightsaber practice with master Luke."
          />
        </label>
        <label>
          Keywords (comma separated):
          <br />
          <input
            name="keywords"
            value={formData.keywords}
            onChange={handleFormChange}
            placeholder="X-wing, Kessel-run"
            type="text"
          />
        </label>
        <button type="submit">Update Entry</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <aside className={styles["aside-style"]}>
        <strong>Markdown tips</strong>
        <ul style={{ margin: "0.7em 0 0 0.7em", padding: 0, listStyle: "disc" }}>
          <li>
            <code>**bold**</code> → <b>bold</b>
          </li>
          <li>
            <code>*italic*</code> → <i>italic</i>
          </li>
          <li>
            <code># Heading 1</code>, <code>## Heading 2</code>
          </li>
          <li>
            <code>- List item</code> or <code>* List item</code>
          </li>
          <li>
            <code>[Link text](https://example.com)</code>
          </li>
        </ul>
      </aside>
    </div>
  );
}
