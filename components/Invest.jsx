import { useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import styles from "@/styles/Home.module.css";
import { ethers } from "ethers";
const contractAddresses = require("../constants/contractaddress.json");
const abi = require("../constants/Permissory-abi.json");

export default function Invest() {
  const [propertyId, setPropertyId] = useState("");
  const [amount, setAmount] = useState("");

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
        functionName: "investInProperty",
        params: {
          _propertyId: propertyId,
          _investmentAmount: amount,
        },
      },
      onSuccess: (tx) => console.log(tx),
      onError: (error) => console.log(error),
    });
    setAmount("");
    setPropertyId("");
  }
  return (
    <div>
      <form key={"invest"} className="form" onSubmit={handleSubmit}>
        <div className={styles.second_form_container}>
          <label htmlFor="propertyis" className={styles.property_label}>
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
          <label htmlFor="amount" className={styles.property_label}>
            Amount:
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            className={styles.form_input}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className={styles.btn_wrapper}>
          <button
            type="submit"
            className={styles.property_btn}
            onClick={handleSubmit}
          >
            Invest
          </button>
        </div>
      </form>
    </div>
  );
}
