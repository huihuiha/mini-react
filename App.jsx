import React from "./core/React.js";

function Counter({ count }) {
  const handleClick = () => {
    console.log("click");
  };

  return <div onClick={handleClick}>Counter: {count}</div>;
}

const App = (
  <div>
    123
    <div>124124</div>
    <Counter count={10}></Counter>
    <Counter count={20}></Counter>
  </div>
);

export default App;
