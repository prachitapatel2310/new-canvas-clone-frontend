"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import ClickEvent from "./ClickEvent";
import PassingDataOnEvent from "./PassingDataOnEvent";
import PassingFunctions from "./PassingFunctions";
import EventObject from "./EventObject";
import Counter from "./Counter";
import BooleanStateVariables from "./BooleanStateVariables";
import StringStateVariables from "./StringStateVariables";
import DateStateVariable from "./DateStateVariable";
import ObjectStateVariable from "./ObjectStateVariable";
import ArrayStateVariable from "./ArrayStateVariable";
import ParentStateComponent from "./ParentStateComponent";
import ReduxExamples from "./ReduxExamples/page";
// Import the factory and store type
import { makeLab4Store, AppLab4Store } from "./store";

export default function Lab4() {
  const storeRef = useRef<AppLab4Store | null>(null);

  // Create the store instance on the client-side
  if (!storeRef.current) {
    storeRef.current = makeLab4Store();
  }

  function sayHello() {
    alert("Hello from Lab 4!");
  }

  return (
    <Provider store={storeRef.current}>
      <div>
        <h2>Lab 4</h2>
        <h3>React JS</h3>
        <hr />
        <ClickEvent />
        <PassingDataOnEvent />
        <PassingFunctions theFunction={sayHello} />
        <EventObject />
        <Counter />
        <BooleanStateVariables />
        <StringStateVariables />
        <DateStateVariable />
        <ObjectStateVariable />
        <ArrayStateVariable />
        <ParentStateComponent />
        <ReduxExamples />
      </div>
    </Provider>
  );
}