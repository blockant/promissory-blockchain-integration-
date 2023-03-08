import styles from "@/styles/Home.module.css";
import { Button, ButtonGroup, Spinner, Table } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import UpdateIntrest from "./UpdateIntrest";
import { useState } from "react";
import UpdateLockingPeriod from "./UpdateLockingPeriod";
import UpdateTokenSupply from "./UpdateTokenSupply";

// This  component  receives props as input.
// The props parameter is an object that contains properties passed by the parent component to this component.
// The properties object is an array of objects, and each object represents a property with several attributes.

export default function ShowProperties(props) {
  const [show, setShow] = useState(false);
  const [editData, setEditData] = useState(null);
  const [type, setType] = useState(1);

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
            <th>Status</th>
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
                    <span>
                      <Button
                        onClick={() => {
                          setType(3);
                          setEditData(obj);
                          setShow(true);
                        }}
                        variant="primary"
                      >
                        View
                      </Button>
                    </span>
                  </div>
                </td>
                <td>
                  <div className="d-flex">
                    <span className="flex-grow-1">{obj.interestRate}</span>
                    <span>
                      <Button
                        onClick={() => {
                          setType(1);
                          setEditData(obj);
                          setShow(true);
                        }}
                        variant="primary"
                      >
                        View
                      </Button>
                    </span>
                  </div>
                </td>
                <td>
                  <div className="d-flex">
                    <span className="flex-grow-1">{obj.lockingPeriod}</span>
                    <span>
                      <Button
                        onClick={() => {
                          setType(2);
                          setEditData(obj);
                          setShow(true);
                        }}
                        variant="primary"
                      >
                        View
                      </Button>
                    </span>
                  </div>
                </td>
                <td>
                  {obj.status == 1 ? <Button>Approve</Button> : "Approved"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Intrest</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            {
              1: <UpdateIntrest setModal={setShow} editData={editData} />,
              2: <UpdateLockingPeriod setModal={setShow} />,
              3: <UpdateTokenSupply setModal={setShow} />,
            }[type]
          }
        </Modal.Body>
      </Modal>
    </>
  );
}
