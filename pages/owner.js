import UpdateIntrest from "@/components/UpdateIntrest";
import styles from "@/styles/Home.module.css";
import Link from "next/link";

export default function Owner() {
  return (
    <div>
      <div className={styles.form_label_owner}>Owner page</div>
      <div className={styles.form_label_owner}>
        <UpdateIntrest />
      </div>
    </div>
  );
}
