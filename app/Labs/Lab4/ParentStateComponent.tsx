import { useState } from "react";
import ChildStateComponent from "./ChildStateComponent";
export default function ParentStateComponent() {
    const [counter, setCounter] = useState(0);
    return (
        <div>
            <h2>Parent Counter</h2> <h5>Counter {counter}</h5>
            <h2>Child Counter</h2>
            <ChildStateComponent
                counter={counter}
                setCounter={setCounter} />
            <hr />
        </div>
    );
}

