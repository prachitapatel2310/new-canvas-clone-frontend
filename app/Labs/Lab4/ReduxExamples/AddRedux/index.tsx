"use client";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { add } from "./addReducer";
import type { Lab4RootState } from "../../store";
import { Button, FormControl } from "react-bootstrap";
export default function AddRedux() {
  const [a, setA] = useState(12);
  const [b, setB] = useState(13);
  const sum = useSelector((state: Lab4RootState) => state.addReducer?.sum ?? 0);
  const dispatch = useDispatch();
  return (
    <div className="w-25" id="wd-add-redux">
      <h2 className="text-nowrap">Add Redux</h2>
  <h4 className="text-nowrap">{a} + {b} = {sum}</h4>
      <FormControl type="number" defaultValue={a} style={{marginBottom: '10px'}}
        onChange={(e) => setA(parseInt(e.target.value))} />
      <FormControl type="number" defaultValue={b} style={{marginBottom: '10px'}}
        onChange={(e) => setB(parseInt(e.target.value))} />
      <Button id="wd-add-redux-click"
              onClick={() => dispatch(add({ a, b }))}>
        Add Redux
      </Button>
      <hr/>
    </div>
  );
}

