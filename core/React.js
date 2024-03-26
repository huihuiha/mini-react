import { createElement, createTextNode } from "./ReactDom.js";

let nextWorkOfUnit = null;
function workLoop(deadline) {
  let shouldYield = false;

  while (nextWorkOfUnit && !shouldYield) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    shouldYield = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}

/**
 * Fiber 架构
 * 遍历的顺序是
 * - child节点
 * - sibling节点
 * - 叔叔节点
 */
function performWorkOfUnit(work) {
  if (!work.dom) {
    // 1. 创建DOM
    const dom = (work.dom = work.type === "text")
      ? document.createTextNode("")
      : document.createElement(work.type);

    work.parent.dom.appendChild(dom);

    // 2. 添加属性
    Object.keys(el.props).forEach((key) => {
      if (key !== "children") {
        dom[key] = el.props[key];
      }
    });
  }

  // 3.转换链表，设置好指针
  const children = el.props.children;

  // 记录上一个孩子节点
  let previousFiber = null;

  children.forEach((child) => {
    const fiber = {
      type: child.type,
      props: child.props,
      el: child,
      dom,
      parent: work,
      sibling: null,
    };

    if (index === 0) {
      work.child = fiber;
    } else {
      previousFiber.sibling = fiber;
    }

    previousFiber = fiber;
  });

  // 4. 返回下一个执行的任务
  if (work.child) {
    return work.child;
  }

  if (work.sibling) {
    return work.sibling;
  }

  return work.parent?.sibling;
}

requestIdleCallback(workLoop);

function render(el, container) {
  nextWorkOfUnit = {
    el,
    dom: container,
    props: el.props,
    parent: null,
    child: null,
    sibling: null,
  };
}

const React = {
  createElement,
  createTextNode,
};

export default React;
