import React from "react";
import styles from "./Home.module.css";
import ShowEntries from "../../components/ShowEntries/showEntries";
import KeywordList from "../../components/KeywordList/KeywordList";
import ReactMarkdown from "react-markdown";
import bio from '../../assets/jedi.md?raw'

export default function Home() {
  return (
    <section className={styles.section}>
      <div className={styles.heroRow}>
        <div className={styles.heroText}>
          <ReactMarkdown>{bio}</ReactMarkdown>
        </div>
        <img
          src="https://pm1.aminoapps.com/6944/5facc391e1fd7025e5bbef12966e162d2c76224cr1-615-1125v2_hq.jpg"
          alt="Yoda"
          className={styles.yodaImage}
        />
      </div>
      <ShowEntries />
      <KeywordList />
    </section>
  );
}
