import styles from "@/styles/Home.module.css";
import { Button, ButtonGroup, Spinner, Table } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import UpdateIntrest from "./UpdateIntrest";
import { useState } from "react";
import UpdateLockingPeriod from "./UpdateLockingPeriod";
import UpdateTokenSupply from "./UpdateTokenSupply";
import { AtomicApi } from "@web3uikit/icons";
import { Balancer } from "@web3uikit/icons";
import { Tokens } from "@web3uikit/icons";
import { Checkmark } from "@web3uikit/icons";
import { Cross } from "@web3uikit/icons";
import { BsPercent } from "react-icons/bs";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { useNotification } from "web3uikit";
import Approve from "./Approve";
import ClaimTokens from "./ClaimTokens";

const contractAddresses = require("../constants/contractaddress.json");
const abi = require("../constants/Permissory-abi.json");

// This  component  receives props as input.
// The props parameter is an object that contains properties passed by the parent component to this component.
// The properties object is an array of objects, and each object represents a property with several attributes.

export default function ShowProperties(props) {
  const [show, setShow] = useState(false);
  const [editData, setEditData] = useState(null);
  const [type, setType] = useState(1);

  const { account } = useMoralis();

  const handleClose = () => {
    setShow(false);
  };
  return (
    <>
      <Table striped bordered hover variant="dark" className="data_card">
        <thead>
          <tr>
            <th>Property ID</th>
            <th>Owner</th>
            <th>Token Name</th>
            <th>Token Symbol</th>
            <th>Token Supply</th>
            <th>Interest Rate</th>
            <th>Locking Period</th>
            {!props.isOwner && <th>Status</th>}
            {props.isOwner ? <th>Approve </th> : <th>Invest</th>}
            {!props.isOwner && <th>Claim</th>}
          </tr>
        </thead>
        <tbody>
          {props.isloading ? (
            <td className="w-100 text-center p-3 m-3" colSpan={6}>
              <Spinner animation="border" variant="primary" size="lg" />
            </td>
          ) : (
            props?.properties.map((obj, index) => (
              <tr key={index}>
                <td> {obj.propertyId}</td>
                <td>{obj.owner}</td>
                <td>{obj.tokenName}</td>
                <td>{obj.tokenSymbol}</td>
                <td>
                  <div className="d-flex">
                    <span className="flex-grow-1">{obj.tokenSupply}</span>
                    {account === obj.owner.toLowerCase() ? (
                      <span>
                        <Button
                          onClick={() => {
                            setType(3);
                            setEditData(obj);
                            setShow(true);
                          }}
                          variant="primary"
                        >
                          <Tokens fontSize="20px" />
                        </Button>
                      </span>
                    ) : null}
                  </div>
                </td>
                <td>
                  <div className="d-flex">
                    <span className="flex-grow-1">{obj.interestRate}</span>
                    {account === obj.owner.toLowerCase() ? (
                      <span>
                        <Button
                          onClick={() => {
                            setType(1);
                            setEditData(obj);
                            setShow(true);
                          }}
                          variant="primary"
                        >
                          <BsPercent></BsPercent>
                        </Button>
                      </span>
                    ) : null}
                  </div>
                </td>
                <td>
                  <div className="d-flex">
                    <span className="flex-grow-1">{obj.lockingPeriod}</span>
                    {account === obj.owner.toLowerCase() ? (
                      <span>
                        <Button
                          onClick={() => {
                            setType(2);
                            setEditData(obj);
                            setShow(true);
                          }}
                          variant="primary"
                        >
                          <AtomicApi fontSize="20px" />
                        </Button>
                      </span>
                    ) : null}
                  </div>
                </td>
                {!props.isOwner && (
                  <td>
                    <div>
                      {
                        {
                          1: "Not Approved",
                          2: <Checkmark fontSize="20px" color="#06f73a" />,
                          3: "Banned",
                        }[obj.status]
                      }
                    </div>
                  </td>
                )}
                {props.isOwner ? (
                  <td>
                    {
                      {
                        1: (
                          <Button
                            onClick={() => {
                              setType(4);
                              setEditData(obj);
                              setShow(true);
                            }}
                          >
                            Approve
                          </Button>
                        ),
                        2: <Checkmark fontSize="20px" color="#06f73a" />,
                        3: <Cross fontSize="20px" />,
                      }[obj.status]
                    }
                  </td>
                ) : (
                  <td>
                    {account !== obj.owner.toLowerCase() && obj.status == 2 ? (
                      <Button>Invest</Button>
                    ) : account == obj.owner.toLowerCase() ? (
                      <div>Own Property</div>
                    ) : (
                      <div>Pending Approval</div>
                    )}
                  </td>
                )}
                {!props.isOwner && (
                  <td>
                    {account !== obj.owner.toLowerCase() ? (
                      <Button
                        onClick={() => {
                          setType(5);
                          setEditData(obj);
                          setShow(true);
                        }}
                      >
                        Claim Investment
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setType(6);
                          setEditData(obj);
                          setShow(true);
                        }}
                      >
                        Claim Tokens
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </Table>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {
              {
                1: "Update Intrest",
                2: "UpdateLocking Period",
                3: "Update TokenSupply",
                4: "Approve",
                5: "claim Investment",
                6: "Claim Tokens",
              }[type]
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            {
              1: (
                <UpdateIntrest
                  setModal={setShow}
                  editData={editData}
                  setRefresh={props.setRefresh}
                />
              ),
              2: (
                <UpdateLockingPeriod
                  setModal={setShow}
                  editData={editData}
                  setRefresh={props.setRefresh}
                />
              ),
              3: (
                <UpdateTokenSupply
                  setModal={setShow}
                  editData={editData}
                  setRefresh={props.setRefresh}
                />
              ),
              4: (
                <Approve
                  setModal={setShow}
                  editData={editData}
                  setRefresh={props.setRefresh}
                />
              ),
              6: (
                <ClaimTokens
                  setModal={setShow}
                  editData={editData}
                  setRefresh={props.setRefresh}
                />
              ),
            }[type]
          }
        </Modal.Body>
      </Modal>
    </>
  );
}
