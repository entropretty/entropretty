import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { F as FeedbackDialog, a as Form, b as FormField, c as FormItem, d as FormControl } from './index-BUYfvkjm.mjs';
import * as React from 'react';
import React__default, { Suspense, lazy, useState as useState$1, useMemo as useMemo$1, useEffect as useEffect$1, useCallback as useCallback$1, useRef as useRef$1 } from 'react';
import { c as cn } from './utils-CZo72ztR.mjs';
import { DragHandleDots2Icon } from '@radix-ui/react-icons';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import { F as FamilyKindBadge, B as Badge } from './FamilyKindBadge-8clZ-XnL.mjs';
import { I as Input } from './input-DTVPqQIJ.mjs';
import { s as scriptErrorAtom, c as editorSeedTypeAtom, e as editorCodeAtom, b as editorSeedFamilyAtom, d as editorCodeVersionAtom, g as generateNewSeedAtom, a as algorithmNameAtom, r as remixAtom } from './Create-ZBsP1-ra.mjs';
import { b as useAlgorithmService, s as supabase } from './router-Dgt9epnn.mjs';
import { s as seedToKey, n as numeric } from './index-CWNUk7Yv.mjs';
import useMeasure from 'react-use-measure';
import { A as AlgorithmBitmap } from './AlgorithmBitmap-CIcD_7lU.mjs';
import { B as Button } from './button-CeG_45YZ.mjs';
import * as RechartsPrimitive from 'recharts';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, Cell } from 'recharts';
import { Dices, Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from './select-BK0MCkcO.mjs';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import '@radix-ui/react-slot';
import './label-DtJL4vlD.mjs';
import '@radix-ui/react-label';
import 'class-variance-authority';
import 'motion/react';
import 'clsx';
import 'tailwind-merge';
import 'react-helmet-async';
import 'comlink';
import 'p-queue';
import '@supabase/supabase-js';
import 'next-themes';
import '@radix-ui/react-select';

// This module exists to work around Webpack issue https://github.com/webpack/webpack/issues/14814

// eslint-disable-next-line no-restricted-imports

const {
  createElement,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} = React;

// `Math.random()` and `.slice(0, 5)` prevents bundlers from trying to `import { useId } from 'react'`
const useId = React[`useId${Math.random()}`.slice(0, 5)];

// The "contextmenu" event is not supported as a PointerEvent in all browsers yet, so MouseEvent still need to be handled

const PanelGroupContext = createContext(null);
PanelGroupContext.displayName = "PanelGroupContext";

const wrappedUseId = typeof useId === "function" ? useId : () => null;
let counter = 0;
function useUniqueId(idFromParams = null) {
  const idFromUseId = wrappedUseId();
  const idRef = useRef(idFromParams || idFromUseId || null);
  if (idRef.current === null) {
    idRef.current = "" + counter++;
  }
  return idFromParams !== null && idFromParams !== void 0 ? idFromParams : idRef.current;
}

function PanelWithForwardedRef({
  children,
  className: classNameFromProps = "",
  collapsedSize,
  collapsible,
  defaultSize,
  forwardedRef,
  id: idFromProps,
  maxSize,
  minSize,
  onCollapse,
  onExpand,
  onResize,
  order,
  style: styleFromProps,
  tagName: Type = "div",
  ...rest
}) {
  const context = useContext(PanelGroupContext);
  if (context === null) {
    throw Error(`Panel components must be rendered within a PanelGroup container`);
  }
  const {
    collapsePanel,
    expandPanel,
    getPanelSize,
    getPanelStyle,
    groupId,
    isPanelCollapsed,
    reevaluatePanelConstraints,
    registerPanel,
    resizePanel,
    unregisterPanel
  } = context;
  const panelId = useUniqueId(idFromProps);
  const panelDataRef = useRef({
    callbacks: {
      onCollapse,
      onExpand,
      onResize
    },
    constraints: {
      collapsedSize,
      collapsible,
      defaultSize,
      maxSize,
      minSize
    },
    id: panelId,
    idIsFromProps: idFromProps !== undefined,
    order
  });
  useRef({
    didLogMissingDefaultSizeWarning: false
  });
  useImperativeHandle(forwardedRef, () => ({
    collapse: () => {
      collapsePanel(panelDataRef.current);
    },
    expand: minSize => {
      expandPanel(panelDataRef.current, minSize);
    },
    getId() {
      return panelId;
    },
    getSize() {
      return getPanelSize(panelDataRef.current);
    },
    isCollapsed() {
      return isPanelCollapsed(panelDataRef.current);
    },
    isExpanded() {
      return !isPanelCollapsed(panelDataRef.current);
    },
    resize: size => {
      resizePanel(panelDataRef.current, size);
    }
  }), [collapsePanel, expandPanel, getPanelSize, isPanelCollapsed, panelId, resizePanel]);
  const style = getPanelStyle(panelDataRef.current, defaultSize);
  return createElement(Type, {
    ...rest,
    children,
    className: classNameFromProps,
    id: idFromProps,
    style: {
      ...style,
      ...styleFromProps
    },
    // CSS selectors
    "data-panel": "",
    "data-panel-collapsible": collapsible || undefined,
    "data-panel-group-id": groupId,
    "data-panel-id": panelId,
    "data-panel-size": parseFloat("" + style.flexGrow).toFixed(1)
  });
}
const Panel = forwardRef((props, ref) => createElement(PanelWithForwardedRef, {
  ...props,
  forwardedRef: ref
}));
PanelWithForwardedRef.displayName = "Panel";
Panel.displayName = "forwardRef(Panel)";

let currentCursorStyle = null;
let styleElement = null;
function getCursorStyle(state, constraintFlags) {
  if (constraintFlags) {
    const horizontalMin = (constraintFlags & EXCEEDED_HORIZONTAL_MIN) !== 0;
    const horizontalMax = (constraintFlags & EXCEEDED_HORIZONTAL_MAX) !== 0;
    const verticalMin = (constraintFlags & EXCEEDED_VERTICAL_MIN) !== 0;
    const verticalMax = (constraintFlags & EXCEEDED_VERTICAL_MAX) !== 0;
    if (horizontalMin) {
      if (verticalMin) {
        return "se-resize";
      } else if (verticalMax) {
        return "ne-resize";
      } else {
        return "e-resize";
      }
    } else if (horizontalMax) {
      if (verticalMin) {
        return "sw-resize";
      } else if (verticalMax) {
        return "nw-resize";
      } else {
        return "w-resize";
      }
    } else if (verticalMin) {
      return "s-resize";
    } else if (verticalMax) {
      return "n-resize";
    }
  }
  switch (state) {
    case "horizontal":
      return "ew-resize";
    case "intersection":
      return "move";
    case "vertical":
      return "ns-resize";
  }
}
function resetGlobalCursorStyle() {
  if (styleElement !== null) {
    document.head.removeChild(styleElement);
    currentCursorStyle = null;
    styleElement = null;
  }
}
function setGlobalCursorStyle(state, constraintFlags) {
  const style = getCursorStyle(state, constraintFlags);
  if (currentCursorStyle === style) {
    return;
  }
  currentCursorStyle = style;
  if (styleElement === null) {
    styleElement = document.createElement("style");
    document.head.appendChild(styleElement);
  }
  styleElement.innerHTML = `*{cursor: ${style}!important;}`;
}

function isKeyDown(event) {
  return event.type === "keydown";
}
function isPointerEvent(event) {
  return event.type.startsWith("pointer");
}
function isMouseEvent(event) {
  return event.type.startsWith("mouse");
}

function getResizeEventCoordinates(event) {
  if (isPointerEvent(event)) {
    if (event.isPrimary) {
      return {
        x: event.clientX,
        y: event.clientY
      };
    }
  } else if (isMouseEvent(event)) {
    return {
      x: event.clientX,
      y: event.clientY
    };
  }
  return {
    x: Infinity,
    y: Infinity
  };
}

function getInputType() {
  if (typeof matchMedia === "function") {
    return matchMedia("(pointer:coarse)").matches ? "coarse" : "fine";
  }
}

function intersects(rectOne, rectTwo, strict) {
  {
    return rectOne.x < rectTwo.x + rectTwo.width && rectOne.x + rectOne.width > rectTwo.x && rectOne.y < rectTwo.y + rectTwo.height && rectOne.y + rectOne.height > rectTwo.y;
  }
}

// Forked from NPM stacking-order@2.0.0

/**
 * Determine which of two nodes appears in front of the other —
 * if `a` is in front, returns 1, otherwise returns -1
 * @param {HTMLElement | SVGElement} a
 * @param {HTMLElement | SVGElement} b
 */
function compare(a, b) {
  if (a === b) throw new Error("Cannot compare node with itself");
  const ancestors = {
    a: get_ancestors(a),
    b: get_ancestors(b)
  };
  let common_ancestor;

  // remove shared ancestors
  while (ancestors.a.at(-1) === ancestors.b.at(-1)) {
    a = ancestors.a.pop();
    b = ancestors.b.pop();
    common_ancestor = a;
  }
  assert(common_ancestor, "Stacking order can only be calculated for elements with a common ancestor");
  const z_indexes = {
    a: get_z_index(find_stacking_context(ancestors.a)),
    b: get_z_index(find_stacking_context(ancestors.b))
  };
  if (z_indexes.a === z_indexes.b) {
    const children = common_ancestor.childNodes;
    const furthest_ancestors = {
      a: ancestors.a.at(-1),
      b: ancestors.b.at(-1)
    };
    let i = children.length;
    while (i--) {
      const child = children[i];
      if (child === furthest_ancestors.a) return 1;
      if (child === furthest_ancestors.b) return -1;
    }
  }
  return Math.sign(z_indexes.a - z_indexes.b);
}
const props = /\b(?:position|zIndex|opacity|transform|webkitTransform|mixBlendMode|filter|webkitFilter|isolation)\b/;

/** @param {HTMLElement | SVGElement} node */
function is_flex_item(node) {
  var _get_parent;
  // @ts-ignore
  const display = getComputedStyle((_get_parent = get_parent(node)) !== null && _get_parent !== void 0 ? _get_parent : node).display;
  return display === "flex" || display === "inline-flex";
}

/** @param {HTMLElement | SVGElement} node */
function creates_stacking_context(node) {
  const style = getComputedStyle(node);

  // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
  if (style.position === "fixed") return true;
  // Forked to fix upstream bug https://github.com/Rich-Harris/stacking-order/issues/3
  // if (
  //   (style.zIndex !== "auto" && style.position !== "static") ||
  //   is_flex_item(node)
  // )
  if (style.zIndex !== "auto" && (style.position !== "static" || is_flex_item(node))) return true;
  if (+style.opacity < 1) return true;
  if ("transform" in style && style.transform !== "none") return true;
  if ("webkitTransform" in style && style.webkitTransform !== "none") return true;
  if ("mixBlendMode" in style && style.mixBlendMode !== "normal") return true;
  if ("filter" in style && style.filter !== "none") return true;
  if ("webkitFilter" in style && style.webkitFilter !== "none") return true;
  if ("isolation" in style && style.isolation === "isolate") return true;
  if (props.test(style.willChange)) return true;
  // @ts-expect-error
  if (style.webkitOverflowScrolling === "touch") return true;
  return false;
}

/** @param {(HTMLElement| SVGElement)[]} nodes */
function find_stacking_context(nodes) {
  let i = nodes.length;
  while (i--) {
    const node = nodes[i];
    assert(node, "Missing node");
    if (creates_stacking_context(node)) return node;
  }
  return null;
}

/** @param {HTMLElement | SVGElement} node */
function get_z_index(node) {
  return node && Number(getComputedStyle(node).zIndex) || 0;
}

/** @param {HTMLElement} node */
function get_ancestors(node) {
  const ancestors = [];
  while (node) {
    ancestors.push(node);
    // @ts-ignore
    node = get_parent(node);
  }
  return ancestors; // [ node, ... <body>, <html>, document ]
}

/** @param {HTMLElement} node */
function get_parent(node) {
  const {
    parentNode
  } = node;
  if (parentNode && parentNode instanceof ShadowRoot) {
    return parentNode.host;
  }
  return parentNode;
}

const EXCEEDED_HORIZONTAL_MIN = 0b0001;
const EXCEEDED_HORIZONTAL_MAX = 0b0010;
const EXCEEDED_VERTICAL_MIN = 0b0100;
const EXCEEDED_VERTICAL_MAX = 0b1000;
const isCoarsePointer = getInputType() === "coarse";
let intersectingHandles = [];
let isPointerDown = false;
let ownerDocumentCounts = new Map();
let panelConstraintFlags = new Map();
const registeredResizeHandlers = new Set();
function registerResizeHandle(resizeHandleId, element, direction, hitAreaMargins, setResizeHandlerState) {
  var _ownerDocumentCounts$;
  const {
    ownerDocument
  } = element;
  const data = {
    direction,
    element,
    hitAreaMargins,
    setResizeHandlerState
  };
  const count = (_ownerDocumentCounts$ = ownerDocumentCounts.get(ownerDocument)) !== null && _ownerDocumentCounts$ !== void 0 ? _ownerDocumentCounts$ : 0;
  ownerDocumentCounts.set(ownerDocument, count + 1);
  registeredResizeHandlers.add(data);
  updateListeners();
  return function unregisterResizeHandle() {
    var _ownerDocumentCounts$2;
    panelConstraintFlags.delete(resizeHandleId);
    registeredResizeHandlers.delete(data);
    const count = (_ownerDocumentCounts$2 = ownerDocumentCounts.get(ownerDocument)) !== null && _ownerDocumentCounts$2 !== void 0 ? _ownerDocumentCounts$2 : 1;
    ownerDocumentCounts.set(ownerDocument, count - 1);
    updateListeners();
    if (count === 1) {
      ownerDocumentCounts.delete(ownerDocument);
    }

    // If the resize handle that is currently unmounting is intersecting with the pointer,
    // update the global pointer to account for the change
    if (intersectingHandles.includes(data)) {
      const index = intersectingHandles.indexOf(data);
      if (index >= 0) {
        intersectingHandles.splice(index, 1);
      }
      updateCursor();

      // Also instruct the handle to stop dragging; this prevents the parent group from being left in an inconsistent state
      // See github.com/bvaughn/react-resizable-panels/issues/402
      setResizeHandlerState("up", true, null);
    }
  };
}
function handlePointerDown(event) {
  const {
    target
  } = event;
  const {
    x,
    y
  } = getResizeEventCoordinates(event);
  isPointerDown = true;
  recalculateIntersectingHandles({
    target,
    x,
    y
  });
  updateListeners();
  if (intersectingHandles.length > 0) {
    updateResizeHandlerStates("down", event);
    event.preventDefault();
    event.stopPropagation();
  }
}
function handlePointerMove(event) {
  const {
    x,
    y
  } = getResizeEventCoordinates(event);

  // Edge case (see #340)
  // Detect when the pointer has been released outside an iframe on a different domain
  if (isPointerDown && event.buttons === 0) {
    isPointerDown = false;
    updateResizeHandlerStates("up", event);
  }
  if (!isPointerDown) {
    const {
      target
    } = event;

    // Recalculate intersecting handles whenever the pointer moves, except if it has already been pressed
    // at that point, the handles may not move with the pointer (depending on constraints)
    // but the same set of active handles should be locked until the pointer is released
    recalculateIntersectingHandles({
      target,
      x,
      y
    });
  }
  updateResizeHandlerStates("move", event);

  // Update cursor based on return value(s) from active handles
  updateCursor();
  if (intersectingHandles.length > 0) {
    event.preventDefault();
  }
}
function handlePointerUp(event) {
  const {
    target
  } = event;
  const {
    x,
    y
  } = getResizeEventCoordinates(event);
  panelConstraintFlags.clear();
  isPointerDown = false;
  if (intersectingHandles.length > 0) {
    event.preventDefault();
  }
  updateResizeHandlerStates("up", event);
  recalculateIntersectingHandles({
    target,
    x,
    y
  });
  updateCursor();
  updateListeners();
}
function recalculateIntersectingHandles({
  target,
  x,
  y
}) {
  intersectingHandles.splice(0);
  let targetElement = null;
  if (target instanceof HTMLElement || target instanceof SVGElement) {
    targetElement = target;
  }
  registeredResizeHandlers.forEach(data => {
    const {
      element: dragHandleElement,
      hitAreaMargins
    } = data;
    const dragHandleRect = dragHandleElement.getBoundingClientRect();
    const {
      bottom,
      left,
      right,
      top
    } = dragHandleRect;
    const margin = isCoarsePointer ? hitAreaMargins.coarse : hitAreaMargins.fine;
    const eventIntersects = x >= left - margin && x <= right + margin && y >= top - margin && y <= bottom + margin;
    if (eventIntersects) {
      // TRICKY
      // We listen for pointers events at the root in order to support hit area margins
      // (determining when the pointer is close enough to an element to be considered a "hit")
      // Clicking on an element "above" a handle (e.g. a modal) should prevent a hit though
      // so at this point we need to compare stacking order of a potentially intersecting drag handle,
      // and the element that was actually clicked/touched
      if (targetElement !== null && document.contains(targetElement) && dragHandleElement !== targetElement && !dragHandleElement.contains(targetElement) && !targetElement.contains(dragHandleElement) &&
      // Calculating stacking order has a cost, so we should avoid it if possible
      // That is why we only check potentially intersecting handles,
      // and why we skip if the event target is within the handle's DOM
      compare(targetElement, dragHandleElement) > 0) {
        // If the target is above the drag handle, then we also need to confirm they overlap
        // If they are beside each other (e.g. a panel and its drag handle) then the handle is still interactive
        //
        // It's not enough to compare only the target
        // The target might be a small element inside of a larger container
        // (For example, a SPAN or a DIV inside of a larger modal dialog)
        let currentElement = targetElement;
        let didIntersect = false;
        while (currentElement) {
          if (currentElement.contains(dragHandleElement)) {
            break;
          } else if (intersects(currentElement.getBoundingClientRect(), dragHandleRect)) {
            didIntersect = true;
            break;
          }
          currentElement = currentElement.parentElement;
        }
        if (didIntersect) {
          return;
        }
      }
      intersectingHandles.push(data);
    }
  });
}
function reportConstraintsViolation(resizeHandleId, flag) {
  panelConstraintFlags.set(resizeHandleId, flag);
}
function updateCursor() {
  let intersectsHorizontal = false;
  let intersectsVertical = false;
  intersectingHandles.forEach(data => {
    const {
      direction
    } = data;
    if (direction === "horizontal") {
      intersectsHorizontal = true;
    } else {
      intersectsVertical = true;
    }
  });
  let constraintFlags = 0;
  panelConstraintFlags.forEach(flag => {
    constraintFlags |= flag;
  });
  if (intersectsHorizontal && intersectsVertical) {
    setGlobalCursorStyle("intersection", constraintFlags);
  } else if (intersectsHorizontal) {
    setGlobalCursorStyle("horizontal", constraintFlags);
  } else if (intersectsVertical) {
    setGlobalCursorStyle("vertical", constraintFlags);
  } else {
    resetGlobalCursorStyle();
  }
}
function updateListeners() {
  ownerDocumentCounts.forEach((_, ownerDocument) => {
    const {
      body
    } = ownerDocument;
    body.removeEventListener("contextmenu", handlePointerUp);
    body.removeEventListener("pointerdown", handlePointerDown);
    body.removeEventListener("pointerleave", handlePointerMove);
    body.removeEventListener("pointermove", handlePointerMove);
  });
  window.removeEventListener("pointerup", handlePointerUp);
  window.removeEventListener("pointercancel", handlePointerUp);
  if (registeredResizeHandlers.size > 0) {
    if (isPointerDown) {
      if (intersectingHandles.length > 0) {
        ownerDocumentCounts.forEach((count, ownerDocument) => {
          const {
            body
          } = ownerDocument;
          if (count > 0) {
            body.addEventListener("contextmenu", handlePointerUp);
            body.addEventListener("pointerleave", handlePointerMove);
            body.addEventListener("pointermove", handlePointerMove);
          }
        });
      }
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
    } else {
      ownerDocumentCounts.forEach((count, ownerDocument) => {
        const {
          body
        } = ownerDocument;
        if (count > 0) {
          body.addEventListener("pointerdown", handlePointerDown, {
            capture: true
          });
          body.addEventListener("pointermove", handlePointerMove);
        }
      });
    }
  }
}
function updateResizeHandlerStates(action, event) {
  registeredResizeHandlers.forEach(data => {
    const {
      setResizeHandlerState
    } = data;
    const isActive = intersectingHandles.includes(data);
    setResizeHandlerState(action, isActive, event);
  });
}

function useForceUpdate() {
  const [_, setCount] = useState(0);
  return useCallback(() => setCount(prevCount => prevCount + 1), []);
}

function assert(expectedCondition, message) {
  if (!expectedCondition) {
    console.error(message);
    throw Error(message);
  }
}

const PRECISION = 10;

function fuzzyCompareNumbers(actual, expected, fractionDigits = PRECISION) {
  if (actual.toFixed(fractionDigits) === expected.toFixed(fractionDigits)) {
    return 0;
  } else {
    return actual > expected ? 1 : -1;
  }
}
function fuzzyNumbersEqual$1(actual, expected, fractionDigits = PRECISION) {
  return fuzzyCompareNumbers(actual, expected, fractionDigits) === 0;
}

function fuzzyNumbersEqual(actual, expected, fractionDigits) {
  return fuzzyCompareNumbers(actual, expected, fractionDigits) === 0;
}

function fuzzyLayoutsEqual(actual, expected, fractionDigits) {
  if (actual.length !== expected.length) {
    return false;
  }
  for (let index = 0; index < actual.length; index++) {
    const actualSize = actual[index];
    const expectedSize = expected[index];
    if (!fuzzyNumbersEqual(actualSize, expectedSize, fractionDigits)) {
      return false;
    }
  }
  return true;
}

// Panel size must be in percentages; pixel values should be pre-converted
function resizePanel({
  panelConstraints: panelConstraintsArray,
  panelIndex,
  size
}) {
  const panelConstraints = panelConstraintsArray[panelIndex];
  assert(panelConstraints != null, `Panel constraints not found for index ${panelIndex}`);
  let {
    collapsedSize = 0,
    collapsible,
    maxSize = 100,
    minSize = 0
  } = panelConstraints;
  if (fuzzyCompareNumbers(size, minSize) < 0) {
    if (collapsible) {
      // Collapsible panels should snap closed or open only once they cross the halfway point between collapsed and min size.
      const halfwayPoint = (collapsedSize + minSize) / 2;
      if (fuzzyCompareNumbers(size, halfwayPoint) < 0) {
        size = collapsedSize;
      } else {
        size = minSize;
      }
    } else {
      size = minSize;
    }
  }
  size = Math.min(maxSize, size);
  size = parseFloat(size.toFixed(PRECISION));
  return size;
}

// All units must be in percentages; pixel values should be pre-converted
function adjustLayoutByDelta({
  delta,
  initialLayout,
  panelConstraints: panelConstraintsArray,
  pivotIndices,
  prevLayout,
  trigger
}) {
  if (fuzzyNumbersEqual(delta, 0)) {
    return initialLayout;
  }
  const nextLayout = [...initialLayout];
  const [firstPivotIndex, secondPivotIndex] = pivotIndices;
  assert(firstPivotIndex != null, "Invalid first pivot index");
  assert(secondPivotIndex != null, "Invalid second pivot index");
  let deltaApplied = 0;

  // const DEBUG = [];
  // DEBUG.push(`adjustLayoutByDelta()`);
  // DEBUG.push(`  initialLayout: ${initialLayout.join(", ")}`);
  // DEBUG.push(`  prevLayout: ${prevLayout.join(", ")}`);
  // DEBUG.push(`  delta: ${delta}`);
  // DEBUG.push(`  pivotIndices: ${pivotIndices.join(", ")}`);
  // DEBUG.push(`  trigger: ${trigger}`);
  // DEBUG.push("");

  // A resizing panel affects the panels before or after it.
  //
  // A negative delta means the panel(s) immediately after the resize handle should grow/expand by decreasing its offset.
  // Other panels may also need to shrink/contract (and shift) to make room, depending on the min weights.
  //
  // A positive delta means the panel(s) immediately before the resize handle should "expand".
  // This is accomplished by shrinking/contracting (and shifting) one or more of the panels after the resize handle.

  {
    // If this is a resize triggered by a keyboard event, our logic for expanding/collapsing is different.
    // We no longer check the halfway threshold because this may prevent the panel from expanding at all.
    if (trigger === "keyboard") {
      {
        // Check if we should expand a collapsed panel
        const index = delta < 0 ? secondPivotIndex : firstPivotIndex;
        const panelConstraints = panelConstraintsArray[index];
        assert(panelConstraints, `Panel constraints not found for index ${index}`);
        const {
          collapsedSize = 0,
          collapsible,
          minSize = 0
        } = panelConstraints;

        // DEBUG.push(`edge case check 1: ${index}`);
        // DEBUG.push(`  -> collapsible? ${collapsible}`);
        if (collapsible) {
          const prevSize = initialLayout[index];
          assert(prevSize != null, `Previous layout not found for panel index ${index}`);
          if (fuzzyNumbersEqual(prevSize, collapsedSize)) {
            const localDelta = minSize - prevSize;
            // DEBUG.push(`  -> expand delta: ${localDelta}`);

            if (fuzzyCompareNumbers(localDelta, Math.abs(delta)) > 0) {
              delta = delta < 0 ? 0 - localDelta : localDelta;
              // DEBUG.push(`  -> delta: ${delta}`);
            }
          }
        }
      }

      {
        // Check if we should collapse a panel at its minimum size
        const index = delta < 0 ? firstPivotIndex : secondPivotIndex;
        const panelConstraints = panelConstraintsArray[index];
        assert(panelConstraints, `No panel constraints found for index ${index}`);
        const {
          collapsedSize = 0,
          collapsible,
          minSize = 0
        } = panelConstraints;

        // DEBUG.push(`edge case check 2: ${index}`);
        // DEBUG.push(`  -> collapsible? ${collapsible}`);
        if (collapsible) {
          const prevSize = initialLayout[index];
          assert(prevSize != null, `Previous layout not found for panel index ${index}`);
          if (fuzzyNumbersEqual(prevSize, minSize)) {
            const localDelta = prevSize - collapsedSize;
            // DEBUG.push(`  -> expand delta: ${localDelta}`);

            if (fuzzyCompareNumbers(localDelta, Math.abs(delta)) > 0) {
              delta = delta < 0 ? 0 - localDelta : localDelta;
              // DEBUG.push(`  -> delta: ${delta}`);
            }
          }
        }
      }
    }
    // DEBUG.push("");
  }

  {
    // Pre-calculate max available delta in the opposite direction of our pivot.
    // This will be the maximum amount we're allowed to expand/contract the panels in the primary direction.
    // If this amount is less than the requested delta, adjust the requested delta.
    // If this amount is greater than the requested delta, that's useful information too–
    // as an expanding panel might change from collapsed to min size.

    const increment = delta < 0 ? 1 : -1;
    let index = delta < 0 ? secondPivotIndex : firstPivotIndex;
    let maxAvailableDelta = 0;

    // DEBUG.push("pre calc...");
    while (true) {
      const prevSize = initialLayout[index];
      assert(prevSize != null, `Previous layout not found for panel index ${index}`);
      const maxSafeSize = resizePanel({
        panelConstraints: panelConstraintsArray,
        panelIndex: index,
        size: 100
      });
      const delta = maxSafeSize - prevSize;
      // DEBUG.push(`  ${index}: ${prevSize} -> ${maxSafeSize}`);

      maxAvailableDelta += delta;
      index += increment;
      if (index < 0 || index >= panelConstraintsArray.length) {
        break;
      }
    }

    // DEBUG.push(`  -> max available delta: ${maxAvailableDelta}`);
    const minAbsDelta = Math.min(Math.abs(delta), Math.abs(maxAvailableDelta));
    delta = delta < 0 ? 0 - minAbsDelta : minAbsDelta;
    // DEBUG.push(`  -> adjusted delta: ${delta}`);
    // DEBUG.push("");
  }

  {
    // Delta added to a panel needs to be subtracted from other panels (within the constraints that those panels allow).

    const pivotIndex = delta < 0 ? firstPivotIndex : secondPivotIndex;
    let index = pivotIndex;
    while (index >= 0 && index < panelConstraintsArray.length) {
      const deltaRemaining = Math.abs(delta) - Math.abs(deltaApplied);
      const prevSize = initialLayout[index];
      assert(prevSize != null, `Previous layout not found for panel index ${index}`);
      const unsafeSize = prevSize - deltaRemaining;
      const safeSize = resizePanel({
        panelConstraints: panelConstraintsArray,
        panelIndex: index,
        size: unsafeSize
      });
      if (!fuzzyNumbersEqual(prevSize, safeSize)) {
        deltaApplied += prevSize - safeSize;
        nextLayout[index] = safeSize;
        if (deltaApplied.toPrecision(3).localeCompare(Math.abs(delta).toPrecision(3), undefined, {
          numeric: true
        }) >= 0) {
          break;
        }
      }
      if (delta < 0) {
        index--;
      } else {
        index++;
      }
    }
  }
  // DEBUG.push(`after 1: ${nextLayout.join(", ")}`);
  // DEBUG.push(`  deltaApplied: ${deltaApplied}`);
  // DEBUG.push("");

  // If we were unable to resize any of the panels panels, return the previous state.
  // This will essentially bailout and ignore e.g. drags past a panel's boundaries
  if (fuzzyLayoutsEqual(prevLayout, nextLayout)) {
    // DEBUG.push(`bailout to previous layout: ${prevLayout.join(", ")}`);
    // console.log(DEBUG.join("\n"));

    return prevLayout;
  }
  {
    // Now distribute the applied delta to the panels in the other direction
    const pivotIndex = delta < 0 ? secondPivotIndex : firstPivotIndex;
    const prevSize = initialLayout[pivotIndex];
    assert(prevSize != null, `Previous layout not found for panel index ${pivotIndex}`);
    const unsafeSize = prevSize + deltaApplied;
    const safeSize = resizePanel({
      panelConstraints: panelConstraintsArray,
      panelIndex: pivotIndex,
      size: unsafeSize
    });

    // Adjust the pivot panel before, but only by the amount that surrounding panels were able to shrink/contract.
    nextLayout[pivotIndex] = safeSize;

    // Edge case where expanding or contracting one panel caused another one to change collapsed state
    if (!fuzzyNumbersEqual(safeSize, unsafeSize)) {
      let deltaRemaining = unsafeSize - safeSize;
      const pivotIndex = delta < 0 ? secondPivotIndex : firstPivotIndex;
      let index = pivotIndex;
      while (index >= 0 && index < panelConstraintsArray.length) {
        const prevSize = nextLayout[index];
        assert(prevSize != null, `Previous layout not found for panel index ${index}`);
        const unsafeSize = prevSize + deltaRemaining;
        const safeSize = resizePanel({
          panelConstraints: panelConstraintsArray,
          panelIndex: index,
          size: unsafeSize
        });
        if (!fuzzyNumbersEqual(prevSize, safeSize)) {
          deltaRemaining -= safeSize - prevSize;
          nextLayout[index] = safeSize;
        }
        if (fuzzyNumbersEqual(deltaRemaining, 0)) {
          break;
        }
        if (delta > 0) {
          index--;
        } else {
          index++;
        }
      }
    }
  }
  // DEBUG.push(`after 2: ${nextLayout.join(", ")}`);
  // DEBUG.push(`  deltaApplied: ${deltaApplied}`);
  // DEBUG.push("");

  const totalSize = nextLayout.reduce((total, size) => size + total, 0);
  // DEBUG.push(`total size: ${totalSize}`);

  // If our new layout doesn't add up to 100%, that means the requested delta can't be applied
  // In that case, fall back to our most recent valid layout
  if (!fuzzyNumbersEqual(totalSize, 100)) {
    // DEBUG.push(`bailout to previous layout: ${prevLayout.join(", ")}`);
    // console.log(DEBUG.join("\n"));

    return prevLayout;
  }

  // console.log(DEBUG.join("\n"));
  return nextLayout;
}

function getResizeHandleElementsForGroup(groupId, scope = document) {
  return Array.from(scope.querySelectorAll(`[data-panel-resize-handle-id][data-panel-group-id="${groupId}"]`));
}

function getResizeHandleElementIndex(groupId, id, scope = document) {
  const handles = getResizeHandleElementsForGroup(groupId, scope);
  const index = handles.findIndex(handle => handle.getAttribute("data-panel-resize-handle-id") === id);
  return index !== null && index !== void 0 ? index : null;
}

function determinePivotIndices(groupId, dragHandleId, panelGroupElement) {
  const index = getResizeHandleElementIndex(groupId, dragHandleId, panelGroupElement);
  return index != null ? [index, index + 1] : [-1, -1];
}

function getPanelGroupElement(id, rootElement = document) {
  var _dataset;
  //If the root element is the PanelGroup
  if (rootElement instanceof HTMLElement && (rootElement === null || rootElement === void 0 ? void 0 : (_dataset = rootElement.dataset) === null || _dataset === void 0 ? void 0 : _dataset.panelGroupId) == id) {
    return rootElement;
  }

  //Else query children
  const element = rootElement.querySelector(`[data-panel-group][data-panel-group-id="${id}"]`);
  if (element) {
    return element;
  }
  return null;
}

function getResizeHandleElement(id, scope = document) {
  const element = scope.querySelector(`[data-panel-resize-handle-id="${id}"]`);
  if (element) {
    return element;
  }
  return null;
}

function getResizeHandlePanelIds(groupId, handleId, panelsArray, scope = document) {
  var _panelsArray$index$id, _panelsArray$index, _panelsArray$id, _panelsArray;
  const handle = getResizeHandleElement(handleId, scope);
  const handles = getResizeHandleElementsForGroup(groupId, scope);
  const index = handle ? handles.indexOf(handle) : -1;
  const idBefore = (_panelsArray$index$id = (_panelsArray$index = panelsArray[index]) === null || _panelsArray$index === void 0 ? void 0 : _panelsArray$index.id) !== null && _panelsArray$index$id !== void 0 ? _panelsArray$index$id : null;
  const idAfter = (_panelsArray$id = (_panelsArray = panelsArray[index + 1]) === null || _panelsArray === void 0 ? void 0 : _panelsArray.id) !== null && _panelsArray$id !== void 0 ? _panelsArray$id : null;
  return [idBefore, idAfter];
}

// https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/

function useWindowSplitterPanelGroupBehavior({
  committedValuesRef,
  eagerValuesRef,
  groupId,
  layout,
  panelDataArray,
  panelGroupElement,
  setLayout
}) {
  useRef({
    didWarnAboutMissingResizeHandle: false
  });
  useEffect(() => {
    if (!panelGroupElement) {
      return;
    }
    const eagerValues = eagerValuesRef.current;
    assert(eagerValues, `Eager values not found`);
    const {
      panelDataArray
    } = eagerValues;
    const groupElement = getPanelGroupElement(groupId, panelGroupElement);
    assert(groupElement != null, `No group found for id "${groupId}"`);
    const handles = getResizeHandleElementsForGroup(groupId, panelGroupElement);
    assert(handles, `No resize handles found for group id "${groupId}"`);
    const cleanupFunctions = handles.map(handle => {
      const handleId = handle.getAttribute("data-panel-resize-handle-id");
      assert(handleId, `Resize handle element has no handle id attribute`);
      const [idBefore, idAfter] = getResizeHandlePanelIds(groupId, handleId, panelDataArray, panelGroupElement);
      if (idBefore == null || idAfter == null) {
        return () => {};
      }
      const onKeyDown = event => {
        if (event.defaultPrevented) {
          return;
        }
        switch (event.key) {
          case "Enter":
            {
              event.preventDefault();
              const index = panelDataArray.findIndex(panelData => panelData.id === idBefore);
              if (index >= 0) {
                const panelData = panelDataArray[index];
                assert(panelData, `No panel data found for index ${index}`);
                const size = layout[index];
                const {
                  collapsedSize = 0,
                  collapsible,
                  minSize = 0
                } = panelData.constraints;
                if (size != null && collapsible) {
                  const nextLayout = adjustLayoutByDelta({
                    delta: fuzzyNumbersEqual(size, collapsedSize) ? minSize - collapsedSize : collapsedSize - size,
                    initialLayout: layout,
                    panelConstraints: panelDataArray.map(panelData => panelData.constraints),
                    pivotIndices: determinePivotIndices(groupId, handleId, panelGroupElement),
                    prevLayout: layout,
                    trigger: "keyboard"
                  });
                  if (layout !== nextLayout) {
                    setLayout(nextLayout);
                  }
                }
              }
              break;
            }
        }
      };
      handle.addEventListener("keydown", onKeyDown);
      return () => {
        handle.removeEventListener("keydown", onKeyDown);
      };
    });
    return () => {
      cleanupFunctions.forEach(cleanupFunction => cleanupFunction());
    };
  }, [panelGroupElement, committedValuesRef, eagerValuesRef, groupId, layout, panelDataArray, setLayout]);
}

function areEqual(arrayA, arrayB) {
  if (arrayA.length !== arrayB.length) {
    return false;
  }
  for (let index = 0; index < arrayA.length; index++) {
    if (arrayA[index] !== arrayB[index]) {
      return false;
    }
  }
  return true;
}

function getResizeEventCursorPosition(direction, event) {
  const isHorizontal = direction === "horizontal";
  const {
    x,
    y
  } = getResizeEventCoordinates(event);
  return isHorizontal ? x : y;
}

function calculateDragOffsetPercentage(event, dragHandleId, direction, initialDragState, panelGroupElement) {
  const isHorizontal = direction === "horizontal";
  const handleElement = getResizeHandleElement(dragHandleId, panelGroupElement);
  assert(handleElement, `No resize handle element found for id "${dragHandleId}"`);
  const groupId = handleElement.getAttribute("data-panel-group-id");
  assert(groupId, `Resize handle element has no group id attribute`);
  let {
    initialCursorPosition
  } = initialDragState;
  const cursorPosition = getResizeEventCursorPosition(direction, event);
  const groupElement = getPanelGroupElement(groupId, panelGroupElement);
  assert(groupElement, `No group element found for id "${groupId}"`);
  const groupRect = groupElement.getBoundingClientRect();
  const groupSizeInPixels = isHorizontal ? groupRect.width : groupRect.height;
  const offsetPixels = cursorPosition - initialCursorPosition;
  const offsetPercentage = offsetPixels / groupSizeInPixels * 100;
  return offsetPercentage;
}

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX
function calculateDeltaPercentage(event, dragHandleId, direction, initialDragState, keyboardResizeBy, panelGroupElement) {
  if (isKeyDown(event)) {
    const isHorizontal = direction === "horizontal";
    let delta = 0;
    if (event.shiftKey) {
      delta = 100;
    } else if (keyboardResizeBy != null) {
      delta = keyboardResizeBy;
    } else {
      delta = 10;
    }
    let movement = 0;
    switch (event.key) {
      case "ArrowDown":
        movement = isHorizontal ? 0 : delta;
        break;
      case "ArrowLeft":
        movement = isHorizontal ? -delta : 0;
        break;
      case "ArrowRight":
        movement = isHorizontal ? delta : 0;
        break;
      case "ArrowUp":
        movement = isHorizontal ? 0 : -delta;
        break;
      case "End":
        movement = 100;
        break;
      case "Home":
        movement = -100;
        break;
    }
    return movement;
  } else {
    if (initialDragState == null) {
      return 0;
    }
    return calculateDragOffsetPercentage(event, dragHandleId, direction, initialDragState, panelGroupElement);
  }
}

// Layout should be pre-converted into percentages
function callPanelCallbacks(panelsArray, layout, panelIdToLastNotifiedSizeMap) {
  layout.forEach((size, index) => {
    const panelData = panelsArray[index];
    assert(panelData, `Panel data not found for index ${index}`);
    const {
      callbacks,
      constraints,
      id: panelId
    } = panelData;
    const {
      collapsedSize = 0,
      collapsible
    } = constraints;
    const lastNotifiedSize = panelIdToLastNotifiedSizeMap[panelId];
    if (lastNotifiedSize == null || size !== lastNotifiedSize) {
      panelIdToLastNotifiedSizeMap[panelId] = size;
      const {
        onCollapse,
        onExpand,
        onResize
      } = callbacks;
      if (onResize) {
        onResize(size, lastNotifiedSize);
      }
      if (collapsible && (onCollapse || onExpand)) {
        if (onExpand && (lastNotifiedSize == null || fuzzyNumbersEqual$1(lastNotifiedSize, collapsedSize)) && !fuzzyNumbersEqual$1(size, collapsedSize)) {
          onExpand();
        }
        if (onCollapse && (lastNotifiedSize == null || !fuzzyNumbersEqual$1(lastNotifiedSize, collapsedSize)) && fuzzyNumbersEqual$1(size, collapsedSize)) {
          onCollapse();
        }
      }
    }
  });
}

function compareLayouts(a, b) {
  if (a.length !== b.length) {
    return false;
  } else {
    for (let index = 0; index < a.length; index++) {
      if (a[index] != b[index]) {
        return false;
      }
    }
  }
  return true;
}

// This method returns a number between 1 and 100 representing

// the % of the group's overall space this panel should occupy.
function computePanelFlexBoxStyle({
  defaultSize,
  dragState,
  layout,
  panelData,
  panelIndex,
  precision = 3
}) {
  const size = layout[panelIndex];
  let flexGrow;
  if (size == null) {
    // Initial render (before panels have registered themselves)
    // In order to support server rendering, fall back to default size if provided
    flexGrow = defaultSize != undefined ? defaultSize.toPrecision(precision) : "1";
  } else if (panelData.length === 1) {
    // Special case: Single panel group should always fill full width/height
    flexGrow = "1";
  } else {
    flexGrow = size.toPrecision(precision);
  }
  return {
    flexBasis: 0,
    flexGrow,
    flexShrink: 1,
    // Without this, Panel sizes may be unintentionally overridden by their content
    overflow: "hidden",
    // Disable pointer events inside of a panel during resize
    // This avoid edge cases like nested iframes
    pointerEvents: dragState !== null ? "none" : undefined
  };
}

function debounce(callback, durationMs = 10) {
  let timeoutId = null;
  let callable = (...args) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      callback(...args);
    }, durationMs);
  };
  return callable;
}

