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

function render(el, container) {
  const { type, props } = el;

  const dom =
    type === "text"
      ? document.createTextNode("")
      : document.createElement(type);

  Object.keys(props).map((key) => {
    if (key !== "children") {
      dom[key] = props[key];
    }
  });

  props.children.forEach((child) => {
    render(child, dom);
  });

  container.appendChild(dom);
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
