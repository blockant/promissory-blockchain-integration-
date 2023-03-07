//importing necessary components

import styles from "@/styles/Home.module.css";
import Link from "next/link";
import Invest from "@/components/Invest"; // importing Invest Component

export default function Investor() {
  return (
    <div>
      <div className={styles.form_label}>
        <h2>Investor page</h2>
      </div>
      <div className={styles.form_label_owner}>
        {/* Rendering Invest Component in  Investor Page*/}
        <Invest />
      </div>
    </div>
  );
}
