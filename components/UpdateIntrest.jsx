import { useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import styles from "@/styles/Home.module.css";
import { ethers } from "ethers";
const contractAddresses = require("../constants/contractaddress.json");
const abi = require("../constants/Permissory-abi.json");

export default function UpdateIntrest() {
  const [propertyId, setPropertyId] = useState("");
  const [intrestRate, setIntrestRate] = useState("");

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
        functionName: "updateInterestRate",
        params: {
          _propertyId: propertyId,
          _interestRate: intrestRate,
        },
      },
      onSuccess: (tx) => console.log(tx),
      onError: (error) => console.log(error),
    });

    setPropertyId("");
    setIntrestRate("");
  }
  return (
    <div>
      <form key={"updateintrest"} className="form" onSubmit={handleSubmit}>
        <div className={styles.second_form_container}>
          <label htmlFor="propertyId" className={styles.property_label}>
            Property Id:
          </label>
          <input
            type="number"
            id="propertyid"
            name="propertyId"
            className={styles.form_input}
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
          />
        </div>
        <div className={styles.second_form_container}>
          <label htmlFor="intrestrate" className={styles.property_label}>
            Intrest Rate:
          </label>
          <input
            type="number"
            id="intrestrate"
            name="intrestRate"
            className={styles.form_input}
            value={intrestRate}
            onChange={(e) => setIntrestRate(e.target.value)}
          />
        </div>
        <div className={styles.btn_wrapper}>
          <button
            type="submit"
            className={styles.property_btn}
            onClick={handleSubmit}
          >
            Update IntrestRate
          </button>
        </div>
      </form>
    </div>
  );
}
