// import necessary modules and components
import { useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import styles from "@/styles/Home.module.css";
import { useNotification } from "web3uikit";

// import contract addresses and ABI
const contractAddresses = require("../constants/contractaddress.json");
const abi = require("../constants/Permissory-abi.json");

export default function UpdateLockingPeriod() {
  // initialize required state variables using useState hook
  const [propertyId, setPropertyId] = useState("");
  const [lockingPeriod, setLockingPeroiod] = useState("");

  // retrieve chain ID and runContractFunction from Moralis
  const { chainId: hexChainId } = useMoralis();
  const { runContractFunction } = useWeb3Contract();

  // retrive dispatch function from web3uikit
  const dispatch = useNotification();

  // Convert the hexadecimal chain ID to an integer
  const chainId = parseInt(hexChainId);

  // Get the contract address for the given chain ID from the JSON file
  const permissoryAddresses =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  // function handleSubmit for handling the event on the UpdateLockingPeriod Button
  async function handleSubmit(event) {
    event.preventDefault();

    // Calling the updateLockingPeriod function on the smart contract with all necessary parameters
    await runContractFunction({
      params: {
        abi: abi,
        contractAddress: permissoryAddresses,
        functionName: "updateLockingPeriod",
        params: {
          _propertyId: propertyId,
          _updateLockingPeriod: lockingPeriod,
        },
      },
      onSuccess: handleSuccess, // Set the success callback function
      onError: handleError, // Set the error callback function
    });

    // Reset the form inputs after submitting the form
    setPropertyId("");
    setLockingPeroiod("");
  }

  // function handleError for handling after error  code
  async function handleError(error) {
    const message = error.data.message; //fetching message from the error object
    dispatch({
      type: "info",
      message: `${message}`,
      title: "LockingPeriod Update Failed",
      position: "topL",
      icon: "bell",
    });
  }

  // function handleSuccess for handling after success code
  async function handleSuccess(tx) {
    const transactionReceipt = await tx.wait(1); //Waiting for 1 Block
    console.log(transactionReceipt);

    // Extract the property ID and lockingPeriod from the event emitted by the smart contract
    const property_id = transactionReceipt.events[0].args[0].toString();
    const lockingPeriod = transactionReceipt.events[0].args[1].toString();

    //Dispatching the Notification after Successfully updating LockingPeriod
    dispatch({
      type: "info",
      message: ` locking Period updated to  ${lockingPeriod}`,
      title: "LockingPeriod Update Notification",
      position: "topL",
      icon: "bell",
    });
  }

  // Returning JSX for UpdateLockingPeriod component
  return (
    <div>
      <form
        key={"updatelockingperiod"}
        className="form"
        onSubmit={handleSubmit}
      >
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
          <label htmlFor="lockingperiod" className={styles.property_label}>
            Locking Period:
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
            Update Locking Period
          </button>
        </div>
      </form>
    </div>
  );
}
