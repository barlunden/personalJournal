import React from "react";
import styles from "./Home.module.css";
import ShowEntries from "../../components/ShowEntries/showEntries";
import KeywordList from "../../components/KeywordList/KeywordList";
import ReactMarkdown from "react-markdown";
import bio from '../../assets/jedi.md?raw'

export default function Home() {
  return (
    <section className={styles.section}>
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        
        <ReactMarkdown>
          {bio}
        </ReactMarkdown>
        <img
          src="https://pm1.aminoapps.com/6944/5facc391e1fd7025e5bbef12966e162d2c76224cr1-615-1125v2_hq.jpg"
          alt="Yoda"
          style={{ width: "150px", marginTop: "2rem" }}
        />
      </div>
      <ShowEntries />
      <KeywordList />
    </section>
  );
}
