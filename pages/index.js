import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

import AddProperty from "@/components/AddProperty";
import { useMoralis } from "react-moralis";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { isWeb3Enabled } = useMoralis();
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="Permissory" content="Promissory" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.form_label_owner}>Welcome to Permissory</div>

      {isWeb3Enabled ? (
        <AddProperty />
      ) : (
        <div className={styles.form_label_owner}>
          Kindly Connect Your Metamask
        </div>
      )}
    </>
  );
}
