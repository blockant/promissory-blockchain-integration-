// import necessary modules and components
import { useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import styles from "@/styles/Home.module.css";
import { useNotification } from "web3uikit";
import { Button } from "react-bootstrap";

// import contract addresses and ABI
const contractAddresses = require("../constants/contractaddress.json");
const abi = require("../constants/Promissory-abi.json");

export default function ClaimReturn(props) {
  // initialize required state variables using useState hook
  const [propertyId, setPropertyId] = useState(props.editData.propertyId);
  const [claimAmount, setClaimAmount] = useState("");

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

  // function handleSubmit for handling the event on the claimReturn Button
  async function handleSubmit(event) {
    event.preventDefault();

    // Calling the claimReturn function on the smart contract with all necessary parameters
    await runContractFunction({
      params: {
        abi: abi,
        contractAddress: permissoryAddresses,
        functionName: "claimReturn",
        params: {
          _propertyId: propertyId,
          _returnAmount: claimAmount,
        },
      },
      onSuccess: handleSuccess, // Set the success callback function
      onError: handleError, // Set the error callback function
    });

    // Reset the form inputs after submitting the form
    setPropertyId("");
    setClaimAmount("");
    props.setModal(false);
  }

  // function handleError for handling after error  code
  async function handleError(error) {
    console.log(error); //fetching message from the error object
    dispatch({
      type: "info",
      message: `Claim failed`,
      title: "Return claim  Failed",
      position: "topL",
      icon: "bell",
    });
  }

  // function handleSuccess for handling after success code
  async function handleSuccess(tx) {
    const transactionReceipt = await tx.wait(1); //Waiting for 1 Block
    console.log(transactionReceipt);

    //Dispatching the Notification after Successfully claiming Return
    dispatch({
      type: "info",
      message: ` Return Claimed `,
      title: "Return Claim notification",
      position: "topL",
      icon: "bell",
    });
    props.setRefresh((state) => {
      return !state;
    });
  }

  // Returning JSX for ClaimReturns component
  return (
    <div>
      <form key={"Claim Return"} className="form" onSubmit={handleSubmit}>
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
          <label htmlFor="claimAmount" className={styles.property_label}>
            Claim Amount:
          </label>
          <input
            type="number"
            id="claimAmount"
            name="claimAmount"
            className={styles.form_input}
            value={claimAmount}
            onChange={(e) => setClaimAmount(e.target.value)}
          />
        </div>
        <div className={styles.btn_wrapper}>
          <Button
            type="submit"
            className={styles.property_btn}
            onClick={handleSubmit}
          >
            Claim Return
          </Button>
        </div>
      </form>
    </div>
  );
}
