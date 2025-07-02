import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Naviger til ei søkeside, eller vis resultat direkte i navbar om du ønskjer det
      navigate(`/search?keyword=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className={styles.header}>
      
        <h1 className={styles.headerLogo}>The Chronicles of the Jedi Mind</h1>
      <div>
        <nav className={styles.navbar}>
          <div className={styles.navbarLinks}>
            <Link to="/" className={styles.link}>
              Home
            </Link>
            <Link to="/add" className={styles.link}>
              Add Entry
            </Link>
          </div>
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Søk etter keyword"
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Søk
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
