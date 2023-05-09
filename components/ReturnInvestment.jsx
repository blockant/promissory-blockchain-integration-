// import necessary modules and components
import { useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import styles from "@/styles/Home.module.css";
import { useNotification } from "web3uikit";
import { Button } from "react-bootstrap";

// import contract addresses and ABI
const contractAddresses = require("../constants/contractaddress.json");
const abi = require("../constants/Promissory-abi.json");

export default function ReturnInvestment(props) {
  // initialize required state variables using useState hook
  const [propertyId, setPropertyId] = useState(props.editData.propertyId);
  const [investorAddress, setInvestorAddress] = useState("");

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

  // function handleSubmit for handling the event on the return Investment Button
  async function handleSubmit(event) {
    event.preventDefault();

    // Calling the returnInvestment function on the smart contract with all necessary parameters
    await runContractFunction({
      params: {
        abi: abi,
        contractAddress: permissoryAddresses,
        functionName: "returnInvestment",
        params: {
          _propertyId: propertyId,
          _investor: investorAddress,
        },
      },
      onSuccess: handleSuccess, // Set the success callback function
      onError: handleError, // Set the error callback function
    });

    // Reset the form inputs after submitting the form
    setPropertyId("");
    setInvestorAddress("");
    props.setModal(false);
  }

  // function handleError for handling after error  code
  async function handleError(error) {
    console.log(error); //fetching message from the error object
    dispatch({
      type: "info",
      message: `InvestmentReturn failed`,
      title: "InvestmentReturn  Notification",
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
      message: ` InvestmentReturn Success `,
      title: "InvestmentReturn Notification",
      position: "topL",
      icon: "bell",
    });
    props.setRefresh((state) => {
      return !state;
    });
  }

  // Returning JSX for ReturnInvestment component
  return (
    <div>
      <form key={"Return Investment"} className="form" onSubmit={handleSubmit}>
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
          <label htmlFor="investorAddress" className={styles.property_label}>
            Investor Adddress:
          </label>
          <input
            type="text"
            id="investorAddress"
            name="investorAddress"
            className={styles.form_input}
            value={investorAddress}
            onChange={(e) => setInvestorAddress(e.target.value)}
          />
        </div>
        <div className={styles.btn_wrapper}>
          <Button
            type="submit"
            className={styles.property_btn}
            onClick={handleSubmit}
          >
            Return Investment
          </Button>
        </div>
      </form>
    </div>
  );
}
