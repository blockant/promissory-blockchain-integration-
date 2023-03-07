// Importing necessary modules and components
import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import AddProperty from "@/components/AddProperty";
import ShowProperties from "@/components/ShowProperties";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Importing contract addresses and ABI
const contractAddresses = require("../constants/contractaddress.json");
const abi = require("../constants/Permissory-abi.json");

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // Initializing state to hold list of properties
  const [properties, setProperties] = useState([]);

  // Getting chainId, Web3 status, and account address from Moralis
  const { chainId: hexChainId, isWeb3Enabled, account } = useMoralis();

  // Getting contract function from Moralis
  const { runContractFunction } = useWeb3Contract();

  const chainId = parseInt(hexChainId); // Converting hex chainId to decimal

  // Getting Permissory contract address based on chainId
  const permissoryAddresses =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  console.log(account);

  // Function to get list of properties from contract
  async function GetProperty() {
    //calling getProperties function on contract with necessary parameters
    const property = await runContractFunction({
      params: {
        abi: abi,
        contractAddress: permissoryAddresses,
        functionName: "getProperties",
        params: {},
      },
      onSuccess: (tx) => {
        // Logging successful transaction
        console.log(tx);
      },
      onError: (error) => console.log(error), // Logging error
    });

    // Converting returned property string into array of objects
    const propertyString = String(property);
    const inputPropertyArray = propertyString.split(",");

    const resultPropertyArray = [];

    for (let i = 0; i < inputPropertyArray.length; i += 8) {
      const obj = {
        propertyId: inputPropertyArray[i],
        owner: inputPropertyArray[i + 1],
        tokenName: inputPropertyArray[i + 2],
        tokenSymbol: inputPropertyArray[i + 3],
        tokenSupply: inputPropertyArray[i + 4],
        interestRate: inputPropertyArray[i + 5],
        lockingPeriod: inputPropertyArray[i + 6],
        status: inputPropertyArray[i + 7],
      };
      resultPropertyArray.push(obj);
    }

    console.log(resultPropertyArray);
    // setting state with it resultPropertyArray
    setProperties(resultPropertyArray);
  }

  // Calling GetProperty function using useEffect
  useEffect(() => {
    isWeb3Enabled && GetProperty();
  }, [isWeb3Enabled]);

  // Returning JSX for index  page
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="Permissory" content="Promissory" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Displaying welcome message or Metamask connection prompt based on Web3 status */}
      <div className={styles.form_label_owner}>Welcome to Permissory</div>

      {isWeb3Enabled ? (
        <div>
          {/* Rendering ShowProperties component by passing properties as props */}
          <ShowProperties properties={properties} />
          {/* Rendering AddProperty Component */}
          <AddProperty />
        </div>
      ) : (
        <div className={styles.form_label_owner}>
          Kindly Connect Your Metamask
        </div>
      )}
    </>
  );
}

//List of Added Property is 0,0x8CccF51C91067e1AeD735F0CC7fdEbe6bAa05393,New York,NYC,10000000000000000000000,545,20,2,1,0x8CccF51C91067e1AeD735F0CC7fdEbe6bAa05393,New Delhi,NDLS,12000000000000000000000,850,25,2,2,0x84C632431C444b0b076fc5784cd59c065E75dCdc,Rites,R,1000,2,10,1,3,0x84C632431C444b0b076fc5784cd59c065E75dCdc,Home,H,100,2,23,1,4,0x84C632431C444b0b076fc5784cd59c065E75dCdc,lets,L,1000,8,3,1,5,0x84C632431C444b0b076fc5784cd59c065E75dCdc,Land,L,250,2,12,1,6,0x84C632431C444b0b076fc5784cd59c065E75dCdc,Hotel,H,100,13,10,1,7,0xb34cDe61a284205ffeD6Baf0b06F0445336631DC,Gold,GLD,1000,10,2,1,8,0xb34cDe61a284205ffeD6Baf0b06F0445336631DC,Silver,SVL,200,12,21,1
//index.js?bee7:57 {0: Array(1), 1: Array(1), 2: Arr