// PanelGroup might be rendering in a server-side environment where localStorage is not available
// or on a browser with cookies/storage disabled.
// In either case, this function avoids accessing localStorage until needed,
// and avoids throwing user-visible errors.
function initializeDefaultStorage(storageObject) {
  try {
    if (typeof localStorage !== "undefined") {
      // Bypass this check for future calls
      storageObject.getItem = name => {
        return localStorage.getItem(name);
      };
      storageObject.setItem = (name, value) => {
        localStorage.setItem(name, value);
      };
    } else {
      throw new Error("localStorage not supported in this environment");
    }
  } catch (error) {
    console.error(error);
    storageObject.getItem = () => null;
    storageObject.setItem = () => {};
  }
}

function getPanelGroupKey(autoSaveId) {
  return `react-resizable-panels:${autoSaveId}`;
}

// Note that Panel ids might be user-provided (stable) or useId generated (non-deterministic)
// so they should not be used as part of the serialization key.
// Using the min/max size attributes should work well enough as a backup.
// Pre-sorting by minSize allows remembering layouts even if panels are re-ordered/dragged.
function getPanelKey(panels) {
  return panels.map(panel => {
    const {
      constraints,
      id,
      idIsFromProps,
      order
    } = panel;
    if (idIsFromProps) {
      return id;
    } else {
      return order ? `${order}:${JSON.stringify(constraints)}` : JSON.stringify(constraints);
    }
  }).sort((a, b) => a.localeCompare(b)).join(",");
}
function loadSerializedPanelGroupState(autoSaveId, storage) {
  try {
    const panelGroupKey = getPanelGroupKey(autoSaveId);
    const serialized = storage.getItem(panelGroupKey);
    if (serialized) {
      const parsed = JSON.parse(serialized);
      if (typeof parsed === "object" && parsed != null) {
        return parsed;
      }
    }
  } catch (error) {}
  return null;
}
function savePanelGroupState(autoSaveId, panels, panelSizesBeforeCollapse, sizes, storage) {
  var _loadSerializedPanelG2;
  const panelGroupKey = getPanelGroupKey(autoSaveId);
  const panelKey = getPanelKey(panels);
  const state = (_loadSerializedPanelG2 = loadSerializedPanelGroupState(autoSaveId, storage)) !== null && _loadSerializedPanelG2 !== void 0 ? _loadSerializedPanelG2 : {};
  state[panelKey] = {
    expandToSizes: Object.fromEntries(panelSizesBeforeCollapse.entries()),
    layout: sizes
  };
  try {
    storage.setItem(panelGroupKey, JSON.stringify(state));
  } catch (error) {
    console.error(error);
  }
}

