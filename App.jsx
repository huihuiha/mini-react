import React from "./core/React.js";

function Counter({ count }) {
  return <div>
    Counter: {count}</div>;
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
