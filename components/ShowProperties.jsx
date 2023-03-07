import styles from "@/styles/Home.module.css";

// This  component  receives props as input.
// The props parameter is an object that contains properties passed by the parent component to this component.
// The properties object is an array of objects, and each object represents a property with several attributes.

export default function ShowProperties(props) {
  return (
    <div>
      <ul>
        {/* Here, the map() method is used to loop through each object in the properties array and render them as list items */}
        {props.properties.map((obj, index) => (
          <li key={index} className={styles.data_card}>
            <div>Property ID: {obj.propertyId}</div>
            <div>Owner: {obj.owner}</div>
            <div>Token Name: {obj.tokenName}</div>
            <div>Token Symbol: {obj.tokenSymbol}</div>
            <div>Token Supply: {obj.tokenSupply}</div>
            <div>Interest Rate: {obj.interestRate}</div>
            <div>Locking Period: {obj.lockingPeriod}</div>
            <div>Status: {obj.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
