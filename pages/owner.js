// importing necessary components and modules
import UpdateIntrest from "@/components/UpdateIntrest";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import UpdateLockingPeriod from "@/components/UpdateLockingPeriod";
import UpdateTokenSupply from "@/components/UpdateTokenSupply";

export default function Owner() {
  return (
    <div>
      <div className={styles.form_label}>
        <h2>Owner page</h2>
      </div>
      <div className={styles.form_label_owner}>
        <div className={styles.form_label}>Update Intrest</div>
        {/* Rendering the UpdateIntrest conponent */}
        <UpdateIntrest />
      </div>
      <div className={styles.form_label_owner}>
        <div className={styles.form_label}>Update LockingPeriod</div>
        {/* Rendering the UpdateLockingPeriod Component */}
        <UpdateLockingPeriod />
      </div>
      <div className={styles.form_label_owner}>
        <div className={styles.form_label}>Update TokenSupply</div>
        {/* Rendering the UpdateTokenSupply component */}
        <UpdateTokenSupply />
      </div>
    </div>
  );
}
