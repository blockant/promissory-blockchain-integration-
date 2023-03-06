import { ConnectButton } from "web3uikit";
import styles from "@/styles/Home.module.css";
import Link from "next/link";

export default function Header() {
  return (
    <div flex="row" className={styles.header}>
      <h1>Promissory</h1>
      <div className={styles.navlinks}>
        <Link href="/">HOme</Link>
        <Link href="/owner">Owner</Link>
        <Link href="/investor">Investor</Link>
      </div>
      <div>
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  );
}