// All units must be in percentages; pixel values should be pre-converted
function validatePanelGroupLayout({
  layout: prevLayout,
  panelConstraints
}) {
  const nextLayout = [...prevLayout];
  const nextLayoutTotalSize = nextLayout.reduce((accumulated, current) => accumulated + current, 0);

  // Validate layout expectations
  if (nextLayout.length !== panelConstraints.length) {
    throw Error(`Invalid ${panelConstraints.length} panel layout: ${nextLayout.map(size => `${size}%`).join(", ")}`);
  } else if (!fuzzyNumbersEqual(nextLayoutTotalSize, 100) && nextLayout.length > 0) {
    for (let index = 0; index < panelConstraints.length; index++) {
      const unsafeSize = nextLayout[index];
      assert(unsafeSize != null, `No layout data found for index ${index}`);
      const safeSize = 100 / nextLayoutTotalSize * unsafeSize;
      nextLayout[index] = safeSize;
    }
  }
  let remainingSize = 0;

  // First pass: Validate the proposed layout given each panel's constraints
  for (let index = 0; index < panelConstraints.length; index++) {
    const unsafeSize = nextLayout[index];
    assert(unsafeSize != null, `No layout data found for index ${index}`);
    const safeSize = resizePanel({
      panelConstraints,
      panelIndex: index,
      size: unsafeSize
    });
    if (unsafeSize != safeSize) {
      remainingSize += unsafeSize - safeSize;
      nextLayout[index] = safeSize;
    }
  }

  // If there is additional, left over space, assign it to any panel(s) that permits it
  // (It's not worth taking multiple additional passes to evenly distribute)
  if (!fuzzyNumbersEqual(remainingSize, 0)) {
    for (let index = 0; index < panelConstraints.length; index++) {
      const prevSize = nextLayout[index];
      assert(prevSize != null, `No layout data found for index ${index}`);
      const unsafeSize = prevSize + remainingSize;
      const safeSize = resizePanel({
        panelConstraints,
        panelIndex: index,
        size: unsafeSize
      });
      if (prevSize !== safeSize) {
        remainingSize -= safeSize - prevSize;
        nextLayout[index] = safeSize;

        // Once we've used up the remainder, bail
        if (fuzzyNumbersEqual(remainingSize, 0)) {
          break;
        }
      }
    }
  }
  return nextLayout;
}

