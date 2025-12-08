"use client"
const hello = () => {
    alert("Hello World!");
};
const lifeIs = (good: string) => {
    alert(`Life is ${good}`);
};
export default function ClickEvent() {
    return (
        <div id="wd-click-event">
            <h2>Click Event</h2>
            <button onClick={hello} id="wd-hello-world-click" style={{marginRight: 10}}>
                Hello World!</button>
            <button onClick={() => lifeIs("Good!")} style={{marginRight: 10}}
                id="wd-life-is-good-click">
                Life is Good!</button>
            <button onClick={() => {
                hello();
                lifeIs("Great!");
            }} id="wd-life-is-great-click">
                Life is Great!
            </button>
            <hr />
        </div>
    );
}

