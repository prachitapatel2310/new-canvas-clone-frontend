"use client";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "./counterReducer";
import type { Lab4RootState } from "../../store";
export default function CounterRedux() {
    // component must be a client component to use hooks (useSelector/useDispatch)
    const count = useSelector((state: Lab4RootState) => state.counterReducer?.count ?? 0);
    const dispatch = useDispatch();

    // debug: log render and count changes
    try { console.log("CounterRedux render, count=", count); } catch (e) { }
    return (
        <div id="wd-counter-redux">
            <h2>Counter Redux</h2>
            <h3>{count}</h3>
            <button onClick={() => { console.log("dispatch increment"); dispatch(increment()); }} id="wd-counter-redux-increment-click" style={{ marginRight: 10 }}> Increment </button>
            <button onClick={() => { console.log("dispatch decrement"); dispatch(decrement()); }} id="wd-counter-redux-decrement-click"> Decrement </button>
            <hr />
        </div>
    );
}