const LOCAL_STORAGE_DEBOUNCE_INTERVAL = 100;
const defaultStorage = {
  getItem: name => {
    initializeDefaultStorage(defaultStorage);
    return defaultStorage.getItem(name);
  },
  setItem: (name, value) => {
    initializeDefaultStorage(defaultStorage);
    defaultStorage.setItem(name, value);
  }
};
const debounceMap = {};
function PanelGroupWithForwardedRef({
  autoSaveId = null,
  children,
  className: classNameFromProps = "",
  direction,
  forwardedRef,
  id: idFromProps = null,
  onLayout = null,
  keyboardResizeBy = null,
  storage = defaultStorage,
  style: styleFromProps,
  tagName: Type = "div",
  ...rest
}) {
  const groupId = useUniqueId(idFromProps);
  const panelGroupElementRef = useRef(null);
  const [dragState, setDragState] = useState(null);
  const [layout, setLayout] = useState([]);
  const forceUpdate = useForceUpdate();
  const panelIdToLastNotifiedSizeMapRef = useRef({});
  const panelSizeBeforeCollapseRef = useRef(new Map());
  const prevDeltaRef = useRef(0);
  const committedValuesRef = useRef({
    autoSaveId,
    direction,
    dragState,
    id: groupId,
    keyboardResizeBy,
    onLayout,
    storage
  });
  const eagerValuesRef = useRef({
    layout,
    panelDataArray: [],
    panelDataArrayChanged: false
  });
  useRef({
    didLogIdAndOrderWarning: false,
    didLogPanelConstraintsWarning: false,
    prevPanelIds: []
  });
  useImperativeHandle(forwardedRef, () => ({
    getId: () => committedValuesRef.current.id,
    getLayout: () => {
      const {
        layout
      } = eagerValuesRef.current;
      return layout;
    },
    setLayout: unsafeLayout => {
      const {
        onLayout
      } = committedValuesRef.current;
      const {
        layout: prevLayout,
        panelDataArray
      } = eagerValuesRef.current;
      const safeLayout = validatePanelGroupLayout({
        layout: unsafeLayout,
        panelConstraints: panelDataArray.map(panelData => panelData.constraints)
      });
      if (!areEqual(prevLayout, safeLayout)) {
        setLayout(safeLayout);
        eagerValuesRef.current.layout = safeLayout;
        if (onLayout) {
          onLayout(safeLayout);
        }
        callPanelCallbacks(panelDataArray, safeLayout, panelIdToLastNotifiedSizeMapRef.current);
      }
    }
  }), []);
  useWindowSplitterPanelGroupBehavior({
    committedValuesRef,
    eagerValuesRef,
    groupId,
    layout,
    panelDataArray: eagerValuesRef.current.panelDataArray,
    setLayout,
    panelGroupElement: panelGroupElementRef.current
  });
  useEffect(() => {
    const {
      panelDataArray
    } = eagerValuesRef.current;

    // If this panel has been configured to persist sizing information, save sizes to local storage.
    if (autoSaveId) {
      if (layout.length === 0 || layout.length !== panelDataArray.length) {
        return;
      }
      let debouncedSave = debounceMap[autoSaveId];

      // Limit the frequency of localStorage updates.
      if (debouncedSave == null) {
        debouncedSave = debounce(savePanelGroupState, LOCAL_STORAGE_DEBOUNCE_INTERVAL);
        debounceMap[autoSaveId] = debouncedSave;
      }

      // Clone mutable data before passing to the debounced function,
      // else we run the risk of saving an incorrect combination of mutable and immutable values to state.
      const clonedPanelDataArray = [...panelDataArray];
      const clonedPanelSizesBeforeCollapse = new Map(panelSizeBeforeCollapseRef.current);
      debouncedSave(autoSaveId, clonedPanelDataArray, clonedPanelSizesBeforeCollapse, layout, storage);
    }
  }, [autoSaveId, layout, storage]);

  // DEV warnings
  useEffect(() => {
  });

  // External APIs are safe to memoize via committed values ref
  const collapsePanel = useCallback(panelData => {
    const {
      onLayout
    } = committedValuesRef.current;
    const {
      layout: prevLayout,
      panelDataArray
    } = eagerValuesRef.current;
    if (panelData.constraints.collapsible) {
      const panelConstraintsArray = panelDataArray.map(panelData => panelData.constraints);
      const {
        collapsedSize = 0,
        panelSize,
        pivotIndices
      } = panelDataHelper(panelDataArray, panelData, prevLayout);
      assert(panelSize != null, `Panel size not found for panel "${panelData.id}"`);
      if (!fuzzyNumbersEqual$1(panelSize, collapsedSize)) {
        // Store size before collapse;
        // This is the size that gets restored if the expand() API is used.
        panelSizeBeforeCollapseRef.current.set(panelData.id, panelSize);
        const isLastPanel = findPanelDataIndex(panelDataArray, panelData) === panelDataArray.length - 1;
        const delta = isLastPanel ? panelSize - collapsedSize : collapsedSize - panelSize;
        const nextLayout = adjustLayoutByDelta({
          delta,
          initialLayout: prevLayout,
          panelConstraints: panelConstraintsArray,
          pivotIndices,
          prevLayout,
          trigger: "imperative-api"
        });
        if (!compareLayouts(prevLayout, nextLayout)) {
          setLayout(nextLayout);
          eagerValuesRef.current.layout = nextLayout;
          if (onLayout) {
            onLayout(nextLayout);
          }
          callPanelCallbacks(panelDataArray, nextLayout, panelIdToLastNotifiedSizeMapRef.current);
        }
      }
    }
  }, []);

  // External APIs are safe to memoize via committed values ref
  const expandPanel = useCallback((panelData, minSizeOverride) => {
    const {
      onLayout
    } = committedValuesRef.current;
    const {
      layout: prevLayout,
      panelDataArray
    } = eagerValuesRef.current;
    if (panelData.constraints.collapsible) {
      const panelConstraintsArray = panelDataArray.map(panelData => panelData.constraints);
      const {
        collapsedSize = 0,
        panelSize = 0,
        minSize: minSizeFromProps = 0,
        pivotIndices
      } = panelDataHelper(panelDataArray, panelData, prevLayout);
      const minSize = minSizeOverride !== null && minSizeOverride !== void 0 ? minSizeOverride : minSizeFromProps;
      if (fuzzyNumbersEqual$1(panelSize, collapsedSize)) {
        // Restore this panel to the size it was before it was collapsed, if possible.
        const prevPanelSize = panelSizeBeforeCollapseRef.current.get(panelData.id);
        const baseSize = prevPanelSize != null && prevPanelSize >= minSize ? prevPanelSize : minSize;
        const isLastPanel = findPanelDataIndex(panelDataArray, panelData) === panelDataArray.length - 1;
        const delta = isLastPanel ? panelSize - baseSize : baseSize - panelSize;
        const nextLayout = adjustLayoutByDelta({
          delta,
          initialLayout: prevLayout,
          panelConstraints: panelConstraintsArray,
          pivotIndices,
          prevLayout,
          trigger: "imperative-api"
        });
        if (!compareLayouts(prevLayout, nextLayout)) {
          setLayout(nextLayout);
          eagerValuesRef.current.layout = nextLayout;
          if (onLayout) {
            onLayout(nextLayout);
          }
          callPanelCallbacks(panelDataArray, nextLayout, panelIdToLastNotifiedSizeMapRef.current);
        }
      }
    }
  }, []);

  // External APIs are safe to memoize via committed values ref
  const getPanelSize = useCallback(panelData => {
    const {
      layout,
      panelDataArray
    } = eagerValuesRef.current;
    const {
      panelSize
    } = panelDataHelper(panelDataArray, panelData, layout);
    assert(panelSize != null, `Panel size not found for panel "${panelData.id}"`);
    return panelSize;
  }, []);

  // This API should never read from committedValuesRef
  const getPanelStyle = useCallback((panelData, defaultSize) => {
    const {
      panelDataArray
    } = eagerValuesRef.current;
    const panelIndex = findPanelDataIndex(panelDataArray, panelData);
    return computePanelFlexBoxStyle({
      defaultSize,
      dragState,
      layout,
      panelData: panelDataArray,
      panelIndex
    });
  }, [dragState, layout]);

  // External APIs are safe to memoize via committed values ref
  const isPanelCollapsed = useCallback(panelData => {
    const {
      layout,
      panelDataArray
    } = eagerValuesRef.current;
    const {
      collapsedSize = 0,
      collapsible,
      panelSize
    } = panelDataHelper(panelDataArray, panelData, layout);
    assert(panelSize != null, `Panel size not found for panel "${panelData.id}"`);
    return collapsible === true && fuzzyNumbersEqual$1(panelSize, collapsedSize);
  }, []);

  // External APIs are safe to memoize via committed values ref
  const isPanelExpanded = useCallback(panelData => {
    const {
      layout,
      panelDataArray
    } = eagerValuesRef.current;
    const {
      collapsedSize = 0,
      collapsible,
      panelSize
    } = panelDataHelper(panelDataArray, panelData, layout);
    assert(panelSize != null, `Panel size not found for panel "${panelData.id}"`);
    return !collapsible || fuzzyCompareNumbers(panelSize, collapsedSize) > 0;
  }, []);
  const registerPanel = useCallback(panelData => {
    const {
      panelDataArray
    } = eagerValuesRef.current;
    panelDataArray.push(panelData);
    panelDataArray.sort((panelA, panelB) => {
      const orderA = panelA.order;
      const orderB = panelB.order;
      if (orderA == null && orderB == null) {
        return 0;
      } else if (orderA == null) {
        return -1;
      } else if (orderB == null) {
        return 1;
      } else {
        return orderA - orderB;
      }
    });
    eagerValuesRef.current.panelDataArrayChanged = true;
    forceUpdate();
  }, [forceUpdate]);
  const registerResizeHandle = useCallback(dragHandleId => {
    let isRTL = false;
    const panelGroupElement = panelGroupElementRef.current;
    if (panelGroupElement) {
      const style = window.getComputedStyle(panelGroupElement, null);
      if (style.getPropertyValue("direction") === "rtl") {
        isRTL = true;
      }
    }
    return function resizeHandler(event) {
      event.preventDefault();
      const panelGroupElement = panelGroupElementRef.current;
      if (!panelGroupElement) {
        return () => null;
      }
      const {
        direction,
        dragState,
        id: groupId,
        keyboardResizeBy,
        onLayout
      } = committedValuesRef.current;
      const {
        layout: prevLayout,
        panelDataArray
      } = eagerValuesRef.current;
      const {
        initialLayout
      } = dragState !== null && dragState !== void 0 ? dragState : {};
      const pivotIndices = determinePivotIndices(groupId, dragHandleId, panelGroupElement);
      let delta = calculateDeltaPercentage(event, dragHandleId, direction, dragState, keyboardResizeBy, panelGroupElement);
      const isHorizontal = direction === "horizontal";
      if (isHorizontal && isRTL) {
        delta = -delta;
      }
      const panelConstraints = panelDataArray.map(panelData => panelData.constraints);
      const nextLayout = adjustLayoutByDelta({
        delta,
        initialLayout: initialLayout !== null && initialLayout !== void 0 ? initialLayout : prevLayout,
        panelConstraints,
        pivotIndices,
        prevLayout,
        trigger: isKeyDown(event) ? "keyboard" : "mouse-or-touch"
      });
      const layoutChanged = !compareLayouts(prevLayout, nextLayout);

      // Only update the cursor for layout changes triggered by touch/mouse events (not keyboard)
      // Update the cursor even if the layout hasn't changed (we may need to show an invalid cursor state)
      if (isPointerEvent(event) || isMouseEvent(event)) {
        // Watch for multiple subsequent deltas; this might occur for tiny cursor movements.
        // In this case, Panel sizes might not change–
        // but updating cursor in this scenario would cause a flicker.
        if (prevDeltaRef.current != delta) {
          prevDeltaRef.current = delta;
          if (!layoutChanged && delta !== 0) {
            // If the pointer has moved too far to resize the panel any further, note this so we can update the cursor.
            // This mimics VS Code behavior.
            if (isHorizontal) {
              reportConstraintsViolation(dragHandleId, delta < 0 ? EXCEEDED_HORIZONTAL_MIN : EXCEEDED_HORIZONTAL_MAX);
            } else {
              reportConstraintsViolation(dragHandleId, delta < 0 ? EXCEEDED_VERTICAL_MIN : EXCEEDED_VERTICAL_MAX);
            }
          } else {
            reportConstraintsViolation(dragHandleId, 0);
          }
        }
      }
      if (layoutChanged) {
        setLayout(nextLayout);
        eagerValuesRef.current.layout = nextLayout;
        if (onLayout) {
          onLayout(nextLayout);
        }
        callPanelCallbacks(panelDataArray, nextLayout, panelIdToLastNotifiedSizeMapRef.current);
      }
    };
  }, []);

  // External APIs are safe to memoize via committed values ref
  const resizePanel = useCallback((panelData, unsafePanelSize) => {
    const {
      onLayout
    } = committedValuesRef.current;
    const {
      layout: prevLayout,
      panelDataArray
    } = eagerValuesRef.current;
    const panelConstraintsArray = panelDataArray.map(panelData => panelData.constraints);
    const {
      panelSize,
      pivotIndices
    } = panelDataHelper(panelDataArray, panelData, prevLayout);
    assert(panelSize != null, `Panel size not found for panel "${panelData.id}"`);
    const isLastPanel = findPanelDataIndex(panelDataArray, panelData) === panelDataArray.length - 1;
    const delta = isLastPanel ? panelSize - unsafePanelSize : unsafePanelSize - panelSize;
    const nextLayout = adjustLayoutByDelta({
      delta,
      initialLayout: prevLayout,
      panelConstraints: panelConstraintsArray,
      pivotIndices,
      prevLayout,
      trigger: "imperative-api"
    });
    if (!compareLayouts(prevLayout, nextLayout)) {
      setLayout(nextLayout);
      eagerValuesRef.current.layout = nextLayout;
      if (onLayout) {
        onLayout(nextLayout);
      }
      callPanelCallbacks(panelDataArray, nextLayout, panelIdToLastNotifiedSizeMapRef.current);
    }
  }, []);
  const reevaluatePanelConstraints = useCallback((panelData, prevConstraints) => {
    const {
      layout,
      panelDataArray
    } = eagerValuesRef.current;
    const {
      collapsedSize: prevCollapsedSize = 0,
      collapsible: prevCollapsible
    } = prevConstraints;
    const {
      collapsedSize: nextCollapsedSize = 0,
      collapsible: nextCollapsible,
      maxSize: nextMaxSize = 100,
      minSize: nextMinSize = 0
    } = panelData.constraints;
    const {
      panelSize: prevPanelSize
    } = panelDataHelper(panelDataArray, panelData, layout);
    if (prevPanelSize == null) {
      // It's possible that the panels in this group have changed since the last render
      return;
    }
    if (prevCollapsible && nextCollapsible && fuzzyNumbersEqual$1(prevPanelSize, prevCollapsedSize)) {
      if (!fuzzyNumbersEqual$1(prevCollapsedSize, nextCollapsedSize)) {
        resizePanel(panelData, nextCollapsedSize);
      }
    } else if (prevPanelSize < nextMinSize) {
      resizePanel(panelData, nextMinSize);
    } else if (prevPanelSize > nextMaxSize) {
      resizePanel(panelData, nextMaxSize);
    }
  }, [resizePanel]);

  // TODO Multiple drag handles can be active at the same time so this API is a bit awkward now
  const startDragging = useCallback((dragHandleId, event) => {
    const {
      direction
    } = committedValuesRef.current;
    const {
      layout
    } = eagerValuesRef.current;
    if (!panelGroupElementRef.current) {
      return;
    }
    const handleElement = getResizeHandleElement(dragHandleId, panelGroupElementRef.current);
    assert(handleElement, `Drag handle element not found for id "${dragHandleId}"`);
    const initialCursorPosition = getResizeEventCursorPosition(direction, event);
    setDragState({
      dragHandleId,
      dragHandleRect: handleElement.getBoundingClientRect(),
      initialCursorPosition,
      initialLayout: layout
    });
  }, []);
  const stopDragging = useCallback(() => {
    setDragState(null);
  }, []);
  const unregisterPanel = useCallback(panelData => {
    const {
      panelDataArray
    } = eagerValuesRef.current;
    const index = findPanelDataIndex(panelDataArray, panelData);
    if (index >= 0) {
      panelDataArray.splice(index, 1);

      // TRICKY
      // When a panel is removed from the group, we should delete the most recent prev-size entry for it.
      // If we don't do this, then a conditionally rendered panel might not call onResize when it's re-mounted.
      // Strict effects mode makes this tricky though because all panels will be registered, unregistered, then re-registered on mount.
      delete panelIdToLastNotifiedSizeMapRef.current[panelData.id];
      eagerValuesRef.current.panelDataArrayChanged = true;
      forceUpdate();
    }
  }, [forceUpdate]);
  const context = useMemo(() => ({
    collapsePanel,
    direction,
    dragState,
    expandPanel,
    getPanelSize,
    getPanelStyle,
    groupId,
    isPanelCollapsed,
    isPanelExpanded,
    reevaluatePanelConstraints,
    registerPanel,
    registerResizeHandle,
    resizePanel,
    startDragging,
    stopDragging,
    unregisterPanel,
    panelGroupElement: panelGroupElementRef.current
  }), [collapsePanel, dragState, direction, expandPanel, getPanelSize, getPanelStyle, groupId, isPanelCollapsed, isPanelExpanded, reevaluatePanelConstraints, registerPanel, registerResizeHandle, resizePanel, startDragging, stopDragging, unregisterPanel]);
  const style = {
    display: "flex",
    flexDirection: direction === "horizontal" ? "row" : "column",
    height: "100%",
    overflow: "hidden",
    width: "100%"
  };
  return createElement(PanelGroupContext.Provider, {
    value: context
  }, createElement(Type, {
    ...rest,
    children,
    className: classNameFromProps,
    id: idFromProps,
    ref: panelGroupElementRef,
    style: {
      ...style,
      ...styleFromProps
    },
    // CSS selectors
    "data-panel-group": "",
    "data-panel-group-direction": direction,
    "data-panel-group-id": groupId
  }));
}
const PanelGroup = forwardRef((props, ref) => createElement(PanelGroupWithForwardedRef, {
  ...props,
  forwardedRef: ref
}));
PanelGroupWithForwardedRef.displayName = "PanelGroup";
PanelGroup.displayName = "forwardRef(PanelGroup)";
function findPanelDataIndex(panelDataArray, panelData) {
  return panelDataArray.findIndex(prevPanelData => prevPanelData === panelData || prevPanelData.id === panelData.id);
}
function panelDataHelper(panelDataArray, panelData, layout) {
  const panelIndex = findPanelDataIndex(panelDataArray, panelData);
  const isLastPanel = panelIndex === panelDataArray.length - 1;
  const pivotIndices = isLastPanel ? [panelIndex - 1, panelIndex] : [panelIndex, panelIndex + 1];
  const panelSize = layout[panelIndex];
  return {
    ...panelData.constraints,
    panelSize,
    pivotIndices
  };
}

