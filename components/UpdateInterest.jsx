// import necessary modules and components
import { useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import styles from "@/styles/Home.module.css";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";
import { Button } from "react-bootstrap";

// import contract addresses and ABI
const contractAddresses = require("../constants/contractaddress.json");
const abi = require("../constants/Promissory-abi.json");

export default function UpdateIntrest(props) {
  // initialize required state variables using useState hook
  const [propertyId, setPropertyId] = useState(props.editData.propertyId);
  const [intrestRate, setIntrestRate] = useState("");

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

  // function handleSubmit for handling the event on the UpdateIntrestRate Button
  async function handleSubmit(event) {
    event.preventDefault();

    // Calling the updateIntrestRate function on the smart contract with all necessary parameters
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
      onSuccess: handleSuccess, // Set the success callback function
      onError: handleError, // Set the error callback function
    });

    // Reset the form inputs after submitting the form
    setPropertyId("");
    setIntrestRate("");
    props.setModal(false);
  }

  // function handleError for handling after error  code
  async function handleError(error) {
    const message = error.data.message;
    dispatch({
      type: "info",
      message: `${message}`,
      title: "Intrest Update Failed",
      position: "topL",
      icon: "bell",
    });
  }

  // function handleSuccess for handling after success code
  async function handleSuccess(tx) {
    const transactionReceipt = await tx.wait(1);
    console.log(transactionReceipt);

    // Extract the property ID and intrest from the event emitted by the smart contract
    const property_id = transactionReceipt.events[0].args[0].toString();
    const intrest = transactionReceipt.events[0].args[1].toString();

    //Dispatching the Notification after Successfully updating Intrest
    dispatch({
      type: "info",
      message: ` Intrest Updated to ${intrest}`,
      title: "Intrest Update Notification",
      position: "topL",
      icon: "bell",
    });

    props.setRefresh((state) => {
      return !state;
    });
  }

  // Returning JSX for UpdateIntrest component
  return (
    <>
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
              disabled={props.editData ? true : false}
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
            <Button
              type="submit"
              className={styles.property_btn}
              onClick={handleSubmit}
            >
              Update IntrestRate
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
