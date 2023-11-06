
import  { useState } from "react";
import ChildComponent from "./child";
const ParentComponent = () => {
  const [localState, setLocalState] = useState(0);
  const [childComponentState, setChildComponentState] = useState(0);
  const increment = () => setLocalState(localState + 1);

  return (
    <div>
      <ChildComponent number={childComponentState} />
      <button onClick={increment}>Up</button>
      <h1>Parent component: {localState}</h1>
    </div>
  );
};

export default ParentComponent;