// https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/

function useWindowSplitterResizeHandlerBehavior({
  disabled,
  handleId,
  resizeHandler,
  panelGroupElement
}) {
  useEffect(() => {
    if (disabled || resizeHandler == null || panelGroupElement == null) {
      return;
    }
    const handleElement = getResizeHandleElement(handleId, panelGroupElement);
    if (handleElement == null) {
      return;
    }
    const onKeyDown = event => {
      if (event.defaultPrevented) {
        return;
      }
      switch (event.key) {
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
        case "ArrowUp":
        case "End":
        case "Home":
          {
            event.preventDefault();
            resizeHandler(event);
            break;
          }
        case "F6":
          {
            event.preventDefault();
            const groupId = handleElement.getAttribute("data-panel-group-id");
            assert(groupId, `No group element found for id "${groupId}"`);
            const handles = getResizeHandleElementsForGroup(groupId, panelGroupElement);
            const index = getResizeHandleElementIndex(groupId, handleId, panelGroupElement);
            assert(index !== null, `No resize element found for id "${handleId}"`);
            const nextIndex = event.shiftKey ? index > 0 ? index - 1 : handles.length - 1 : index + 1 < handles.length ? index + 1 : 0;
            const nextHandle = handles[nextIndex];
            nextHandle.focus();
            break;
          }
      }
    };
    handleElement.addEventListener("keydown", onKeyDown);
    return () => {
      handleElement.removeEventListener("keydown", onKeyDown);
    };
  }, [panelGroupElement, disabled, handleId, resizeHandler]);
}

