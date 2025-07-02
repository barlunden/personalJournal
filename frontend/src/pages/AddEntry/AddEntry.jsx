import { useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from './AddEntry.module.css';

export default function AddEntry() {
  const today = new Date().toISOString().slice(0, 10);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    dateCreated: today,
    imageUrl: "",
    imageAlt: "",
    keywords: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitEntry = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    const keywordsArray = formData.keywords
      ? formData.keywords.split(",").map(k => k.trim().toLowerCase()).filter(Boolean)
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

    try {
      const response = await fetch("/api/add-entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("Failed to add entry");
      setSuccess("Entry added!");
      setFormData({
        title: "",
        content: "",
        dateCreated: today,
        imageUrl: "",
        imageAlt: "",
        keywords: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "2rem" }}>
      <form className={styles["add-entry-form"]} onSubmit={submitEntry} style={{ flex: 1 }}>
        <h2>Add New Entry</h2>
        <label>
          Title:
          <input
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            required
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
        <div style={{marginTop: "1em"}}>
          <strong>Preview:</strong>
          <div style={{background: "#232733", padding: "0.1em", borderRadius: "0.7em"}}>
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
          />
        </label>
        <label>
          Image Description:
          <input
            name="imageAlt"
            value={formData.imageAlt}
            onChange={handleFormChange}
          />
        </label>
        <label>
          Keywords (comma separated):
          <input
            name="keywords"
            value={formData.keywords}
            onChange={handleFormChange}
          />
        </label>
        <button type="submit">Add Entry</button>
        {success && <p style={{ color: "green" }}>{success}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <aside className={styles["aside-style"]}>
        <strong>Markdown tips</strong>
        <ul style={{ margin: "0.2em 0 0 0.2em", padding: 0, listStyle: "none" }}>
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
        <div style={{marginTop: "1em"}}>
          <strong>Preview:</strong>
          <div style={{background: "#232733", padding: "1em", borderRadius: "0.7em"}}>
            <ReactMarkdown>{formData.content}</ReactMarkdown>
          </div>
        </div>
      </aside>
    </div>
  );
}
