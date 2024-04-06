import { createElement, createTextNode } from "./ReactDom.js";

let nextWorkOfUnit = null;

/**
 * 工作循环
 */
function workLoop(deadline) {
  let shouldYield = false;

  while (nextWorkOfUnit && !shouldYield) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextWorkOfUnit && root) {
    commitRoot();
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
  const isFunctionComponent = typeof work.type === "function";

  if (!isFunctionComponent) {
    if (!work.dom) {
      // 1. 创建DOM
      const dom = (work.dom =
        work.type === "text"
          ? document.createTextNode("")
          : document.createElement(work.type));

      // 2. 添加属性
      Object.keys(work.props).forEach((key) => {
        if (key !== "children") {
          dom[key] = work.props[key];
        }
      });
    }
  }

  // 3.转换链表，设置好指针
  const children = isFunctionComponent
    ? [work.type(work.props)]
    : work.props.children;

  // 记录上一个孩子节点
  let previousFiber = null;

  children.forEach((child, index) => {
    const fiber = {
      type: child.type,
      props: child.props,
      el: child,
      dom: null,
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

  let nextFiber = work;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }

    nextFiber = nextFiber.parent;
  }
}

// 例如闲时调用
requestIdleCallback(workLoop);

let root = null;

export function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };

  // 设置root的值
  root = nextWorkOfUnit;
}

function commitRoot() {
  commitWork(root.child);
  root = null;
}

function commitWork(fiber) {
  if (!fiber) return;

  let firstParent = fiber.parent;
  while (!firstParent.dom) {
    firstParent = firstParent.parent;
  }

  if (fiber.dom) {
    firstParent.dom.append(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

const React = {
  createElement,
  createTextNode,
};

export default React;