function PanelResizeHandle({
  children = null,
  className: classNameFromProps = "",
  disabled = false,
  hitAreaMargins,
  id: idFromProps,
  onBlur,
  onDragging,
  onFocus,
  style: styleFromProps = {},
  tabIndex = 0,
  tagName: Type = "div",
  ...rest
}) {
  var _hitAreaMargins$coars, _hitAreaMargins$fine;
  const elementRef = useRef(null);

  // Use a ref to guard against users passing inline props
  const callbacksRef = useRef({
    onDragging
  });
  useEffect(() => {
    callbacksRef.current.onDragging = onDragging;
  });
  const panelGroupContext = useContext(PanelGroupContext);
  if (panelGroupContext === null) {
    throw Error(`PanelResizeHandle components must be rendered within a PanelGroup container`);
  }
  const {
    direction,
    groupId,
    registerResizeHandle: registerResizeHandleWithParentGroup,
    startDragging,
    stopDragging,
    panelGroupElement
  } = panelGroupContext;
  const resizeHandleId = useUniqueId(idFromProps);
  const [state, setState] = useState("inactive");
  const [isFocused, setIsFocused] = useState(false);
  const [resizeHandler, setResizeHandler] = useState(null);
  const committedValuesRef = useRef({
    state
  });
  useEffect(() => {
    if (disabled) {
      setResizeHandler(null);
    } else {
      const resizeHandler = registerResizeHandleWithParentGroup(resizeHandleId);
      setResizeHandler(() => resizeHandler);
    }
  }, [disabled, resizeHandleId, registerResizeHandleWithParentGroup]);

  // Extract hit area margins before passing them to the effect's dependency array
  // so that inline object values won't trigger re-renders
  const coarseHitAreaMargins = (_hitAreaMargins$coars = hitAreaMargins === null || hitAreaMargins === void 0 ? void 0 : hitAreaMargins.coarse) !== null && _hitAreaMargins$coars !== void 0 ? _hitAreaMargins$coars : 15;
  const fineHitAreaMargins = (_hitAreaMargins$fine = hitAreaMargins === null || hitAreaMargins === void 0 ? void 0 : hitAreaMargins.fine) !== null && _hitAreaMargins$fine !== void 0 ? _hitAreaMargins$fine : 5;
  useEffect(() => {
    if (disabled || resizeHandler == null) {
      return;
    }
    const element = elementRef.current;
    assert(element, "Element ref not attached");
    const setResizeHandlerState = (action, isActive, event) => {
      if (isActive) {
        switch (action) {
          case "down":
            {
              setState("drag");
              assert(event, 'Expected event to be defined for "down" action');
              startDragging(resizeHandleId, event);
              const {
                onDragging
              } = callbacksRef.current;
              if (onDragging) {
                onDragging(true);
              }
              break;
            }
          case "move":
            {
              const {
                state
              } = committedValuesRef.current;
              if (state !== "drag") {
                setState("hover");
              }
              assert(event, 'Expected event to be defined for "move" action');
              resizeHandler(event);
              break;
            }
          case "up":
            {
              setState("hover");
              stopDragging();
              const {
                onDragging
              } = callbacksRef.current;
              if (onDragging) {
                onDragging(false);
              }
              break;
            }
        }
      } else {
        setState("inactive");
      }
    };
    return registerResizeHandle(resizeHandleId, element, direction, {
      coarse: coarseHitAreaMargins,
      fine: fineHitAreaMargins
    }, setResizeHandlerState);
  }, [coarseHitAreaMargins, direction, disabled, fineHitAreaMargins, registerResizeHandleWithParentGroup, resizeHandleId, resizeHandler, startDragging, stopDragging]);
  useWindowSplitterResizeHandlerBehavior({
    disabled,
    handleId: resizeHandleId,
    resizeHandler,
    panelGroupElement
  });
  const style = {
    touchAction: "none",
    userSelect: "none"
  };
  return createElement(Type, {
    ...rest,
    children,
    className: classNameFromProps,
    id: idFromProps,
    onBlur: () => {
      setIsFocused(false);
      onBlur === null || onBlur === void 0 ? void 0 : onBlur();
    },
    onFocus: () => {
      setIsFocused(true);
      onFocus === null || onFocus === void 0 ? void 0 : onFocus();
    },
    ref: elementRef,
    role: "separator",
    style: {
      ...style,
      ...styleFromProps
    },
    tabIndex,
    // CSS selectors
    "data-panel-group-direction": direction,
    "data-panel-group-id": groupId,
    "data-resize-handle": "",
    "data-resize-handle-active": state === "drag" ? "pointer" : isFocused ? "keyboard" : undefined,
    "data-resize-handle-state": state,
    "data-panel-resize-handle-enabled": !disabled,
    "data-panel-resize-handle-id": resizeHandleId
  });
}
PanelResizeHandle.displayName = "PanelResizeHandle";

