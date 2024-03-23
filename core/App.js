import { createElement } from './ReactDom.js'

const App = createElement('div', {id: 'app'}, 'Hello World', 'Hello World 2', createElement("div", {id: 'app2'}, 'Hello World 3'));


export default App;