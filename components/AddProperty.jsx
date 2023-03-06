import { useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import styles from "@/styles/Home.module.css";
import { ethers } from "ethers";
const contractAddresses = require("../constants/contractaddress.json");
const abi = require("../constants/Permissory-abi.json");

export default function AddProperty() {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenSupply, setTokenSupply] = useState("");
  const [intrestRate, setIntrestRate] = useState("");
  const [lockingPeriod, setLockingPeroiod] = useState("");
  const { chainId: hexChainId } = useMoralis();
  const { runContractFunction } = useWeb3Contract();

  const chainId = parseInt(hexChainId);

  const permissoryAddresses =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  async function handleSubmit(event) {
    event.preventDefault();
    await runContractFunction({
      params: {
        abi: abi,
        contractAddress: permissoryAddresses,
        functionName: "addProperty",
        params: {
          _tokenName: tokenName,
          _tokenSymbol: tokenSymbol,
          _tokenSupply: tokenSupply,
          _interestRate: intrestRate,
          _lockingPeriod: lockingPeriod,
        },
      },
      onSuccess: (tx) => console.log(tx),
      onError: (error) => console.log(error),
    });
    setTokenName("");
    setTokenSymbol("");
    setIntrestRate("");
    setLockingPeroiod("");
    setTokenSupply("");
  }

  return (
    <div>
      <form
        key={"addProperty"}
        className={styles.mainForm}
        onSubmit={handleSubmit}
      >
        <div className={styles.second_form_container}>
          <label htmlFor="TokenName" className={styles.property_label}>
            TokenName:
          </label>
          <input
            type="text"
            id="tokenName"
            name="tokenName"
            className={styles.form_input}
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
          />
        </div>
        <div className={styles.second_form_container}>
          <label htmlFor="TokenSymbol" className={styles.property_label}>
            TokenSymbol:
          </label>
          <input
            type="text"
            id="tokenSymbol"
            name="tokenSymbol"
            className={styles.form_input}
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
          />
        </div>
        <div className={styles.second_form_container}>
          <label htmlFor="tokensupply" className={styles.property_label}>
            TokenSUpply :
          </label>
          <input
            type="number"
            id="tokenSupply"
            name="tokenSupply"
            className={styles.form_input}
            value={tokenSupply}
            onChange={(e) => setTokenSupply(e.target.value)}
          />
        </div>
        <div className={styles.second_form_container}>
          <label htmlFor="intrestRate" className={styles.property_label}>
            IntrestRate :
          </label>
          <input
            type="number"
            id="intrestRate"
            name="intrestRatee"
            className={styles.form_input}
            value={intrestRate}
            onChange={(e) => setIntrestRate(e.target.value)}
          />
        </div>
        <div className={styles.second_form_container}>
          <label htmlFor="lockingPeriod" className={styles.property_label}>
            LockingPeriod :
          </label>
          <input
            type="number"
            id="lockingPeriod"
            name="lockingPeriod"
            className={styles.form_input}
            value={lockingPeriod}
            onChange={(e) => setLockingPeroiod(e.target.value)}
          />
        </div>
        <div className={styles.btn_wrapper}>
          <button
            type="submit"
            className={styles.property_btn}
            onClick={handleSubmit}
          >
            Add Property
          </button>
        </div>
      </form>
    </div>
  );
}