const ResizablePanelGroup = ({
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  PanelGroup,
  {
    className: cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    ),
    ...props
  }
);
const ResizablePanel = Panel;
const ResizableHandle = ({
  withHandle,
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  PanelResizeHandle,
  {
    className: cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    ),
    ...props,
    children: withHandle && /* @__PURE__ */ jsx("div", { className: "z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border", children: /* @__PURE__ */ jsx(DragHandleDots2Icon, { className: "h-2.5 w-2.5" }) })
  }
);
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      "bg-muted text-muted-foreground inline-flex h-9 items-center justify-center p-1",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "ring-offset-background focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
const AlgorithmNameInput = () => {
  const [algorithmName, setAlgorithmName] = useAtom(algorithmNameAtom);
  return /* @__PURE__ */ jsx(
    Input,
    {
      type: "text",
      placeholder: "Algorithm Name",
      value: algorithmName,
      onChange: (e) => setAlgorithmName(e.target.value)
    }
  );
};
const AlgorithmCompliance = ({
  algorithmId,
  seed,
  size,
  scale = 1,
  version = 0,
  onClick,
  className
}) => {
  const service = useAlgorithmService();
  const [overlayImageData, setOverlayImageData] = useState$1(
    null
  );
  const [issues, setIssues] = useState$1([]);
  const canvasRef = useRef$1(null);
  const drawingSize = useMemo$1(() => size * scale, [size, scale]);
  const colorCountIssue = useMemo$1(
    () => issues.find(
      (issue) => (
        // Look for messages about "distinct colors" which is specific to colorCount
        issue.message?.includes("distinct colors")
      )
    ),
    [issues]
  );
  const colorIslandIssues = useMemo$1(() => {
    return issues.filter(
      (issue) => (
        // Look for "color island" in the message which is specific to colorIsland issues
        issue.message?.includes("color island")
      )
    );
  }, [issues]);
  const anyIssues = useMemo$1(() => {
    if (colorCountIssue || colorIslandIssues.length > 0) {
      return true;
    }
    return false;
  }, [colorCountIssue, colorIslandIssues]);
  useEffect$1(() => {
    const abortController = new AbortController();
    service.checkCompliance(algorithmId, drawingSize, [...seed], {
      signal: abortController.signal
    }).then((result) => {
      if (result) {
        setIssues(result.issues);
        if (result.issueOverlayImageData) {
          setOverlayImageData(result.issueOverlayImageData);
        } else {
          setOverlayImageData(null);
        }
      } else {
        setIssues([]);
        setOverlayImageData(null);
      }
    }).catch((error) => {
      console.error(error);
      setIssues([]);
      setOverlayImageData(null);
    });
    return () => {
      abortController.abort();
    };
  }, [seed, algorithmId, size, service, version, scale, drawingSize]);
  useEffect$1(() => {
    if (canvasRef.current && overlayImageData) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        canvasRef.current.width = overlayImageData.width;
        canvasRef.current.height = overlayImageData.height;
        ctx.putImageData(overlayImageData, 0, 0);
      }
    }
  }, [overlayImageData]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    anyIssues && /* @__PURE__ */ jsx(
      "div",
      {
        className: `bg-destructive fixed left-1/2 top-0 z-50 flex h-12 w-full max-w-[640px] -translate-x-1/2 transform items-center justify-center px-6 py-2 text-white`,
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-start gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "font-mono text-xs", children: "\u26A0\uFE0F Warning:" }),
          /* @__PURE__ */ jsxs("p", { className: "flex-1 font-mono text-xs leading-4", children: [
            "Algorithm output may not meet tattooability criteria.",
            /* @__PURE__ */ jsx("br", {}),
            " Unsuitable submissions risk disqualification."
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        AlgorithmBitmap,
        {
          algorithmId,
          seed,
          size,
          scale,
          version,
          onClick,
          className
        }
      ),
      overlayImageData && /* @__PURE__ */ jsx(
        "canvas",
        {
          ref: canvasRef,
          className: cn(
            "absolute left-0 top-0 h-full w-full cursor-pointer touch-none transition-opacity hover:opacity-0",
            className
          ),
          onClick
        }
      )
    ] })
  ] });
};
const PREVIEW_SIZE = 128;
const AlgorithmPreview = () => {
  const [editorCode] = useAtom(editorCodeAtom);
  const [seedFamily] = useAtom(editorSeedFamilyAtom);
  const [seedType] = useAtom(editorSeedTypeAtom);
  const [, setScriptError] = useAtom(scriptErrorAtom);
  const [codeVersion, setAlgorithmVersion] = useAtom(editorCodeVersionAtom);
  const algorithmService = useAlgorithmService();
  const [ready, setReady] = useState$1(false);
  const [ref, bounds] = useMeasure();
  const { cols, totalSlots } = useMemo$1(() => {
    if (!bounds.width || !bounds.height) {
      return { cols: 4, totalSlots: 12 };
    }
    const availableWidth = bounds.width;
    const availableHeight = bounds.height;
    const itemSpacing = 8;
    const effectiveItemWidth = PREVIEW_SIZE + itemSpacing;
    const effectiveItemHeight = PREVIEW_SIZE + itemSpacing;
    const maxCols = Math.max(1, Math.floor(availableWidth / effectiveItemWidth));
    const maxRows = Math.max(
      1,
      Math.floor(availableHeight / effectiveItemHeight)
    );
    const totalSlots2 = maxCols * maxRows;
    return { cols: maxCols, totalSlots: totalSlots2 };
  }, [bounds.width, bounds.height]);
  useEffect$1(() => {
    setReady(false);
    algorithmService.cancelAllRenderRequests();
    try {
      algorithmService.updateAlgorithm(0, editorCode, seedType).then(() => {
        algorithmService.testRender(0).then(() => {
          setScriptError(null);
          setReady(true);
          setAlgorithmVersion((v) => v + 1);
        }).catch((e) => {
          console.info("TestRenderError:", e);
          setScriptError(e.message);
        });
      });
    } catch (e) {
      console.error("UpdateAlgorithmError:", e);
    }
  }, [
    algorithmService,
    editorCode,
    seedType,
    setAlgorithmVersion,
    setScriptError
  ]);
  const seedsToShow = Math.min(totalSlots, seedFamily.length);
  return /* @__PURE__ */ jsx("div", { ref, className: "h-full w-full overflow-scroll", children: /* @__PURE__ */ jsx(
    "div",
    {
      className: "grid gap-2 p-2",
      style: {
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
      },
      children: seedFamily.slice(0, seedsToShow).map((seed, index) => /* @__PURE__ */ jsx(
        "div",
        {
          className: "flex items-center justify-center",
          children: /* @__PURE__ */ jsx(
            "div",
            {
              className: cn("relative border border-dashed", {
                "blur-xs opacity-25": !ready
              }),
              children: !!editorCode && /* @__PURE__ */ jsx(
                AlgorithmCompliance,
                {
                  algorithmId: 0,
                  seed,
                  scale: 2,
                  size: PREVIEW_SIZE,
                  version: codeVersion
                },
                `compliance-${index}`
              )
            }
          )
        },
        seedToKey(seed)
      ))
    }
  ) });
};
const THEMES = { light: "", dark: ".dark" };
const ChartContext = React.createContext(null);
function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}
const ChartContainer = React.forwardRef(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
  return /* @__PURE__ */ jsx(ChartContext.Provider, { value: { config }, children: /* @__PURE__ */ jsxs(
    "div",
    {
      "data-chart": chartId,
      ref,
      className: cn(
        "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx(ChartStyle, { id: chartId, config }),
        /* @__PURE__ */ jsx(RechartsPrimitive.ResponsiveContainer, { children })
      ]
    }
  ) });
});
ChartContainer.displayName = "Chart";
const ChartStyle = ({ id, config }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config2]) => config2.theme || config2.color
  );
  if (!colorConfig.length) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "style",
    {
      dangerouslySetInnerHTML: {
        __html: Object.entries(THEMES).map(
          ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig.map(([key, itemConfig]) => {
            const color = itemConfig.theme?.[theme] || itemConfig.color;
            return color ? `  --color-${key}: ${color};` : null;
          }).join("\n")}
}
`
        ).join("\n")
      }
    }
  );
};
const ChartTooltip = RechartsPrimitive.Tooltip;
const ChartTooltipContent = React.forwardRef(
  ({
    active,
    payload,
    className,
    indicator = "dot",
    hideLabel = false,
    hideIndicator = false,
    label,
    labelFormatter,
    labelClassName,
    formatter,
    color,
    nameKey,
    labelKey
  }, ref) => {
    const { config } = useChart();
    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }
      const [item] = payload;
      const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value = !labelKey && typeof label === "string" ? config[label]?.label || label : itemConfig?.label;
      if (labelFormatter) {
        return /* @__PURE__ */ jsx("div", { className: cn("font-medium", labelClassName), children: labelFormatter(value, payload) });
      }
      if (!value) {
        return null;
      }
      return /* @__PURE__ */ jsx("div", { className: cn("font-medium", labelClassName), children: value });
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey
    ]);
    if (!active || !payload?.length) {
      return null;
    }
    const nestLabel = payload.length === 1 && indicator !== "dot";
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        className: cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        ),
        children: [
          !nestLabel ? tooltipLabel : null,
          /* @__PURE__ */ jsx("div", { className: "grid gap-1.5", children: payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload.fill || item.color;
            return /* @__PURE__ */ jsx(
              "div",
              {
                className: cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                ),
                children: formatter && item?.value !== void 0 && item.name ? formatter(item.value, item.name, item, index, item.payload) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  itemConfig?.icon ? /* @__PURE__ */ jsx(itemConfig.icon, {}) : !hideIndicator && /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: cn(
                        "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                        {
                          "h-2.5 w-2.5": indicator === "dot",
                          "w-1": indicator === "line",
                          "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                          "my-0.5": nestLabel && indicator === "dashed"
                        }
                      ),
                      style: {
                        "--color-bg": indicatorColor,
                        "--color-border": indicatorColor
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      ),
                      children: [
                        /* @__PURE__ */ jsxs("div", { className: "grid gap-1.5", children: [
                          nestLabel ? tooltipLabel : null,
                          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: itemConfig?.label || item.name })
                        ] }),
                        item.value && /* @__PURE__ */ jsx("span", { className: "font-mono font-medium tabular-nums text-foreground", children: item.value.toLocaleString() })
                      ]
                    }
                  )
                ] })
              },
              item.dataKey
            );
          }) })
        ]
      }
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltip";
const ChartLegendContent = React.forwardRef(
  ({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
    const { config } = useChart();
    if (!payload?.length) {
      return null;
    }
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        ),
        children: payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              ),
              children: [
                itemConfig?.icon && !hideIcon ? /* @__PURE__ */ jsx(itemConfig.icon, {}) : /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "h-2 w-2 shrink-0 rounded-[2px]",
                    style: {
                      backgroundColor: item.color
                    }
                  }
                ),
                itemConfig?.label
              ]
            },
            item.value
          );
        })
      }
    );
  }
);
ChartLegendContent.displayName = "ChartLegend";
function getPayloadConfigFromPayload(config, payload, key) {
  if (typeof payload !== "object" || payload === null) {
    return void 0;
  }
  const payloadPayload = "payload" in payload && typeof payload.payload === "object" && payload.payload !== null ? payload.payload : void 0;
  let configLabelKey = key;
  if (key in payload && typeof payload[key] === "string") {
    configLabelKey = payload[key];
  } else if (payloadPayload && key in payloadPayload && typeof payloadPayload[key] === "string") {
    configLabelKey = payloadPayload[key];
  }
  return configLabelKey in config ? config[configLabelKey] : config[key];
}
const WarningDistribution = ({
  warningDistribution
}) => {
  const processedData = () => {
    const entries = Object.entries(warningDistribution).map(
      ([warnings, count]) => ({
        warnings: parseInt(warnings, 10),
        count
      })
    );
    const groupedData = /* @__PURE__ */ new Map();
    entries.forEach(({ warnings, count }) => {
      const key = warnings >= 10 ? 10 : warnings;
      groupedData.set(key, (groupedData.get(key) || 0) + count);
    });
    const chartData2 = Array.from(groupedData.entries()).map(([warnings, count]) => ({
      warnings,
      count,
      label: warnings >= 10 ? "10+" : warnings.toString(),
      fill: warnings === 0 ? "hsl(142, 76%, 36%)" : "hsl(var(--foreground))"
    })).sort((a, b) => a.warnings - b.warnings);
    const regularData = chartData2.filter((item) => item.warnings < 10);
    const tenPlusData = chartData2.find((item) => item.warnings === 10);
    const maxRegularWarnings = Math.max(
      4,
      Math.max(...regularData.map((item) => item.warnings), 0)
    );
    const paddedData = [];
    for (let i = 0; i <= Math.min(maxRegularWarnings, 9); i++) {
      const existing = regularData.find((item) => item.warnings === i);
      if (existing) {
        paddedData.push(existing);
      } else {
        paddedData.push({
          warnings: i,
          count: 0,
          label: i.toString(),
          fill: i === 0 ? "hsl(142, 76%, 36%)" : "hsl(var(--foreground))"
        });
      }
    }
    if (tenPlusData) {
      paddedData.push(tenPlusData);
    }
    return paddedData;
  };
  const chartData = processedData();
  const chartConfig = {
    count: {
      label: "Tests",
      color: "hsl(var(--foreground))"
    }
  };
  if (chartData.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "border p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4 font-medium", children: "Warning Distribution" }),
      /* @__PURE__ */ jsx("div", { className: "text-muted-foreground text-sm", children: "No warning data available" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col items-center justify-center pr-4", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-4 py-4 text-sm font-medium", children: "Distribution of Warnings" }),
    /* @__PURE__ */ jsx(
      ChartContainer,
      {
        config: chartConfig,
        className: "max-h-[400px] min-h-[200px]",
        children: /* @__PURE__ */ jsxs(
          BarChart,
          {
            data: chartData,
            margin: {
              top: 4,
              right: 4,
              left: 4,
              bottom: 4
            },
            children: [
              /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3" }),
              /* @__PURE__ */ jsx(
                XAxis,
                {
                  dataKey: "label",
                  tickLine: false,
                  tickMargin: 2,
                  axisLine: false
                }
              ),
              /* @__PURE__ */ jsx(
                YAxis,
                {
                  tickLine: false,
                  axisLine: false,
                  tickMargin: 8,
                  tickFormatter: (value) => `${value}`
                }
              ),
              /* @__PURE__ */ jsx(
                ChartTooltip,
                {
                  cursor: false,
                  content: /* @__PURE__ */ jsx(
                    ChartTooltipContent,
                    {
                      formatter: (value, _name, props) => {
                        const warnings = props?.payload?.warnings;
                        if (warnings === void 0) return [`${value} tests`, "Tests"];
                        let warningText;
                        if (warnings >= 10) {
                          warningText = "10+ warnings";
                        } else if (warnings === 1) {
                          warningText = "1 warning";
                        } else {
                          warningText = `${warnings} warnings`;
                        }
                        return [`${value} outputs have ${warningText}`, ""];
                      },
                      hideLabel: true
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx(Bar, { dataKey: "count", children: chartData.map((entry, index) => /* @__PURE__ */ jsx(Cell, { fill: entry.fill }, `cell-${index}`)) })
            ]
          }
        )
      }
    )
  ] });
};
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  TooltipPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-w-96 overflow-hidden px-3 py-1.5 text-xs",
      className
    ),
    ...props
  }
) }));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
const BenchmarkResults = ({
  benchmarkResult,
  benchmarkDuration
}) => {
  const formatDuration = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1e3);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };
  const warningPercentage = Math.round(
    benchmarkResult.failedTotal / benchmarkResult.amount * 100
  );
  const errorPercentage = Math.round(
    benchmarkResult.errors / benchmarkResult.amount * 100
  );
  return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs("div", { className: "border p-4", children: [
    /* @__PURE__ */ jsx("h3", { className: "mb-6 text-lg", children: "Benchmark Results" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 space-y-1", children: [
      /* @__PURE__ */ jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx("div", { className: "cursor-help", children: benchmarkResult.collisionsTotal === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-green-600 dark:text-green-400", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { children: "no direct collision" })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-red-600 dark:text-red-400", children: [
          /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "found ",
            benchmarkResult.collisionsTotal,
            " identical images *"
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsx(TooltipContent, { children: "We check if different seeds result in the exact same image. This is a critical issue and will lead to disqualification." })
      ] }),
      /* @__PURE__ */ jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx("div", { className: "cursor-help", children: benchmarkResult.errors === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-green-600 dark:text-green-400", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { children: "0 errors" })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-red-600 dark:text-red-400", children: [
          /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxs("span", { children: [
            errorPercentage,
            "% of seeds error out*"
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsx(TooltipContent, { children: /* @__PURE__ */ jsx("div", { children: "We check if your script throws no errors depending on the input seed." }) })
      ] }),
      /* @__PURE__ */ jsxs(Tooltip, { children: [
        /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx("div", { className: "cursor-help", children: benchmarkResult.failedTotal === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-green-600 dark:text-green-400", children: [
          /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { children: "0 warnings" })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-red-600 dark:text-red-400", children: [
          /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxs("span", { children: [
            warningPercentage,
            "% of seeds have warnings"
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsx(TooltipContent, { children: "We do our best to analyze the tattooability of your design for each image. This measure is by no means perfect. But best to have no errors at all." })
      ] })
    ] }),
    (benchmarkResult.errors > 0 || benchmarkResult.collisionsTotal > 0) && /* @__PURE__ */ jsx("div", { className: "text-sm text-red-600 dark:text-red-400", children: "* Critical issues, please fix them before submitting. Otherwise this could lead to disqualification for the ongoing competition." }),
    /* @__PURE__ */ jsx(
      WarningDistribution,
      {
        warningDistribution: benchmarkResult.warningDistribution
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "text-muted-foreground space-y-2 border-t pt-4", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs font-medium", children: "Benchmark Details" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-xs", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { children: "Total Tests:" }),
          /* @__PURE__ */ jsx("span", { children: benchmarkResult.amount })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { children: "Image Size:" }),
          /* @__PURE__ */ jsxs("span", { children: [
            benchmarkResult.size,
            "\xD7",
            benchmarkResult.size,
            "px"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { children: "Total Duration:" }),
          /* @__PURE__ */ jsx("span", { children: formatDuration(benchmarkDuration) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { children: "Tests/Second:" }),
          /* @__PURE__ */ jsx("span", { children: Math.round(
            benchmarkResult.amount / benchmarkDuration * 1e3
          ) })
        ] })
      ] })
    ] })
  ] }) });
};
const Benchmarking = () => {
  const algorithmService = useAlgorithmService();
  const [progress, setProgress] = useState$1(0);
  const [isBenchmarking, setIsBenchmarking] = useState$1(false);
  const [benchmarkDuration, setBenchmarkDuration] = useState$1(
    null
  );
  const [benchmarkResult, setBenchmarkResult] = useState$1(null);
  const doBenchmark = useCallback$1(
    (size, amount) => () => {
      setIsBenchmarking(true);
      setBenchmarkDuration(null);
      setBenchmarkResult(null);
      setProgress(0);
      const startTime = performance.now();
      algorithmService.benchmark(0, size, amount, (p) => setProgress(p)).then((r) => {
        setBenchmarkResult(r);
      }).finally(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        setBenchmarkDuration(duration);
        setIsBenchmarking(false);
      });
    },
    [algorithmService]
  );
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "border border-blue-500 bg-blue-50 p-4 dark:bg-blue-950", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-blue-800 dark:text-blue-400", children: "This benchmark is meant to help you and us determine how well suited your algorithm is for tattooing. Our automated checks are not flawless and will improve over time." }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center justify-center gap-4", children: [
      /* @__PURE__ */ jsx(Button, { disabled: isBenchmarking, onClick: doBenchmark(250, 250), children: "Quick Benchmark" }),
      /* @__PURE__ */ jsx(Button, { disabled: isBenchmarking, onClick: doBenchmark(250, 1e3), children: "Big Benchmark" })
    ] }),
    isBenchmarking && /* @__PURE__ */ jsx("div", { className: "border p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-background relative flex h-8 w-full items-center border", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "bg-foreground h-8 transition-all duration-100",
          style: { width: `${progress * 100}%` }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxs("span", { className: "bg-background text-foreground p-1 text-xs", children: [
        Math.round(progress * 100),
        "%"
      ] }) })
    ] }) }),
    benchmarkResult && benchmarkDuration !== null && /* @__PURE__ */ jsx(
      BenchmarkResults,
      {
        benchmarkResult,
        benchmarkDuration
      }
    )
  ] });
};
const validateAlgorithmName = (name) => {
  const trimmedName = name.trim().replace(/\s+/g, " ");
  if (!trimmedName) {
    return { isValid: false, error: "Name is required" };
  }
  if (trimmedName.length < 3) {
    return { isValid: false, error: "Name must be at least 3 characters" };
  }
  if (trimmedName.length > 32) {
    return { isValid: false, error: "Name must be 32 characters or less" };
  }
  return { isValid: true };
};
const PostButton = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editorCode] = useAtom(editorCodeAtom);
  const [editorSeedType] = useAtom(editorSeedTypeAtom);
  const [scriptError] = useAtom(scriptErrorAtom);
  const [remix] = useAtom(remixAtom);
  const [algorithmName, setAlgorithmName] = useAtom(algorithmNameAtom);
  const [hasPosted, setHasPosted] = useState$1(false);
  const nameValidation = validateAlgorithmName(algorithmName);
  const createAlgorithm = useMutation({
    mutationFn: async () => {
      const { isValid, error } = validateAlgorithmName(algorithmName);
      if (!isValid) {
        throw new Error(error);
      }
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("You must be logged in to create an algorithm");
      }
      const { data: insertedAlgorithm, error: insertError } = await supabase.from("algorithms").insert({
        content: editorCode,
        name: algorithmName.trim().replace(/\s+/g, " "),
        user_id: user.id,
        remix_of: remix?.id || void 0,
        like_count: 0,
        family_kind: editorSeedType
      }).select().single();
      if (insertError) {
        throw new Error(insertError.message);
      }
      return insertedAlgorithm;
    },
    onSuccess: (data) => {
      console.info("Successfully created algorithm", data);
      setAlgorithmName("");
      {
        queryClient.invalidateQueries({ queryKey: ["algorithms", "latest"] }).finally(() => {
          navigate(`/new`);
        });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs(Tooltip, { children: [
    /* @__PURE__ */ jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
      Button,
      {
        onClick: () => {
          setHasPosted(true);
          setTimeout(() => {
            createAlgorithm.mutate();
          }, 0);
        },
        disabled: createAlgorithm.isPending || !nameValidation.isValid || scriptError !== null,
        className: "min-w-[100px]",
        children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: createAlgorithm.isPending ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }),
          "POSTING..."
        ] }) : "POST" + (remix ? "*" : "") })
      }
    ) }),
    remix && /* @__PURE__ */ jsx(TooltipContent, { children: /* @__PURE__ */ jsxs("p", { children: [
      "* Will be marked as remix of ",
      remix.id
    ] }) })
  ] }) }) });
};
function RerollBadge() {
  const [, generateNewSeed] = useAtom(generateNewSeedAtom);
  return /* @__PURE__ */ jsxs(
    Badge,
    {
      onClick: generateNewSeed,
      className: cn(
        "hover:bg-destructive text-foreground hover:text-destructive-foreground cursor-pointer select-none bg-transparent shadow-none",
        {}
      ),
      children: [
        /* @__PURE__ */ jsx(Dices, { className: "mr-1 h-3 w-3" }),
        "REROLL SEED"
      ]
    }
  );
}
const Separator = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      ref,
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      ),
      ...props
    }
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;
const byteSchema = z.object({
  decimal: z.string(),
  hex: z.string()
});
function ByteManipulator({
  value,
  placeholder = [0, 0, 0, 0],
  onChange,
  className
}) {
  const [bytes, setBytes] = useState$1(value || placeholder);
  useEffect$1(() => {
    if (value) {
      setBytes(value);
    }
  }, [value]);
  const updateByte = (index, newValue) => {
    const newBytes = [...bytes];
    newBytes[index] = Math.min(255, Math.max(0, newValue));
    setBytes(newBytes);
    onChange?.(newBytes);
  };
  const toggleBit = (byteIndex, bitIndex) => {
    const byte = bytes[byteIndex];
    const mask = 1 << 7 - bitIndex;
    const newByte = byte ^ mask;
    updateByte(byteIndex, newByte);
  };
  const getBit = (byte, index) => {
    return byte >> 7 - index & 1;
  };
  return /* @__PURE__ */ jsx("div", { className: cn("inline-flex flex-col", className), children: bytes.map((byte, byteIndex) => /* @__PURE__ */ jsx(
    ByteRow,
    {
      index: byteIndex,
      value: byte,
      onChange: (newValue) => updateByte(byteIndex, newValue),
      onToggleBit: (bitIndex) => toggleBit(byteIndex, bitIndex),
      getBit: (bitIndex) => getBit(byte, bitIndex)
    },
    byteIndex
  )) });
}
function ByteRow({
  index,
  value,
  onChange,
  onToggleBit,
  getBit
}) {
  const form = useForm({
    resolver: zodResolver(byteSchema),
    defaultValues: {
      decimal: value.toString(),
      hex: value.toString(16).padStart(2, "0")
    }
  });
  React__default.useEffect(() => {
    form.setValue("decimal", value.toString());
    form.setValue("hex", value.toString(16).padStart(2, "0").toLowerCase());
  }, [value, form]);
  const hasError = Object.keys(form.formState.errors).length > 0;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "flex items-center space-x-2 border transition-colors",
        hasError ? "border-destructive" : "border-transparent"
      ),
      children: [
        /* @__PURE__ */ jsxs("span", { className: "font-mono text-xs", children: [
          index,
          ":"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex -space-x-[1px]", children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              onToggleBit(i);
            },
            className: cn(
              "hover:bg-border/25 aspect-square h-9 border transition-colors",
              getBit(i) === 1 ? "bg-border" : "bg-transparent"
            ),
            "aria-label": `Toggle bit ${i}`,
            children: /* @__PURE__ */ jsx("span", { className: "text-sm", children: getBit(i) })
          },
          i
        )) }),
        /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("div", { className: "flex space-x-2", children: [
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "hex",
              render: ({ field }) => /* @__PURE__ */ jsx(FormItem, { children: /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  ...field,
                  disabled: true,
                  className: "w-12 font-mono uppercase [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                  placeholder: "HEX",
                  maxLength: 2,
                  value: field.value,
                  onChange: (e) => {
                    let hex = e.target.value.toLowerCase();
                    hex = hex.replace(/[^0-9a-f]/g, "");
                    field.onChange(hex);
                    if (hex === "") {
                      onChange(0);
                      return;
                    }
                    const parsed = parseInt(hex, 16);
                    if (!isNaN(parsed)) {
                      const newValue = Math.min(255, Math.max(0, parsed));
                      onChange(newValue);
                    }
                  },
                  onBlur: (e) => {
                    const currentValue = e.target.value.toLowerCase();
                    if (!currentValue) {
                      field.onChange("00");
                    } else {
                      field.onChange(currentValue.padStart(2, "0"));
                    }
                  }
                }
              ) }) })
            }
          ),
          /* @__PURE__ */ jsx(
            FormField,
            {
              control: form.control,
              name: "decimal",
              render: ({ field }) => /* @__PURE__ */ jsx(FormItem, { children: /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  ...field,
                  className: "w-14 font-mono [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                  placeholder: "DEC",
                  type: "number",
                  value: field.value,
                  onChange: (e) => {
                    const inputValue = e.target.value;
                    field.onChange(inputValue);
                    if (inputValue === "") {
                      onChange(0);
                      return;
                    }
                    const parsed = parseInt(inputValue);
                    if (!isNaN(parsed)) {
                      const newValue = Math.min(255, Math.max(0, parsed));
                      onChange(newValue);
                    }
                  },
                  onBlur: (e) => {
                    if (!e.target.value) {
                      field.onChange("0");
                    } else {
                      field.onChange(value.toString());
                    }
                  }
                }
              ) }) })
            }
          )
        ] }) })
      ]
    }
  );
}
const SeedManipulator = () => {
  const [seedFamily, setSeedFamily] = useAtom(editorSeedFamilyAtom);
  const handleSeedChange = (newSeed) => {
    setSeedFamily((prev) => {
      const newFamily = [...prev];
      newFamily[0] = newSeed;
      return newFamily;
    });
  };
  return /* @__PURE__ */ jsx("div", { className: "flex w-full flex-row items-center justify-center", children: /* @__PURE__ */ jsx(ByteManipulator, { value: seedFamily[0], onChange: handleSeedChange }) });
};
const SeedRepresentation = ({ seed }) => {
  const seedType = useAtomValue(editorSeedTypeAtom);
  const numericValue = numeric(seed).toString();
  const hexValues = seed.map((byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
    seedType === "ProceduralAccount" && /* @__PURE__ */ jsx("div", { className: "font-mono text-sm", children: "0x" + hexValues }),
    seedType === "ProceduralPersonal" && /* @__PURE__ */ jsx("div", { className: "font-mono text-sm", children: numericValue }),
    /* @__PURE__ */ jsxs("div", { className: "text-muted-foreground break-all font-mono text-xs", children: [
      "[",
      seed.join(","),
      "]"
    ] })
  ] });
};
const SeedTools = () => {
  const generateNewSeed = useSetAtom(generateNewSeedAtom);
  const [seedType, setSeedType] = useAtom(editorSeedTypeAtom);
  const [seedFamily] = useAtom(editorSeedFamilyAtom);
  const handleSeedTypeChange = useCallback$1(
    (value) => {
      setSeedType(value);
      generateNewSeed();
    },
    [generateNewSeed, setSeedType]
  );
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full w-full flex-col items-start gap-4 overflow-y-scroll p-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-md font-medium", children: "Settings" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs", children: "Configure your seed type and modify your current rolled seed. Remember, your algorithm should cover the whole seed spectrum." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center gap-2", children: [
      /* @__PURE__ */ jsxs(
        Select,
        {
          defaultValue: "Procedural",
          onValueChange: handleSeedTypeChange,
          value: seedType,
          children: [
            /* @__PURE__ */ jsx(SelectTrigger, { className: "w-[240px]", children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select type" }) }),
            /* @__PURE__ */ jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsx(SelectItem, { value: "Procedural", children: "Entropy" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "ProceduralPersonal", children: "Personal Id" }),
              /* @__PURE__ */ jsx(SelectItem, { value: "ProceduralAccount", children: "Account Id" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsx(Button, { variant: "destructive", onClick: generateNewSeed, children: "REROLL" })
    ] }),
    /* @__PURE__ */ jsx(Separator, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-md font-medium", children: "Current Seed" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs", children: "This is the value of your main seed. The other shown seeds are slightly mutated versions of this one." })
      ] }),
      /* @__PURE__ */ jsx(SeedRepresentation, { seed: seedFamily[0] })
    ] }),
    /* @__PURE__ */ jsx(Separator, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-md font-medium", children: "Manipulation" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs", children: "Fine-tune and adjust your current seed values manually." })
      ] }),
      /* @__PURE__ */ jsx(SeedManipulator, {})
    ] })
  ] });
};
const MonacoEditor = lazy(() => import('./MonacoEditor-Nw7Wsojv.mjs'));
const CreateFeature = () => {
  const [scriptError] = useAtom(scriptErrorAtom);
  const [editorSeedType] = useAtom(editorSeedTypeAtom);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(FeedbackDialog, { className: "fixed bottom-4 right-4 z-50" }),
    /* @__PURE__ */ jsxs(
      ResizablePanelGroup,
      {
        direction: "horizontal",
        className: "h-screen w-screen",
        autoSave: "editor-layout",
        autoSaveId: "editor-layout-id",
        children: [
          /* @__PURE__ */ jsx(ResizablePanel, { defaultSize: 50, children: /* @__PURE__ */ jsxs(ResizablePanelGroup, { direction: "vertical", children: [
            /* @__PURE__ */ jsx(ResizablePanel, { defaultSize: 90, className: "h-full w-full", children: /* @__PURE__ */ jsxs("div", { className: "relative h-full w-full", children: [
              /* @__PURE__ */ jsx(AlgorithmPreview, {}),
              /* @__PURE__ */ jsxs("div", { className: "absolute bottom-0 left-0 flex w-full flex-row justify-between", children: [
                /* @__PURE__ */ jsx(FamilyKindBadge, { familyKind: editorSeedType }),
                /* @__PURE__ */ jsx(RerollBadge, {})
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(ResizableHandle, { withHandle: true }),
            /* @__PURE__ */ jsx(ResizablePanel, { defaultSize: 10, children: /* @__PURE__ */ jsx("div", { className: "text-destructive h-full w-full whitespace-pre-wrap bg-gray-800/10 p-1", children: scriptError || null }) })
          ] }) }),
          /* @__PURE__ */ jsx(ResizableHandle, { withHandle: true }),
          /* @__PURE__ */ jsx(
            ResizablePanel,
            {
              defaultSize: 50,
              minSize: 10,
              className: "flex h-full flex-col",
              children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "code", className: "flex h-full flex-col", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center gap-4 border-b p-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-row items-center gap-2", children: [
                    /* @__PURE__ */ jsx(AlgorithmNameInput, {}),
                    /* @__PURE__ */ jsx(PostButton, {})
                  ] }),
                  /* @__PURE__ */ jsxs(TabsList, { children: [
                    /* @__PURE__ */ jsx(TabsTrigger, { value: "code", children: "Code" }),
                    /* @__PURE__ */ jsx(TabsTrigger, { className: "border-foreground border", value: "check", children: "Check" }),
                    /* @__PURE__ */ jsx(TabsTrigger, { value: "seed", children: "Seed" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(TabsContent, { value: "code", className: "flex-1", children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { className: "p-8", children: "Loading code..." }), children: /* @__PURE__ */ jsx(MonacoEditor, {}) }) }),
                /* @__PURE__ */ jsx(TabsContent, { value: "seed", className: "flex-1 overflow-y-scroll", children: /* @__PURE__ */ jsx(SeedTools, {}) }),
                /* @__PURE__ */ jsx(TabsContent, { value: "check", className: "flex-1 overflow-y-scroll p-4", children: /* @__PURE__ */ jsx(Benchmarking, {}) })
              ] })
            }
          )
        ]
      }
    )
  ] });
};

export { CreateFeature, CreateFeature as default };
//# sourceMappingURL=index-Byidhy7b.mjs.map
