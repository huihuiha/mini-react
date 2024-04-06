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
      children: children.map((child) => {
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return !isTextNode ? child : createTextNode(child);
      }),
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
