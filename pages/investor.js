import styles from "@/styles/Home.module.css";
import Link from "next/link";
import Invest from "@/components/Invest";

export default function Investor() {
  return (
    <div>
      <div className={styles.form_label_owner}>Invester page</div>
      <div className={styles.form_label_owner}>
        <Invest />
      </div>
    </div>
  );
}
