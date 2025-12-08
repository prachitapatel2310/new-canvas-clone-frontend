export default function ChildStateComponent({
 counter,
 setCounter
} : {
 counter: number;
 setCounter: (counter: number) => void;
}) {
  return (
    <div id="wd-child-state">
      <h5>Counter {counter}</h5>
      <button onClick={() => setCounter(counter + 1)} style={{ marginRight: 10 }} id="wd-increment-child-state-click">
        Increment</button>
      <button onClick={() => setCounter(counter - 1)} id="wd-decrement-child-state-click">
        Decrement</button>
    </div>
);}

