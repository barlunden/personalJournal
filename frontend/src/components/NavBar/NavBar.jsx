import { NavLink, useNavigate } from "react-router-dom";
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
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/add"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              Add Entry
            </NavLink>
            <NavLink
              to="/read"
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              Entries
            </NavLink>
          </div>
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for keyword or title"
              className={styles.searchInput}
            />
            <button type="submit" className={styles.link}>
              Search
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
