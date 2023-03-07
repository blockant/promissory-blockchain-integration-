// import necessary modules and components
import { useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import styles from "@/styles/Home.module.css";
import { ethers } from "ethers";

// import contract addresses and ABI
const contractAddresses = require("../constants/contractaddress.json");
const abi = require("../constants/Permissory-abi.json");
/**
 * Invest calculator
 */
export default function Invest() {
  // initialize required state variables using useState hook
  const [propertyId, setPropertyId] = useState("");
  const [amount, setAmount] = useState("");

  // retrieve chain ID and runContractFunction from Moralis
  const { chainId: hexChainId } = useMoralis();
  const { runContractFunction } = useWeb3Contract();

  // Convert the hexadecimal chain ID to an integer
  const chainId = parseInt(hexChainId);

  const permissoryAddresses =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null; // Get the contract address for the given chain ID from the JSON file

  /**
   * function handleSubmit for handling the event on the Invest Button
   * @param event
   *  */
  async function handleSubmit(event) {
    event.preventDefault(); //For preventing Default Bhaviour of Submit Form Button

    // Calling the investInProperty function on the smart contract with all necessary parameters
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

      onSuccess: (tx) => console.log(tx), // Handling successful transaction
      onError: (error) => console.log(error), // Handling error during transaction
    });

    // Resetting the propertyId and amount states after submission
    setAmount("");
    setPropertyId("");
  }

  // Returning JSX for Invest component
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
