import { render } from "./React.js";

export function createTextNode(text) {
  return {
    type: "text",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextNode(child)
      ),
    },
  };
}

const ReactDom = {
  createRoot: function (container) {
    return {
      render: function (el) {
        render(el, container);
      },
    };
  },
};

export default ReactDom;
