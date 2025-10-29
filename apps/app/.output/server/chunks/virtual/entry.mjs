import { f as fromWebHandler } from '../nitro/nitro.mjs';
import { AsyncLocalStorage } from 'node:async_hooks';
import { jsx } from 'react/jsx-runtime';
import { defineHandlerCallback, renderRouterToStream } from '@tanstack/react-router/ssr/server';
import { RouterProvider } from '@tanstack/react-router';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

function StartServer(props) {
  return /* @__PURE__ */ jsx(RouterProvider, { router: props.router });
}
const defaultStreamHandler = defineHandlerCallback(
  ({ request, router, responseHeaders }) => renderRouterToStream({
    request,
    router,
    responseHeaders,
    children: /* @__PURE__ */ jsx(StartServer, { router })
  })
);
const stateIndexKey = "__TSR_index";
function createHistory(opts) {
  let location = opts.getLocation();
  const subscribers = /* @__PURE__ */ new Set();
  const notify = (action) => {
    location = opts.getLocation();
    subscribers.forEach((subscriber) => subscriber({ location, action }));
  };
  const handleIndexChange = (action) => {
    if (opts.notifyOnIndexChange ?? true) notify(action);
    else location = opts.getLocation();
  };
  const tryNavigation = async ({
    task,
    navigateOpts,
    ...actionInfo
  }) => {
    const ignoreBlocker = navigateOpts?.ignoreBlocker ?? false;
    if (ignoreBlocker) {
      task();
      return;
    }
    const blockers = opts.getBlockers?.() ?? [];
    const isPushOrReplace = actionInfo.type === "PUSH" || actionInfo.type === "REPLACE";
    if (typeof document !== "undefined" && blockers.length && isPushOrReplace) {
      for (const blocker of blockers) {
        const nextLocation = parseHref(actionInfo.path, actionInfo.state);
        const isBlocked = await blocker.blockerFn({
          currentLocation: location,
          nextLocation,
          action: actionInfo.type
        });
        if (isBlocked) {
          opts.onBlocked?.();
          return;
        }
      }
    }
    task();
  };
  return {
    get location() {
      return location;
    },
    get length() {
      return opts.getLength();
    },
    subscribers,
    subscribe: (cb) => {
      subscribers.add(cb);
      return () => {
        subscribers.delete(cb);
      };
    },
    push: (path, state, navigateOpts) => {
      const currentIndex = location.state[stateIndexKey];
      state = assignKeyAndIndex(currentIndex + 1, state);
      tryNavigation({
        task: () => {
          opts.pushState(path, state);
          notify({ type: "PUSH" });
        },
        navigateOpts,
        type: "PUSH",
        path,
        state
      });
    },
    replace: (path, state, navigateOpts) => {
      const currentIndex = location.state[stateIndexKey];
      state = assignKeyAndIndex(currentIndex, state);
      tryNavigation({
        task: () => {
          opts.replaceState(path, state);
          notify({ type: "REPLACE" });
        },
        navigateOpts,
        type: "REPLACE",
        path,
        state
      });
    },
    go: (index, navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.go(index);
          handleIndexChange({ type: "GO", index });
        },
        navigateOpts,
        type: "GO"
      });
    },
    back: (navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.back(navigateOpts?.ignoreBlocker ?? false);
          handleIndexChange({ type: "BACK" });
        },
        navigateOpts,
        type: "BACK"
      });
    },
    forward: (navigateOpts) => {
      tryNavigation({
        task: () => {
          opts.forward(navigateOpts?.ignoreBlocker ?? false);
          handleIndexChange({ type: "FORWARD" });
        },
        navigateOpts,
        type: "FORWARD"
      });
    },
    canGoBack: () => location.state[stateIndexKey] !== 0,
    createHref: (str) => opts.createHref(str),
    block: (blocker) => {
      if (!opts.setBlockers) return () => {
      };
      const blockers = opts.getBlockers?.() ?? [];
      opts.setBlockers([...blockers, blocker]);
      return () => {
        const blockers2 = opts.getBlockers?.() ?? [];
        opts.setBlockers?.(blockers2.filter((b) => b !== blocker));
      };
    },
    flush: () => opts.flush?.(),
    destroy: () => opts.destroy?.(),
    notify
  };
}
function assignKeyAndIndex(index, state) {
  if (!state) {
    state = {};
  }
  const key = createRandomKey();
  return {
    ...state,
    key,
    // TODO: Remove in v2 - use __TSR_key instead
    __TSR_key: key,
    [stateIndexKey]: index
  };
}
function createMemoryHistory(opts = {
  initialEntries: ["/"]
}) {
  const entries = opts.initialEntries;
  let index = opts.initialIndex ? Math.min(Math.max(opts.initialIndex, 0), entries.length - 1) : entries.length - 1;
  const states = entries.map(
    (_entry, index2) => assignKeyAndIndex(index2, void 0)
  );
  const getLocation = () => parseHref(entries[index], states[index]);
  return createHistory({
    getLocation,
    getLength: () => entries.length,
    pushState: (path, state) => {
      if (index < entries.length - 1) {
        entries.splice(index + 1);
        states.splice(index + 1);
      }
      states.push(state);
      entries.push(path);
      index = Math.max(entries.length - 1, 0);
    },
    replaceState: (path, state) => {
      states[index] = state;
      entries[index] = path;
    },
    back: () => {
      index = Math.max(index - 1, 0);
    },
    forward: () => {
      index = Math.min(index + 1, entries.length - 1);
    },
    go: (n) => {
      index = Math.min(Math.max(index + n, 0), entries.length - 1);
    },
    createHref: (path) => path
  });
}
function parseHref(href, state) {
  const hashIndex = href.indexOf("#");
  const searchIndex = href.indexOf("?");
  const addedKey = createRandomKey();
  return {
    href,
    pathname: href.substring(
      0,
      hashIndex > 0 ? searchIndex > 0 ? Math.min(hashIndex, searchIndex) : hashIndex : searchIndex > 0 ? searchIndex : href.length
    ),
    hash: hashIndex > -1 ? href.substring(hashIndex) : "",
    search: searchIndex > -1 ? href.slice(searchIndex, hashIndex === -1 ? void 0 : hashIndex) : "",
    state: state || { [stateIndexKey]: 0, key: addedKey, __TSR_key: addedKey }
  };
}
function createRandomKey() {
  return (Math.random() + 1).toString(36).substring(7);
}
function splitSetCookieString$1(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitSetCookieString$1(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}
function toHeadersInstance(init) {
  if (init instanceof Headers) {
    return new Headers(init);
  } else if (Array.isArray(init)) {
    return new Headers(init);
  } else if (typeof init === "object") {
    return new Headers(init);
  } else {
    return new Headers();
  }
}
function mergeHeaders(...headers) {
  return headers.reduce((acc, header) => {
    const headersInstance = toHeadersInstance(header);
    for (const [key, value] of headersInstance.entries()) {
      if (key === "set-cookie") {
        const splitCookies = splitSetCookieString$1(value);
        splitCookies.forEach((cookie) => acc.append("set-cookie", cookie));
      } else {
        acc.set(key, value);
      }
    }
    return acc;
  }, new Headers());
}
function json(payload, init) {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: mergeHeaders(
      { "content-type": "application/json" },
      init?.headers
    )
  });
}
var prefix = "Invariant failed";
function invariant(condition, message) {
  if (condition) {
    return;
  }
  {
    throw new Error(prefix);
  }
}
function createControlledPromise(onResolve) {
  let resolveLoadPromise;
  let rejectLoadPromise;
  const controlledPromise = new Promise((resolve, reject) => {
    resolveLoadPromise = resolve;
    rejectLoadPromise = reject;
  });
  controlledPromise.status = "pending";
  controlledPromise.resolve = (value) => {
    controlledPromise.status = "resolved";
    controlledPromise.value = value;
    resolveLoadPromise(value);
  };
  controlledPromise.reject = (e) => {
    controlledPromise.status = "rejected";
    rejectLoadPromise(e);
  };
  return controlledPromise;
}
Array.from(
  (/* @__PURE__ */ new Map([
    ["%", "%25"],
    ["\\", "%5C"],
    ["/", "%2F"],
    [";", "%3B"],
    [":", "%3A"],
    ["@", "%40"],
    ["&", "%26"],
    ["=", "%3D"],
    ["+", "%2B"],
    ["$", "%24"],
    [",", "%2C"]
  ])).values()
);
function isNotFound(obj) {
  return !!obj?.isNotFound;
}
const rootRouteId = "__root__";
function isRedirect(obj) {
  return obj instanceof Response && !!obj.options;
}
function isResolvedRedirect(obj) {
  return isRedirect(obj) && !!obj.options.href;
}
function executeRewriteInput(rewrite, url) {
  const res = rewrite?.input?.({ url });
  if (res) {
    if (typeof res === "string") {
      return new URL(res);
    } else if (res instanceof URL) {
      return res;
    }
  }
  return url;
}
var R = ((a) => (a[a.AggregateError = 1] = "AggregateError", a[a.ArrowFunction = 2] = "ArrowFunction", a[a.ErrorPrototypeStack = 4] = "ErrorPrototypeStack", a[a.ObjectAssign = 8] = "ObjectAssign", a[a.BigIntTypedArray = 16] = "BigIntTypedArray", a))(R || {});
function Nr(o) {
  switch (o) {
    case '"':
      return '\\"';
    case "\\":
      return "\\\\";
    case `
`:
      return "\\n";
    case "\r":
      return "\\r";
    case "\b":
      return "\\b";
    case "	":
      return "\\t";
    case "\f":
      return "\\f";
    case "<":
      return "\\x3C";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return;
  }
}
function d(o) {
  let e = "", r = 0, t;
  for (let n = 0, a = o.length; n < a; n++) t = Nr(o[n]), t && (e += o.slice(r, n) + t, r = n + 1);
  return r === 0 ? e = o : e += o.slice(r), e;
}
function br(o) {
  switch (o) {
    case "\\\\":
      return "\\";
    case '\\"':
      return '"';
    case "\\n":
      return `
`;
    case "\\r":
      return "\r";
    case "\\b":
      return "\b";
    case "\\t":
      return "	";
    case "\\f":
      return "\f";
    case "\\x3C":
      return "<";
    case "\\u2028":
      return "\u2028";
    case "\\u2029":
      return "\u2029";
    default:
      return o;
  }
}
function N(o) {
  return o.replace(/(\\\\|\\"|\\n|\\r|\\b|\\t|\\f|\\u2028|\\u2029|\\x3C)/g, br);
}
var O = "__SEROVAL_REFS__", Q = "$R", ae = `self.${Q}`;
function xr(o) {
  return o == null ? `${ae}=${ae}||[]` : `(${ae}=${ae}||{})["${d(o)}"]=[]`;
}
function f(o, e) {
  if (!o) throw e;
}
var Be = /* @__PURE__ */ new Map(), C = /* @__PURE__ */ new Map();
function je(o) {
  return Be.has(o);
}
function Ar(o) {
  return C.has(o);
}
function Ke(o) {
  return f(je(o), new ie(o)), Be.get(o);
}
function Je(o) {
  return f(Ar(o), new le(o)), C.get(o);
}
typeof globalThis != "undefined" ? Object.defineProperty(globalThis, O, { value: C, configurable: true, writable: false, enumerable: false }) : typeof self != "undefined" ? Object.defineProperty(self, O, { value: C, configurable: true, writable: false, enumerable: false }) : typeof global != "undefined" && Object.defineProperty(global, O, { value: C, configurable: true, writable: false, enumerable: false });
function Hr(o) {
  return o;
}
function Ye(o, e) {
  for (let r = 0, t = e.length; r < t; r++) {
    let n = e[r];
    o.has(n) || (o.add(n), n.extends && Ye(o, n.extends));
  }
}
function m(o) {
  if (o) {
    let e = /* @__PURE__ */ new Set();
    return Ye(e, o), [...e];
  }
}
var $e = { 0: "Symbol.asyncIterator", 1: "Symbol.hasInstance", 2: "Symbol.isConcatSpreadable", 3: "Symbol.iterator", 4: "Symbol.match", 5: "Symbol.matchAll", 6: "Symbol.replace", 7: "Symbol.search", 8: "Symbol.species", 9: "Symbol.split", 10: "Symbol.toPrimitive", 11: "Symbol.toStringTag", 12: "Symbol.unscopables" }, ce = { [Symbol.asyncIterator]: 0, [Symbol.hasInstance]: 1, [Symbol.isConcatSpreadable]: 2, [Symbol.iterator]: 3, [Symbol.match]: 4, [Symbol.matchAll]: 5, [Symbol.replace]: 6, [Symbol.search]: 7, [Symbol.species]: 8, [Symbol.split]: 9, [Symbol.toPrimitive]: 10, [Symbol.toStringTag]: 11, [Symbol.unscopables]: 12 }, Ge = { 0: Symbol.asyncIterator, 1: Symbol.hasInstance, 2: Symbol.isConcatSpreadable, 3: Symbol.iterator, 4: Symbol.match, 5: Symbol.matchAll, 6: Symbol.replace, 7: Symbol.search, 8: Symbol.species, 9: Symbol.split, 10: Symbol.toPrimitive, 11: Symbol.toStringTag, 12: Symbol.unscopables }, qe = { 2: "!0", 3: "!1", 1: "void 0", 0: "null", 4: "-0", 5: "1/0", 6: "-1/0", 7: "0/0" }, He = { 2: true, 3: false, 1: void 0, 0: null, 4: -0, 5: Number.POSITIVE_INFINITY, 6: Number.NEGATIVE_INFINITY, 7: Number.NaN };
var ue = { 0: "Error", 1: "EvalError", 2: "RangeError", 3: "ReferenceError", 4: "SyntaxError", 5: "TypeError", 6: "URIError" }, Ze = { 0: Error, 1: EvalError, 2: RangeError, 3: ReferenceError, 4: SyntaxError, 5: TypeError, 6: URIError }, s = void 0;
function u$1(o, e, r, t, n, a, i, l, c, p2, h, X) {
  return { t: o, i: e, s: r, l: t, c: n, m: a, p: i, e: l, a: c, f: p2, b: h, o: X };
}
function x(o) {
  return u$1(2, s, o, s, s, s, s, s, s, s, s, s);
}
var I = x(2), A = x(3), pe = x(1), de = x(0), Xe = x(4), Qe = x(5), er = x(6), rr = x(7);
function me(o) {
  return o instanceof EvalError ? 1 : o instanceof RangeError ? 2 : o instanceof ReferenceError ? 3 : o instanceof SyntaxError ? 4 : o instanceof TypeError ? 5 : o instanceof URIError ? 6 : 0;
}
function wr(o) {
  let e = ue[me(o)];
  return o.name !== e ? { name: o.name } : o.constructor.name !== e ? { name: o.constructor.name } : {};
}
function j(o, e) {
  let r = wr(o), t = Object.getOwnPropertyNames(o);
  for (let n = 0, a = t.length, i; n < a; n++) i = t[n], i !== "name" && i !== "message" && (i === "stack" ? e & 4 && (r = r || {}, r[i] = o[i]) : (r = r || {}, r[i] = o[i]));
  return r;
}
function fe(o) {
  return Object.isFrozen(o) ? 3 : Object.isSealed(o) ? 2 : Object.isExtensible(o) ? 0 : 1;
}
function ge(o) {
  switch (o) {
    case Number.POSITIVE_INFINITY:
      return Qe;
    case Number.NEGATIVE_INFINITY:
      return er;
  }
  return o !== o ? rr : Object.is(o, -0) ? Xe : u$1(0, s, o, s, s, s, s, s, s, s, s, s);
}
function w(o) {
  return u$1(1, s, d(o), s, s, s, s, s, s, s, s, s);
}
function Se(o) {
  return u$1(3, s, "" + o, s, s, s, s, s, s, s, s, s);
}
function sr(o) {
  return u$1(4, o, s, s, s, s, s, s, s, s, s, s);
}
function he(o, e) {
  let r = e.valueOf();
  return u$1(5, o, r !== r ? "" : e.toISOString(), s, s, s, s, s, s, s, s, s);
}
function ye(o, e) {
  return u$1(6, o, s, s, d(e.source), e.flags, s, s, s, s, s, s);
}
function ve(o, e) {
  let r = new Uint8Array(e), t = r.length, n = new Array(t);
  for (let a = 0; a < t; a++) n[a] = r[a];
  return u$1(19, o, n, s, s, s, s, s, s, s, s, s);
}
function or(o, e) {
  return u$1(17, o, ce[e], s, s, s, s, s, s, s, s, s);
}
function nr(o, e) {
  return u$1(18, o, d(Ke(e)), s, s, s, s, s, s, s, s, s);
}
function _(o, e, r) {
  return u$1(25, o, r, s, d(e), s, s, s, s, s, s, s);
}
function Ne(o, e, r) {
  return u$1(9, o, s, e.length, s, s, s, s, r, s, s, fe(e));
}
function be(o, e) {
  return u$1(21, o, s, s, s, s, s, s, s, e, s, s);
}
function xe(o, e, r) {
  return u$1(15, o, s, e.length, e.constructor.name, s, s, s, s, r, e.byteOffset, s);
}
function Ie(o, e, r) {
  return u$1(16, o, s, e.length, e.constructor.name, s, s, s, s, r, e.byteOffset, s);
}
function Ae(o, e, r) {
  return u$1(20, o, s, e.byteLength, s, s, s, s, s, r, e.byteOffset, s);
}
function we(o, e, r) {
  return u$1(13, o, me(e), s, s, d(e.message), r, s, s, s, s, s);
}
function Ee(o, e, r) {
  return u$1(14, o, me(e), s, s, d(e.message), r, s, s, s, s, s);
}
function Pe(o, e, r) {
  return u$1(7, o, s, e, s, s, s, s, r, s, s, s);
}
function M(o, e) {
  return u$1(28, s, s, s, s, s, s, s, [o, e], s, s, s);
}
function U(o, e) {
  return u$1(30, s, s, s, s, s, s, s, [o, e], s, s, s);
}
function L(o, e, r) {
  return u$1(31, o, s, s, s, s, s, s, r, e, s, s);
}
function Re(o, e) {
  return u$1(32, o, s, s, s, s, s, s, s, e, s, s);
}
function Oe(o, e) {
  return u$1(33, o, s, s, s, s, s, s, s, e, s, s);
}
function Ce(o, e) {
  return u$1(34, o, s, s, s, s, s, s, s, e, s, s);
}
var { toString: _e } = Object.prototype;
function Er(o, e) {
  return e instanceof Error ? `Seroval caught an error during the ${o} process.
  
${e.name}
${e.message}

- For more information, please check the "cause" property of this error.
- If you believe this is an error in Seroval, please submit an issue at https://github.com/lxsmnsyc/seroval/issues/new` : `Seroval caught an error during the ${o} process.

"${_e.call(e)}"

For more information, please check the "cause" property of this error.`;
}
var ee$1 = class ee extends Error {
  constructor(r, t) {
    super(Er(r, t));
    this.cause = t;
  }
}, E = class extends ee$1 {
  constructor(e) {
    super("parsing", e);
  }
}, Te = class extends ee$1 {
  constructor(e) {
    super("serialization", e);
  }
}, ze = class extends ee$1 {
  constructor(e) {
    super("deserialization", e);
  }
}, g = class extends Error {
  constructor(r) {
    super(`The value ${_e.call(r)} of type "${typeof r}" cannot be parsed/serialized.
      
There are few workarounds for this problem:
- Transform the value in a way that it can be serialized.
- If the reference is present on multiple runtimes (isomorphic), you can use the Reference API to map the references.`);
    this.value = r;
  }
}, y = class extends Error {
  constructor(e) {
    super('Unsupported node type "' + e.t + '".');
  }
}, W = class extends Error {
  constructor(e) {
    super('Missing plugin for tag "' + e + '".');
  }
}, P = class extends Error {
  constructor(e) {
    super('Missing "' + e + '" instance.');
  }
}, ie = class extends Error {
  constructor(r) {
    super('Missing reference for the value "' + _e.call(r) + '" of type "' + typeof r + '"');
    this.value = r;
  }
}, le = class extends Error {
  constructor(e) {
    super('Missing reference for id "' + d(e) + '"');
  }
}, ke = class extends Error {
  constructor(e) {
    super('Unknown TypedArray "' + e + '"');
  }
};
var T = class {
  constructor(e, r) {
    this.value = e;
    this.replacement = r;
  }
};
function z$1(o, e, r) {
  return o & 2 ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>" + (r.startsWith("{") ? "(" + r + ")" : r) : "function(" + e.join(",") + "){return " + r + "}";
}
function S(o, e, r) {
  return o & 2 ? (e.length === 1 ? e[0] : "(" + e.join(",") + ")") + "=>{" + r + "}" : "function(" + e.join(",") + "){" + r + "}";
}
var ar = {}, ir = {};
var lr = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {} };
function Pr(o) {
  return z$1(o, ["r"], "(r.p=new Promise(" + S(o, ["s", "f"], "r.s=s,r.f=f") + "))");
}
function Rr(o) {
  return S(o, ["r", "d"], "r.s(d),r.p.s=1,r.p.v=d");
}
function Or(o) {
  return S(o, ["r", "d"], "r.f(d),r.p.s=2,r.p.v=d");
}
function Cr(o) {
  return z$1(o, ["b", "a", "s", "l", "p", "f", "e", "n"], "(b=[],a=!0,s=!1,l=[],p=0,f=" + S(o, ["v", "m", "x"], "for(x=0;x<p;x++)l[x]&&l[x][m](v)") + ",n=" + S(o, ["o", "x", "z", "c"], 'for(x=0,z=b.length;x<z;x++)(c=b[x],(!a&&x===z-1)?o[s?"return":"throw"](c):o.next(c))') + ",e=" + z$1(o, ["o", "t"], "(a&&(l[t=p++]=o),n(o)," + S(o, [], "a&&(l[t]=void 0)") + ")") + ",{__SEROVAL_STREAM__:!0,on:" + z$1(o, ["o"], "e(o)") + ",next:" + S(o, ["v"], 'a&&(b.push(v),f(v,"next"))') + ",throw:" + S(o, ["v"], 'a&&(b.push(v),f(v,"throw"),a=s=!1,l.length=0)') + ",return:" + S(o, ["v"], 'a&&(b.push(v),f(v,"return"),a=!1,s=!0,l.length=0)') + "})");
}
function cr(o, e) {
  switch (e) {
    case 0:
      return "[]";
    case 1:
      return Pr(o);
    case 2:
      return Rr(o);
    case 3:
      return Or(o);
    case 4:
      return Cr(o);
    default:
      return "";
  }
}
function re$1() {
  let o, e;
  return { promise: new Promise((r, t) => {
    o = r, e = t;
  }), resolve(r) {
    o(r);
  }, reject(r) {
    e(r);
  } };
}
function Fe(o) {
  return "__SEROVAL_STREAM__" in o;
}
function K() {
  let o = /* @__PURE__ */ new Set(), e = [], r = true, t = true;
  function n(l) {
    for (let c of o.keys()) c.next(l);
  }
  function a(l) {
    for (let c of o.keys()) c.throw(l);
  }
  function i(l) {
    for (let c of o.keys()) c.return(l);
  }
  return { __SEROVAL_STREAM__: true, on(l) {
    r && o.add(l);
    for (let c = 0, p2 = e.length; c < p2; c++) {
      let h = e[c];
      c === p2 - 1 && !r ? t ? l.return(h) : l.throw(h) : l.next(h);
    }
    return () => {
      r && o.delete(l);
    };
  }, next(l) {
    r && (e.push(l), n(l));
  }, throw(l) {
    r && (e.push(l), a(l), r = false, t = false, o.clear());
  }, return(l) {
    r && (e.push(l), i(l), r = false, t = true, o.clear());
  } };
}
function Ve(o) {
  let e = K(), r = o[Symbol.asyncIterator]();
  async function t() {
    try {
      let n = await r.next();
      n.done ? e.return(n.value) : (e.next(n.value), await t());
    } catch (n) {
      e.throw(n);
    }
  }
  return t().catch(() => {
  }), e;
}
function ur(o) {
  return () => {
    let e = [], r = [], t = 0, n = -1, a = false;
    function i() {
      for (let c = 0, p2 = r.length; c < p2; c++) r[c].resolve({ done: true, value: void 0 });
    }
    o.on({ next(c) {
      let p2 = r.shift();
      p2 && p2.resolve({ done: false, value: c }), e.push(c);
    }, throw(c) {
      let p2 = r.shift();
      p2 && p2.reject(c), i(), n = e.length, e.push(c), a = true;
    }, return(c) {
      let p2 = r.shift();
      p2 && p2.resolve({ done: true, value: c }), i(), n = e.length, e.push(c);
    } });
    function l() {
      let c = t++, p2 = e[c];
      if (c !== n) return { done: false, value: p2 };
      if (a) throw p2;
      return { done: true, value: p2 };
    }
    return { [Symbol.asyncIterator]() {
      return this;
    }, async next() {
      if (n === -1) {
        let c = t++;
        if (c >= e.length) {
          let p2 = re$1();
          return r.push(p2), await p2.promise;
        }
        return { done: false, value: e[c] };
      }
      return t > n ? { done: true, value: void 0 } : l();
    } };
  };
}
function J(o) {
  let e = [], r = -1, t = -1, n = o[Symbol.iterator]();
  for (; ; ) try {
    let a = n.next();
    if (e.push(a.value), a.done) {
      t = e.length - 1;
      break;
    }
  } catch (a) {
    r = e.length, e.push(a);
  }
  return { v: e, t: r, d: t };
}
function pr(o) {
  return () => {
    let e = 0;
    return { [Symbol.iterator]() {
      return this;
    }, next() {
      if (e > o.d) return { done: true, value: s };
      let r = e++, t = o.v[r];
      if (r === o.t) throw t;
      return { done: r === o.d, value: t };
    } };
  };
}
async function Me(o) {
  try {
    return [1, await o];
  } catch (e) {
    return [0, e];
  }
}
var Y = class {
  constructor(e) {
    this.marked = /* @__PURE__ */ new Set();
    this.plugins = e.plugins, this.features = 31 ^ (e.disabledFeatures || 0), this.refs = e.refs || /* @__PURE__ */ new Map();
  }
  markRef(e) {
    this.marked.add(e);
  }
  isMarked(e) {
    return this.marked.has(e);
  }
  createIndex(e) {
    let r = this.refs.size;
    return this.refs.set(e, r), r;
  }
  getIndexedValue(e) {
    let r = this.refs.get(e);
    return r != null ? (this.markRef(r), { type: 1, value: sr(r) }) : { type: 0, value: this.createIndex(e) };
  }
  getReference(e) {
    let r = this.getIndexedValue(e);
    return r.type === 1 ? r : je(e) ? { type: 2, value: nr(r.value, e) } : r;
  }
  parseWellKnownSymbol(e) {
    let r = this.getReference(e);
    return r.type !== 0 ? r.value : (f(e in ce, new g(e)), or(r.value, e));
  }
  parseSpecialReference(e) {
    let r = this.getIndexedValue(lr[e]);
    return r.type === 1 ? r.value : u$1(26, r.value, e, s, s, s, s, s, s, s, s, s);
  }
  parseIteratorFactory() {
    let e = this.getIndexedValue(ar);
    return e.type === 1 ? e.value : u$1(27, e.value, s, s, s, s, s, s, s, this.parseWellKnownSymbol(Symbol.iterator), s, s);
  }
  parseAsyncIteratorFactory() {
    let e = this.getIndexedValue(ir);
    return e.type === 1 ? e.value : u$1(29, e.value, s, s, s, s, s, s, [this.parseSpecialReference(1), this.parseWellKnownSymbol(Symbol.asyncIterator)], s, s, s);
  }
  createObjectNode(e, r, t, n) {
    return u$1(t ? 11 : 10, e, s, s, s, s, n, s, s, s, s, fe(r));
  }
  createMapNode(e, r, t, n) {
    return u$1(8, e, s, s, s, s, s, { k: r, v: t, s: n }, s, this.parseSpecialReference(0), s, s);
  }
  createPromiseConstructorNode(e, r) {
    return u$1(22, e, r, s, s, s, s, s, s, this.parseSpecialReference(1), s, s);
  }
};
var k = class extends Y {
  async parseItems(e) {
    let r = [];
    for (let t = 0, n = e.length; t < n; t++) t in e && (r[t] = await this.parse(e[t]));
    return r;
  }
  async parseArray(e, r) {
    return Ne(e, r, await this.parseItems(r));
  }
  async parseProperties(e) {
    let r = Object.entries(e), t = [], n = [];
    for (let i = 0, l = r.length; i < l; i++) t.push(d(r[i][0])), n.push(await this.parse(r[i][1]));
    let a = Symbol.iterator;
    return a in e && (t.push(this.parseWellKnownSymbol(a)), n.push(M(this.parseIteratorFactory(), await this.parse(J(e))))), a = Symbol.asyncIterator, a in e && (t.push(this.parseWellKnownSymbol(a)), n.push(U(this.parseAsyncIteratorFactory(), await this.parse(Ve(e))))), a = Symbol.toStringTag, a in e && (t.push(this.parseWellKnownSymbol(a)), n.push(w(e[a]))), a = Symbol.isConcatSpreadable, a in e && (t.push(this.parseWellKnownSymbol(a)), n.push(e[a] ? I : A)), { k: t, v: n, s: t.length };
  }
  async parsePlainObject(e, r, t) {
    return this.createObjectNode(e, r, t, await this.parseProperties(r));
  }
  async parseBoxed(e, r) {
    return be(e, await this.parse(r.valueOf()));
  }
  async parseTypedArray(e, r) {
    return xe(e, r, await this.parse(r.buffer));
  }
  async parseBigIntTypedArray(e, r) {
    return Ie(e, r, await this.parse(r.buffer));
  }
  async parseDataView(e, r) {
    return Ae(e, r, await this.parse(r.buffer));
  }
  async parseError(e, r) {
    let t = j(r, this.features);
    return we(e, r, t ? await this.parseProperties(t) : s);
  }
  async parseAggregateError(e, r) {
    let t = j(r, this.features);
    return Ee(e, r, t ? await this.parseProperties(t) : s);
  }
  async parseMap(e, r) {
    let t = [], n = [];
    for (let [a, i] of r.entries()) t.push(await this.parse(a)), n.push(await this.parse(i));
    return this.createMapNode(e, t, n, r.size);
  }
  async parseSet(e, r) {
    let t = [];
    for (let n of r.keys()) t.push(await this.parse(n));
    return Pe(e, r.size, t);
  }
  async parsePromise(e, r) {
    let [t, n] = await Me(r);
    return u$1(12, e, t, s, s, s, s, s, s, await this.parse(n), s, s);
  }
  async parsePlugin(e, r) {
    let t = this.plugins;
    if (t) for (let n = 0, a = t.length; n < a; n++) {
      let i = t[n];
      if (i.parse.async && i.test(r)) return _(e, i.tag, await i.parse.async(r, this, { id: e }));
    }
    return s;
  }
  async parseStream(e, r) {
    return L(e, this.parseSpecialReference(4), await new Promise((t, n) => {
      let a = [], i = r.on({ next: (l) => {
        this.markRef(e), this.parse(l).then((c) => {
          a.push(Re(e, c));
        }, (c) => {
          n(c), i();
        });
      }, throw: (l) => {
        this.markRef(e), this.parse(l).then((c) => {
          a.push(Oe(e, c)), t(a), i();
        }, (c) => {
          n(c), i();
        });
      }, return: (l) => {
        this.markRef(e), this.parse(l).then((c) => {
          a.push(Ce(e, c)), t(a), i();
        }, (c) => {
          n(c), i();
        });
      } });
    }));
  }
  async parseObject(e, r) {
    if (Array.isArray(r)) return this.parseArray(e, r);
    if (Fe(r)) return this.parseStream(e, r);
    let t = r.constructor;
    if (t === T) return this.parse(r.replacement);
    let n = await this.parsePlugin(e, r);
    if (n) return n;
    switch (t) {
      case Object:
        return this.parsePlainObject(e, r, false);
      case s:
        return this.parsePlainObject(e, r, true);
      case Date:
        return he(e, r);
      case RegExp:
        return ye(e, r);
      case Error:
      case EvalError:
      case RangeError:
      case ReferenceError:
      case SyntaxError:
      case TypeError:
      case URIError:
        return this.parseError(e, r);
      case Number:
      case Boolean:
      case String:
      case BigInt:
        return this.parseBoxed(e, r);
      case ArrayBuffer:
        return ve(e, r);
      case Int8Array:
      case Int16Array:
      case Int32Array:
      case Uint8Array:
      case Uint16Array:
      case Uint32Array:
      case Uint8ClampedArray:
      case Float32Array:
      case Float64Array:
        return this.parseTypedArray(e, r);
      case DataView:
        return this.parseDataView(e, r);
      case Map:
        return this.parseMap(e, r);
      case Set:
        return this.parseSet(e, r);
    }
    if (t === Promise || r instanceof Promise) return this.parsePromise(e, r);
    let a = this.features;
    if (a & 16) switch (t) {
      case BigInt64Array:
      case BigUint64Array:
        return this.parseBigIntTypedArray(e, r);
    }
    if (a & 1 && typeof AggregateError != "undefined" && (t === AggregateError || r instanceof AggregateError)) return this.parseAggregateError(e, r);
    if (r instanceof Error) return this.parseError(e, r);
    if (Symbol.iterator in r || Symbol.asyncIterator in r) return this.parsePlainObject(e, r, !!t);
    throw new g(r);
  }
  async parseFunction(e) {
    let r = this.getReference(e);
    if (r.type !== 0) return r.value;
    let t = await this.parsePlugin(r.value, e);
    if (t) return t;
    throw new g(e);
  }
  async parse(e) {
    switch (typeof e) {
      case "boolean":
        return e ? I : A;
      case "undefined":
        return pe;
      case "string":
        return w(e);
      case "number":
        return ge(e);
      case "bigint":
        return Se(e);
      case "object": {
        if (e) {
          let r = this.getReference(e);
          return r.type === 0 ? await this.parseObject(r.value, e) : r.value;
        }
        return de;
      }
      case "symbol":
        return this.parseWellKnownSymbol(e);
      case "function":
        return this.parseFunction(e);
      default:
        throw new g(e);
    }
  }
  async parseTop(e) {
    try {
      return await this.parse(e);
    } catch (r) {
      throw r instanceof E ? r : new E(r);
    }
  }
};
var $ = class extends k {
  constructor() {
    super(...arguments);
    this.mode = "cross";
  }
};
function dr(o) {
  switch (o) {
    case "Int8Array":
      return Int8Array;
    case "Int16Array":
      return Int16Array;
    case "Int32Array":
      return Int32Array;
    case "Uint8Array":
      return Uint8Array;
    case "Uint16Array":
      return Uint16Array;
    case "Uint32Array":
      return Uint32Array;
    case "Uint8ClampedArray":
      return Uint8ClampedArray;
    case "Float32Array":
      return Float32Array;
    case "Float64Array":
      return Float64Array;
    case "BigInt64Array":
      return BigInt64Array;
    case "BigUint64Array":
      return BigUint64Array;
    default:
      throw new ke(o);
  }
}
function mr(o, e) {
  switch (e) {
    case 3:
      return Object.freeze(o);
    case 1:
      return Object.preventExtensions(o);
    case 2:
      return Object.seal(o);
    default:
      return o;
  }
}
var F = class {
  constructor(e) {
    this.plugins = e.plugins, this.refs = e.refs || /* @__PURE__ */ new Map();
  }
  deserializeReference(e) {
    return this.assignIndexedValue(e.i, Je(N(e.s)));
  }
  deserializeArray(e) {
    let r = e.l, t = this.assignIndexedValue(e.i, new Array(r)), n;
    for (let a = 0; a < r; a++) n = e.a[a], n && (t[a] = this.deserialize(n));
    return mr(t, e.o), t;
  }
  deserializeProperties(e, r) {
    let t = e.s;
    if (t) {
      let n = e.k, a = e.v;
      for (let i = 0, l; i < t; i++) l = n[i], typeof l == "string" ? r[N(l)] = this.deserialize(a[i]) : r[this.deserialize(l)] = this.deserialize(a[i]);
    }
    return r;
  }
  deserializeObject(e) {
    let r = this.assignIndexedValue(e.i, e.t === 10 ? {} : /* @__PURE__ */ Object.create(null));
    return this.deserializeProperties(e.p, r), mr(r, e.o), r;
  }
  deserializeDate(e) {
    return this.assignIndexedValue(e.i, new Date(e.s));
  }
  deserializeRegExp(e) {
    return this.assignIndexedValue(e.i, new RegExp(N(e.c), e.m));
  }
  deserializeSet(e) {
    let r = this.assignIndexedValue(e.i, /* @__PURE__ */ new Set()), t = e.a;
    for (let n = 0, a = e.l; n < a; n++) r.add(this.deserialize(t[n]));
    return r;
  }
  deserializeMap(e) {
    let r = this.assignIndexedValue(e.i, /* @__PURE__ */ new Map()), t = e.e.k, n = e.e.v;
    for (let a = 0, i = e.e.s; a < i; a++) r.set(this.deserialize(t[a]), this.deserialize(n[a]));
    return r;
  }
  deserializeArrayBuffer(e) {
    let r = new Uint8Array(e.s);
    return this.assignIndexedValue(e.i, r.buffer);
  }
  deserializeTypedArray(e) {
    let r = dr(e.c), t = this.deserialize(e.f);
    return this.assignIndexedValue(e.i, new r(t, e.b, e.l));
  }
  deserializeDataView(e) {
    let r = this.deserialize(e.f);
    return this.assignIndexedValue(e.i, new DataView(r, e.b, e.l));
  }
  deserializeDictionary(e, r) {
    if (e.p) {
      let t = this.deserializeProperties(e.p, {});
      Object.assign(r, t);
    }
    return r;
  }
  deserializeAggregateError(e) {
    let r = this.assignIndexedValue(e.i, new AggregateError([], N(e.m)));
    return this.deserializeDictionary(e, r);
  }
  deserializeError(e) {
    let r = Ze[e.s], t = this.assignIndexedValue(e.i, new r(N(e.m)));
    return this.deserializeDictionary(e, t);
  }
  deserializePromise(e) {
    let r = re$1(), t = this.assignIndexedValue(e.i, r), n = this.deserialize(e.f);
    return e.s ? r.resolve(n) : r.reject(n), t.promise;
  }
  deserializeBoxed(e) {
    return this.assignIndexedValue(e.i, Object(this.deserialize(e.f)));
  }
  deserializePlugin(e) {
    let r = this.plugins;
    if (r) {
      let t = N(e.c);
      for (let n = 0, a = r.length; n < a; n++) {
        let i = r[n];
        if (i.tag === t) return this.assignIndexedValue(e.i, i.deserialize(e.s, this, { id: e.i }));
      }
    }
    throw new W(e.c);
  }
  deserializePromiseConstructor(e) {
    return this.assignIndexedValue(e.i, this.assignIndexedValue(e.s, re$1()).promise);
  }
  deserializePromiseResolve(e) {
    let r = this.refs.get(e.i);
    f(r, new P("Promise")), r.resolve(this.deserialize(e.a[1]));
  }
  deserializePromiseReject(e) {
    let r = this.refs.get(e.i);
    f(r, new P("Promise")), r.reject(this.deserialize(e.a[1]));
  }
  deserializeIteratorFactoryInstance(e) {
    this.deserialize(e.a[0]);
    let r = this.deserialize(e.a[1]);
    return pr(r);
  }
  deserializeAsyncIteratorFactoryInstance(e) {
    this.deserialize(e.a[0]);
    let r = this.deserialize(e.a[1]);
    return ur(r);
  }
  deserializeStreamConstructor(e) {
    let r = this.assignIndexedValue(e.i, K()), t = e.a.length;
    if (t) for (let n = 0; n < t; n++) this.deserialize(e.a[n]);
    return r;
  }
  deserializeStreamNext(e) {
    let r = this.refs.get(e.i);
    f(r, new P("Stream")), r.next(this.deserialize(e.f));
  }
  deserializeStreamThrow(e) {
    let r = this.refs.get(e.i);
    f(r, new P("Stream")), r.throw(this.deserialize(e.f));
  }
  deserializeStreamReturn(e) {
    let r = this.refs.get(e.i);
    f(r, new P("Stream")), r.return(this.deserialize(e.f));
  }
  deserializeIteratorFactory(e) {
    this.deserialize(e.f);
  }
  deserializeAsyncIteratorFactory(e) {
    this.deserialize(e.a[1]);
  }
  deserializeTop(e) {
    try {
      return this.deserialize(e);
    } catch (r) {
      throw new ze(r);
    }
  }
  deserialize(e) {
    switch (e.t) {
      case 2:
        return He[e.s];
      case 0:
        return e.s;
      case 1:
        return N(e.s);
      case 3:
        return BigInt(e.s);
      case 4:
        return this.refs.get(e.i);
      case 18:
        return this.deserializeReference(e);
      case 9:
        return this.deserializeArray(e);
      case 10:
      case 11:
        return this.deserializeObject(e);
      case 5:
        return this.deserializeDate(e);
      case 6:
        return this.deserializeRegExp(e);
      case 7:
        return this.deserializeSet(e);
      case 8:
        return this.deserializeMap(e);
      case 19:
        return this.deserializeArrayBuffer(e);
      case 16:
      case 15:
        return this.deserializeTypedArray(e);
      case 20:
        return this.deserializeDataView(e);
      case 14:
        return this.deserializeAggregateError(e);
      case 13:
        return this.deserializeError(e);
      case 12:
        return this.deserializePromise(e);
      case 17:
        return Ge[e.s];
      case 21:
        return this.deserializeBoxed(e);
      case 25:
        return this.deserializePlugin(e);
      case 22:
        return this.deserializePromiseConstructor(e);
      case 23:
        return this.deserializePromiseResolve(e);
      case 24:
        return this.deserializePromiseReject(e);
      case 28:
        return this.deserializeIteratorFactoryInstance(e);
      case 30:
        return this.deserializeAsyncIteratorFactoryInstance(e);
      case 31:
        return this.deserializeStreamConstructor(e);
      case 32:
        return this.deserializeStreamNext(e);
      case 33:
        return this.deserializeStreamThrow(e);
      case 34:
        return this.deserializeStreamReturn(e);
      case 27:
        return this.deserializeIteratorFactory(e);
      case 29:
        return this.deserializeAsyncIteratorFactory(e);
      default:
        throw new y(e);
    }
  }
};
var kr = /^[$A-Z_][0-9A-Z_$]*$/i;
function Le(o) {
  let e = o[0];
  return (e === "$" || e === "_" || e >= "A" && e <= "Z" || e >= "a" && e <= "z") && kr.test(o);
}
function se(o) {
  switch (o.t) {
    case 0:
      return o.s + "=" + o.v;
    case 2:
      return o.s + ".set(" + o.k + "," + o.v + ")";
    case 1:
      return o.s + ".add(" + o.v + ")";
    case 3:
      return o.s + ".delete(" + o.k + ")";
  }
}
function Fr(o) {
  let e = [], r = o[0];
  for (let t = 1, n = o.length, a, i = r; t < n; t++) a = o[t], a.t === 0 && a.v === i.v ? r = { t: 0, s: a.s, k: s, v: se(r) } : a.t === 2 && a.s === i.s ? r = { t: 2, s: se(r), k: a.k, v: a.v } : a.t === 1 && a.s === i.s ? r = { t: 1, s: se(r), k: s, v: a.v } : a.t === 3 && a.s === i.s ? r = { t: 3, s: se(r), k: a.k, v: s } : (e.push(r), r = a), i = a;
  return e.push(r), e;
}
function fr(o) {
  if (o.length) {
    let e = "", r = Fr(o);
    for (let t = 0, n = r.length; t < n; t++) e += se(r[t]) + ",";
    return e;
  }
  return s;
}
var Vr = "Object.create(null)", Dr = "new Set", Br = "new Map", jr = "Promise.resolve", _r = "Promise.reject", Mr = { 3: "Object.freeze", 2: "Object.seal", 1: "Object.preventExtensions", 0: s }, V = class {
  constructor(e) {
    this.stack = [];
    this.flags = [];
    this.assignments = [];
    this.plugins = e.plugins, this.features = e.features, this.marked = new Set(e.markedRefs);
  }
  createFunction(e, r) {
    return z$1(this.features, e, r);
  }
  createEffectfulFunction(e, r) {
    return S(this.features, e, r);
  }
  markRef(e) {
    this.marked.add(e);
  }
  isMarked(e) {
    return this.marked.has(e);
  }
  pushObjectFlag(e, r) {
    e !== 0 && (this.markRef(r), this.flags.push({ type: e, value: this.getRefParam(r) }));
  }
  resolveFlags() {
    let e = "";
    for (let r = 0, t = this.flags, n = t.length; r < n; r++) {
      let a = t[r];
      e += Mr[a.type] + "(" + a.value + "),";
    }
    return e;
  }
  resolvePatches() {
    let e = fr(this.assignments), r = this.resolveFlags();
    return e ? r ? e + r : e : r;
  }
  createAssignment(e, r) {
    this.assignments.push({ t: 0, s: e, k: s, v: r });
  }
  createAddAssignment(e, r) {
    this.assignments.push({ t: 1, s: this.getRefParam(e), k: s, v: r });
  }
  createSetAssignment(e, r, t) {
    this.assignments.push({ t: 2, s: this.getRefParam(e), k: r, v: t });
  }
  createDeleteAssignment(e, r) {
    this.assignments.push({ t: 3, s: this.getRefParam(e), k: r, v: s });
  }
  createArrayAssign(e, r, t) {
    this.createAssignment(this.getRefParam(e) + "[" + r + "]", t);
  }
  createObjectAssign(e, r, t) {
    this.createAssignment(this.getRefParam(e) + "." + r, t);
  }
  isIndexedValueInStack(e) {
    return e.t === 4 && this.stack.includes(e.i);
  }
  serializeReference(e) {
    return this.assignIndexedValue(e.i, O + '.get("' + e.s + '")');
  }
  serializeArrayItem(e, r, t) {
    return r ? this.isIndexedValueInStack(r) ? (this.markRef(e), this.createArrayAssign(e, t, this.getRefParam(r.i)), "") : this.serialize(r) : "";
  }
  serializeArray(e) {
    let r = e.i;
    if (e.l) {
      this.stack.push(r);
      let t = e.a, n = this.serializeArrayItem(r, t[0], 0), a = n === "";
      for (let i = 1, l = e.l, c; i < l; i++) c = this.serializeArrayItem(r, t[i], i), n += "," + c, a = c === "";
      return this.stack.pop(), this.pushObjectFlag(e.o, e.i), this.assignIndexedValue(r, "[" + n + (a ? ",]" : "]"));
    }
    return this.assignIndexedValue(r, "[]");
  }
  serializeProperty(e, r, t) {
    if (typeof r == "string") {
      let n = Number(r), a = n >= 0 && n.toString() === r || Le(r);
      if (this.isIndexedValueInStack(t)) {
        let i = this.getRefParam(t.i);
        return this.markRef(e.i), a && n !== n ? this.createObjectAssign(e.i, r, i) : this.createArrayAssign(e.i, a ? r : '"' + r + '"', i), "";
      }
      return (a ? r : '"' + r + '"') + ":" + this.serialize(t);
    }
    return "[" + this.serialize(r) + "]:" + this.serialize(t);
  }
  serializeProperties(e, r) {
    let t = r.s;
    if (t) {
      let n = r.k, a = r.v;
      this.stack.push(e.i);
      let i = this.serializeProperty(e, n[0], a[0]);
      for (let l = 1, c = i; l < t; l++) c = this.serializeProperty(e, n[l], a[l]), i += (c && i && ",") + c;
      return this.stack.pop(), "{" + i + "}";
    }
    return "{}";
  }
  serializeObject(e) {
    return this.pushObjectFlag(e.o, e.i), this.assignIndexedValue(e.i, this.serializeProperties(e, e.p));
  }
  serializeWithObjectAssign(e, r, t) {
    let n = this.serializeProperties(e, r);
    return n !== "{}" ? "Object.assign(" + t + "," + n + ")" : t;
  }
  serializeStringKeyAssignment(e, r, t, n) {
    let a = this.serialize(n), i = Number(t), l = i >= 0 && i.toString() === t || Le(t);
    if (this.isIndexedValueInStack(n)) l && i !== i ? this.createObjectAssign(e.i, t, a) : this.createArrayAssign(e.i, l ? t : '"' + t + '"', a);
    else {
      let c = this.assignments;
      this.assignments = r, l && i !== i ? this.createObjectAssign(e.i, t, a) : this.createArrayAssign(e.i, l ? t : '"' + t + '"', a), this.assignments = c;
    }
  }
  serializeAssignment(e, r, t, n) {
    if (typeof t == "string") this.serializeStringKeyAssignment(e, r, t, n);
    else {
      let a = this.stack;
      this.stack = [];
      let i = this.serialize(n);
      this.stack = a;
      let l = this.assignments;
      this.assignments = r, this.createArrayAssign(e.i, this.serialize(t), i), this.assignments = l;
    }
  }
  serializeAssignments(e, r) {
    let t = r.s;
    if (t) {
      let n = [], a = r.k, i = r.v;
      this.stack.push(e.i);
      for (let l = 0; l < t; l++) this.serializeAssignment(e, n, a[l], i[l]);
      return this.stack.pop(), fr(n);
    }
    return s;
  }
  serializeDictionary(e, r) {
    if (e.p) if (this.features & 8) r = this.serializeWithObjectAssign(e, e.p, r);
    else {
      this.markRef(e.i);
      let t = this.serializeAssignments(e, e.p);
      if (t) return "(" + this.assignIndexedValue(e.i, r) + "," + t + this.getRefParam(e.i) + ")";
    }
    return this.assignIndexedValue(e.i, r);
  }
  serializeNullConstructor(e) {
    return this.pushObjectFlag(e.o, e.i), this.serializeDictionary(e, Vr);
  }
  serializeDate(e) {
    return this.assignIndexedValue(e.i, 'new Date("' + e.s + '")');
  }
  serializeRegExp(e) {
    return this.assignIndexedValue(e.i, "/" + e.c + "/" + e.m);
  }
  serializeSetItem(e, r) {
    return this.isIndexedValueInStack(r) ? (this.markRef(e), this.createAddAssignment(e, this.getRefParam(r.i)), "") : this.serialize(r);
  }
  serializeSet(e) {
    let r = Dr, t = e.l, n = e.i;
    if (t) {
      let a = e.a;
      this.stack.push(n);
      let i = this.serializeSetItem(n, a[0]);
      for (let l = 1, c = i; l < t; l++) c = this.serializeSetItem(n, a[l]), i += (c && i && ",") + c;
      this.stack.pop(), i && (r += "([" + i + "])");
    }
    return this.assignIndexedValue(n, r);
  }
  serializeMapEntry(e, r, t, n) {
    if (this.isIndexedValueInStack(r)) {
      let a = this.getRefParam(r.i);
      if (this.markRef(e), this.isIndexedValueInStack(t)) {
        let l = this.getRefParam(t.i);
        return this.createSetAssignment(e, a, l), "";
      }
      if (t.t !== 4 && t.i != null && this.isMarked(t.i)) {
        let l = "(" + this.serialize(t) + ",[" + n + "," + n + "])";
        return this.createSetAssignment(e, a, this.getRefParam(t.i)), this.createDeleteAssignment(e, n), l;
      }
      let i = this.stack;
      return this.stack = [], this.createSetAssignment(e, a, this.serialize(t)), this.stack = i, "";
    }
    if (this.isIndexedValueInStack(t)) {
      let a = this.getRefParam(t.i);
      if (this.markRef(e), r.t !== 4 && r.i != null && this.isMarked(r.i)) {
        let l = "(" + this.serialize(r) + ",[" + n + "," + n + "])";
        return this.createSetAssignment(e, this.getRefParam(r.i), a), this.createDeleteAssignment(e, n), l;
      }
      let i = this.stack;
      return this.stack = [], this.createSetAssignment(e, this.serialize(r), a), this.stack = i, "";
    }
    return "[" + this.serialize(r) + "," + this.serialize(t) + "]";
  }
  serializeMap(e) {
    let r = Br, t = e.e.s, n = e.i, a = e.f, i = this.getRefParam(a.i);
    if (t) {
      let l = e.e.k, c = e.e.v;
      this.stack.push(n);
      let p2 = this.serializeMapEntry(n, l[0], c[0], i);
      for (let h = 1, X = p2; h < t; h++) X = this.serializeMapEntry(n, l[h], c[h], i), p2 += (X && p2 && ",") + X;
      this.stack.pop(), p2 && (r += "([" + p2 + "])");
    }
    return a.t === 26 && (this.markRef(a.i), r = "(" + this.serialize(a) + "," + r + ")"), this.assignIndexedValue(n, r);
  }
  serializeArrayBuffer(e) {
    let r = "new Uint8Array(", t = e.s, n = t.length;
    if (n) {
      r += "[" + t[0];
      for (let a = 1; a < n; a++) r += "," + t[a];
      r += "]";
    }
    return this.assignIndexedValue(e.i, r + ").buffer");
  }
  serializeTypedArray(e) {
    return this.assignIndexedValue(e.i, "new " + e.c + "(" + this.serialize(e.f) + "," + e.b + "," + e.l + ")");
  }
  serializeDataView(e) {
    return this.assignIndexedValue(e.i, "new DataView(" + this.serialize(e.f) + "," + e.b + "," + e.l + ")");
  }
  serializeAggregateError(e) {
    let r = e.i;
    this.stack.push(r);
    let t = this.serializeDictionary(e, 'new AggregateError([],"' + e.m + '")');
    return this.stack.pop(), t;
  }
  serializeError(e) {
    return this.serializeDictionary(e, "new " + ue[e.s] + '("' + e.m + '")');
  }
  serializePromise(e) {
    let r, t = e.f, n = e.i, a = e.s ? jr : _r;
    if (this.isIndexedValueInStack(t)) {
      let i = this.getRefParam(t.i);
      r = a + (e.s ? "().then(" + this.createFunction([], i) + ")" : "().catch(" + this.createEffectfulFunction([], "throw " + i) + ")");
    } else {
      this.stack.push(n);
      let i = this.serialize(t);
      this.stack.pop(), r = a + "(" + i + ")";
    }
    return this.assignIndexedValue(n, r);
  }
  serializeWellKnownSymbol(e) {
    return this.assignIndexedValue(e.i, $e[e.s]);
  }
  serializeBoxed(e) {
    return this.assignIndexedValue(e.i, "Object(" + this.serialize(e.f) + ")");
  }
  serializePlugin(e) {
    let r = this.plugins;
    if (r) for (let t = 0, n = r.length; t < n; t++) {
      let a = r[t];
      if (a.tag === e.c) return this.assignIndexedValue(e.i, a.serialize(e.s, this, { id: e.i }));
    }
    throw new W(e.c);
  }
  getConstructor(e) {
    let r = this.serialize(e);
    return r === this.getRefParam(e.i) ? r : "(" + r + ")";
  }
  serializePromiseConstructor(e) {
    let r = this.assignIndexedValue(e.s, "{p:0,s:0,f:0}");
    return this.assignIndexedValue(e.i, this.getConstructor(e.f) + "(" + r + ")");
  }
  serializePromiseResolve(e) {
    return this.getConstructor(e.a[0]) + "(" + this.getRefParam(e.i) + "," + this.serialize(e.a[1]) + ")";
  }
  serializePromiseReject(e) {
    return this.getConstructor(e.a[0]) + "(" + this.getRefParam(e.i) + "," + this.serialize(e.a[1]) + ")";
  }
  serializeSpecialReference(e) {
    return this.assignIndexedValue(e.i, cr(this.features, e.s));
  }
  serializeIteratorFactory(e) {
    let r = "", t = false;
    return e.f.t !== 4 && (this.markRef(e.f.i), r = "(" + this.serialize(e.f) + ",", t = true), r += this.assignIndexedValue(e.i, this.createFunction(["s"], this.createFunction(["i", "c", "d", "t"], "(i=0,t={[" + this.getRefParam(e.f.i) + "]:" + this.createFunction([], "t") + ",next:" + this.createEffectfulFunction([], "if(i>s.d)return{done:!0,value:void 0};if(d=s.v[c=i++],c===s.t)throw d;return{done:c===s.d,value:d}") + "})"))), t && (r += ")"), r;
  }
  serializeIteratorFactoryInstance(e) {
    return this.getConstructor(e.a[0]) + "(" + this.serialize(e.a[1]) + ")";
  }
  serializeAsyncIteratorFactory(e) {
    let r = e.a[0], t = e.a[1], n = "";
    r.t !== 4 && (this.markRef(r.i), n += "(" + this.serialize(r)), t.t !== 4 && (this.markRef(t.i), n += (n ? "," : "(") + this.serialize(t)), n && (n += ",");
    let a = this.assignIndexedValue(e.i, this.createFunction(["s"], this.createFunction(["b", "c", "p", "d", "e", "t", "f"], "(b=[],c=0,p=[],d=-1,e=!1,f=" + this.createEffectfulFunction(["i", "l"], "for(i=0,l=p.length;i<l;i++)p[i].s({done:!0,value:void 0})") + ",s.on({next:" + this.createEffectfulFunction(["v", "t"], "if(t=p.shift())t.s({done:!1,value:v});b.push(v)") + ",throw:" + this.createEffectfulFunction(["v", "t"], "if(t=p.shift())t.f(v);f(),d=b.length,e=!0,b.push(v)") + ",return:" + this.createEffectfulFunction(["v", "t"], "if(t=p.shift())t.s({done:!0,value:v});f(),d=b.length,b.push(v)") + "}),t={[" + this.getRefParam(t.i) + "]:" + this.createFunction([], "t.p") + ",next:" + this.createEffectfulFunction(["i", "t", "v"], "if(d===-1){return((i=c++)>=b.length)?(" + this.getRefParam(r.i) + "(t={p:0,s:0,f:0}),p.push(t),t.p):{done:!1,value:b[i]}}if(c>d)return{done:!0,value:void 0};if(v=b[i=c++],i!==d)return{done:!1,value:v};if(e)throw v;return{done:!0,value:v}") + "})")));
    return n ? n + a + ")" : a;
  }
  serializeAsyncIteratorFactoryInstance(e) {
    return this.getConstructor(e.a[0]) + "(" + this.serialize(e.a[1]) + ")";
  }
  serializeStreamConstructor(e) {
    let r = this.assignIndexedValue(e.i, this.getConstructor(e.f) + "()"), t = e.a.length;
    if (t) {
      let n = this.serialize(e.a[0]);
      for (let a = 1; a < t; a++) n += "," + this.serialize(e.a[a]);
      return "(" + r + "," + n + "," + this.getRefParam(e.i) + ")";
    }
    return r;
  }
  serializeStreamNext(e) {
    return this.getRefParam(e.i) + ".next(" + this.serialize(e.f) + ")";
  }
  serializeStreamThrow(e) {
    return this.getRefParam(e.i) + ".throw(" + this.serialize(e.f) + ")";
  }
  serializeStreamReturn(e) {
    return this.getRefParam(e.i) + ".return(" + this.serialize(e.f) + ")";
  }
  serialize(e) {
    try {
      switch (e.t) {
        case 2:
          return qe[e.s];
        case 0:
          return "" + e.s;
        case 1:
          return '"' + e.s + '"';
        case 3:
          return e.s + "n";
        case 4:
          return this.getRefParam(e.i);
        case 18:
          return this.serializeReference(e);
        case 9:
          return this.serializeArray(e);
        case 10:
          return this.serializeObject(e);
        case 11:
          return this.serializeNullConstructor(e);
        case 5:
          return this.serializeDate(e);
        case 6:
          return this.serializeRegExp(e);
        case 7:
          return this.serializeSet(e);
        case 8:
          return this.serializeMap(e);
        case 19:
          return this.serializeArrayBuffer(e);
        case 16:
        case 15:
          return this.serializeTypedArray(e);
        case 20:
          return this.serializeDataView(e);
        case 14:
          return this.serializeAggregateError(e);
        case 13:
          return this.serializeError(e);
        case 12:
          return this.serializePromise(e);
        case 17:
          return this.serializeWellKnownSymbol(e);
        case 21:
          return this.serializeBoxed(e);
        case 22:
          return this.serializePromiseConstructor(e);
        case 23:
          return this.serializePromiseResolve(e);
        case 24:
          return this.serializePromiseReject(e);
        case 25:
          return this.serializePlugin(e);
        case 26:
          return this.serializeSpecialReference(e);
        case 27:
          return this.serializeIteratorFactory(e);
        case 28:
          return this.serializeIteratorFactoryInstance(e);
        case 29:
          return this.serializeAsyncIteratorFactory(e);
        case 30:
          return this.serializeAsyncIteratorFactoryInstance(e);
        case 31:
          return this.serializeStreamConstructor(e);
        case 32:
          return this.serializeStreamNext(e);
        case 33:
          return this.serializeStreamThrow(e);
        case 34:
          return this.serializeStreamReturn(e);
        default:
          throw new y(e);
      }
    } catch (r) {
      throw new Te(r);
    }
  }
};
var D = class extends V {
  constructor(r) {
    super(r);
    this.mode = "cross";
    this.scopeId = r.scopeId;
  }
  getRefParam(r) {
    return Q + "[" + r + "]";
  }
  assignIndexedValue(r, t) {
    return this.getRefParam(r) + "=" + t;
  }
  serializeTop(r) {
    let t = this.serialize(r), n = r.i;
    if (n == null) return t;
    let a = this.resolvePatches(), i = this.getRefParam(n), l = this.scopeId == null ? "" : Q, c = a ? "(" + t + "," + a + i + ")" : t;
    if (l === "") return r.t === 10 && !a ? "(" + c + ")" : c;
    let p2 = this.scopeId == null ? "()" : "(" + Q + '["' + d(this.scopeId) + '"])';
    return "(" + this.createFunction([l], c) + ")" + p2;
  }
};
var v = class extends Y {
  parseItems(e) {
    let r = [];
    for (let t = 0, n = e.length; t < n; t++) t in e && (r[t] = this.parse(e[t]));
    return r;
  }
  parseArray(e, r) {
    return Ne(e, r, this.parseItems(r));
  }
  parseProperties(e) {
    let r = Object.entries(e), t = [], n = [];
    for (let i = 0, l = r.length; i < l; i++) t.push(d(r[i][0])), n.push(this.parse(r[i][1]));
    let a = Symbol.iterator;
    return a in e && (t.push(this.parseWellKnownSymbol(a)), n.push(M(this.parseIteratorFactory(), this.parse(J(e))))), a = Symbol.asyncIterator, a in e && (t.push(this.parseWellKnownSymbol(a)), n.push(U(this.parseAsyncIteratorFactory(), this.parse(K())))), a = Symbol.toStringTag, a in e && (t.push(this.parseWellKnownSymbol(a)), n.push(w(e[a]))), a = Symbol.isConcatSpreadable, a in e && (t.push(this.parseWellKnownSymbol(a)), n.push(e[a] ? I : A)), { k: t, v: n, s: t.length };
  }
  parsePlainObject(e, r, t) {
    return this.createObjectNode(e, r, t, this.parseProperties(r));
  }
  parseBoxed(e, r) {
    return be(e, this.parse(r.valueOf()));
  }
  parseTypedArray(e, r) {
    return xe(e, r, this.parse(r.buffer));
  }
  parseBigIntTypedArray(e, r) {
    return Ie(e, r, this.parse(r.buffer));
  }
  parseDataView(e, r) {
    return Ae(e, r, this.parse(r.buffer));
  }
  parseError(e, r) {
    let t = j(r, this.features);
    return we(e, r, t ? this.parseProperties(t) : s);
  }
  parseAggregateError(e, r) {
    let t = j(r, this.features);
    return Ee(e, r, t ? this.parseProperties(t) : s);
  }
  parseMap(e, r) {
    let t = [], n = [];
    for (let [a, i] of r.entries()) t.push(this.parse(a)), n.push(this.parse(i));
    return this.createMapNode(e, t, n, r.size);
  }
  parseSet(e, r) {
    let t = [];
    for (let n of r.keys()) t.push(this.parse(n));
    return Pe(e, r.size, t);
  }
  parsePlugin(e, r) {
    let t = this.plugins;
    if (t) for (let n = 0, a = t.length; n < a; n++) {
      let i = t[n];
      if (i.parse.sync && i.test(r)) return _(e, i.tag, i.parse.sync(r, this, { id: e }));
    }
  }
  parseStream(e, r) {
    return L(e, this.parseSpecialReference(4), []);
  }
  parsePromise(e, r) {
    return this.createPromiseConstructorNode(e, this.createIndex({}));
  }
  parseObject(e, r) {
    if (Array.isArray(r)) return this.parseArray(e, r);
    if (Fe(r)) return this.parseStream(e, r);
    let t = r.constructor;
    if (t === T) return this.parse(r.replacement);
    let n = this.parsePlugin(e, r);
    if (n) return n;
    switch (t) {
      case Object:
        return this.parsePlainObject(e, r, false);
      case void 0:
        return this.parsePlainObject(e, r, true);
      case Date:
        return he(e, r);
      case RegExp:
        return ye(e, r);
      case Error:
      case EvalError:
      case RangeError:
      case ReferenceError:
      case SyntaxError:
      case TypeError:
      case URIError:
        return this.parseError(e, r);
      case Number:
      case Boolean:
      case String:
      case BigInt:
        return this.parseBoxed(e, r);
      case ArrayBuffer:
        return ve(e, r);
      case Int8Array:
      case Int16Array:
      case Int32Array:
      case Uint8Array:
      case Uint16Array:
      case Uint32Array:
      case Uint8ClampedArray:
      case Float32Array:
      case Float64Array:
        return this.parseTypedArray(e, r);
      case DataView:
        return this.parseDataView(e, r);
      case Map:
        return this.parseMap(e, r);
      case Set:
        return this.parseSet(e, r);
    }
    if (t === Promise || r instanceof Promise) return this.parsePromise(e, r);
    let a = this.features;
    if (a & 16) switch (t) {
      case BigInt64Array:
      case BigUint64Array:
        return this.parseBigIntTypedArray(e, r);
    }
    if (a & 1 && typeof AggregateError != "undefined" && (t === AggregateError || r instanceof AggregateError)) return this.parseAggregateError(e, r);
    if (r instanceof Error) return this.parseError(e, r);
    if (Symbol.iterator in r || Symbol.asyncIterator in r) return this.parsePlainObject(e, r, !!t);
    throw new g(r);
  }
  parseFunction(e) {
    let r = this.getReference(e);
    if (r.type !== 0) return r.value;
    let t = this.parsePlugin(r.value, e);
    if (t) return t;
    throw new g(e);
  }
  parse(e) {
    switch (typeof e) {
      case "boolean":
        return e ? I : A;
      case "undefined":
        return pe;
      case "string":
        return w(e);
      case "number":
        return ge(e);
      case "bigint":
        return Se(e);
      case "object": {
        if (e) {
          let r = this.getReference(e);
          return r.type === 0 ? this.parseObject(r.value, e) : r.value;
        }
        return de;
      }
      case "symbol":
        return this.parseWellKnownSymbol(e);
      case "function":
        return this.parseFunction(e);
      default:
        throw new g(e);
    }
  }
  parseTop(e) {
    try {
      return this.parse(e);
    } catch (r) {
      throw r instanceof E ? r : new E(r);
    }
  }
};
var oe = class extends v {
  constructor(r) {
    super(r);
    this.alive = true;
    this.pending = 0;
    this.initial = true;
    this.buffer = [];
    this.onParseCallback = r.onParse, this.onErrorCallback = r.onError, this.onDoneCallback = r.onDone;
  }
  onParseInternal(r, t) {
    try {
      this.onParseCallback(r, t);
    } catch (n) {
      this.onError(n);
    }
  }
  flush() {
    for (let r = 0, t = this.buffer.length; r < t; r++) this.onParseInternal(this.buffer[r], false);
  }
  onParse(r) {
    this.initial ? this.buffer.push(r) : this.onParseInternal(r, false);
  }
  onError(r) {
    if (this.onErrorCallback) this.onErrorCallback(r);
    else throw r;
  }
  onDone() {
    this.onDoneCallback && this.onDoneCallback();
  }
  pushPendingState() {
    this.pending++;
  }
  popPendingState() {
    --this.pending <= 0 && this.onDone();
  }
  parseProperties(r) {
    let t = Object.entries(r), n = [], a = [];
    for (let l = 0, c = t.length; l < c; l++) n.push(d(t[l][0])), a.push(this.parse(t[l][1]));
    let i = Symbol.iterator;
    return i in r && (n.push(this.parseWellKnownSymbol(i)), a.push(M(this.parseIteratorFactory(), this.parse(J(r))))), i = Symbol.asyncIterator, i in r && (n.push(this.parseWellKnownSymbol(i)), a.push(U(this.parseAsyncIteratorFactory(), this.parse(Ve(r))))), i = Symbol.toStringTag, i in r && (n.push(this.parseWellKnownSymbol(i)), a.push(w(r[i]))), i = Symbol.isConcatSpreadable, i in r && (n.push(this.parseWellKnownSymbol(i)), a.push(r[i] ? I : A)), { k: n, v: a, s: n.length };
  }
  handlePromiseSuccess(r, t) {
    let n = this.parseWithError(t);
    n && this.onParse(u$1(23, r, s, s, s, s, s, s, [this.parseSpecialReference(2), n], s, s, s)), this.popPendingState();
  }
  handlePromiseFailure(r, t) {
    if (this.alive) {
      let n = this.parseWithError(t);
      n && this.onParse(u$1(24, r, s, s, s, s, s, s, [this.parseSpecialReference(3), n], s, s, s));
    }
    this.popPendingState();
  }
  parsePromise(r, t) {
    let n = this.createIndex({});
    return t.then(this.handlePromiseSuccess.bind(this, n), this.handlePromiseFailure.bind(this, n)), this.pushPendingState(), this.createPromiseConstructorNode(r, n);
  }
  parsePlugin(r, t) {
    let n = this.plugins;
    if (n) for (let a = 0, i = n.length; a < i; a++) {
      let l = n[a];
      if (l.parse.stream && l.test(t)) return _(r, l.tag, l.parse.stream(t, this, { id: r }));
    }
    return s;
  }
  parseStream(r, t) {
    let n = L(r, this.parseSpecialReference(4), []);
    return this.pushPendingState(), t.on({ next: (a) => {
      if (this.alive) {
        let i = this.parseWithError(a);
        i && this.onParse(Re(r, i));
      }
    }, throw: (a) => {
      if (this.alive) {
        let i = this.parseWithError(a);
        i && this.onParse(Oe(r, i));
      }
      this.popPendingState();
    }, return: (a) => {
      if (this.alive) {
        let i = this.parseWithError(a);
        i && this.onParse(Ce(r, i));
      }
      this.popPendingState();
    } }), n;
  }
  parseWithError(r) {
    try {
      return this.parse(r);
    } catch (t) {
      return this.onError(t), s;
    }
  }
  start(r) {
    let t = this.parseWithError(r);
    t && (this.onParseInternal(t, true), this.initial = false, this.flush(), this.pending <= 0 && this.destroy());
  }
  destroy() {
    this.alive && (this.onDone(), this.alive = false);
  }
  isAlive() {
    return this.alive;
  }
};
var G = class extends oe {
  constructor() {
    super(...arguments);
    this.mode = "cross";
  }
};
async function go(o, e = {}) {
  let r = m(e.plugins);
  return await new $({ plugins: r, disabledFeatures: e.disabledFeatures, refs: e.refs }).parseTop(o);
}
function gr(o, e) {
  let r = m(e.plugins), t = new G({ plugins: r, refs: e.refs, disabledFeatures: e.disabledFeatures, onParse(n, a) {
    let i = new D({ plugins: r, features: t.features, scopeId: e.scopeId, markedRefs: t.marked }), l;
    try {
      l = i.serializeTop(n);
    } catch (c) {
      e.onError && e.onError(c);
      return;
    }
    e.onSerialize(l, a);
  }, onError: e.onError, onDone: e.onDone });
  return t.start(o), t.destroy.bind(t);
}
function So(o, e) {
  let r = m(e.plugins), t = new G({ plugins: r, refs: e.refs, disabledFeatures: e.disabledFeatures, onParse: e.onParse, onError: e.onError, onDone: e.onDone });
  return t.start(o), t.destroy.bind(t);
}
var ne = class extends F {
  constructor(r) {
    super(r);
    this.mode = "vanilla";
    this.marked = new Set(r.markedRefs);
  }
  assignIndexedValue(r, t) {
    return this.marked.has(r) && this.refs.set(r, t), t;
  }
};
function Lo(o, e = {}) {
  let r = m(e.plugins);
  return new ne({ plugins: r, markedRefs: o.m }).deserializeTop(o.t);
}
const GLOBAL_TSR = "$_TSR";
function createSerializationAdapter(opts) {
  return opts;
}
function makeSsrSerovalPlugin(serializationAdapter, options) {
  return Hr({
    tag: "$TSR/t/" + serializationAdapter.key,
    test: serializationAdapter.test,
    parse: {
      stream(value, ctx) {
        return ctx.parse(serializationAdapter.toSerializable(value));
      }
    },
    serialize(node, ctx) {
      options.didRun = true;
      return GLOBAL_TSR + '.t.get("' + serializationAdapter.key + '")(' + ctx.serialize(node) + ")";
    },
    // we never deserialize on the server during SSR
    deserialize: void 0
  });
}
function makeSerovalPlugin(serializationAdapter) {
  return Hr({
    tag: "$TSR/t/" + serializationAdapter.key,
    test: serializationAdapter.test,
    parse: {
      sync(value, ctx) {
        return ctx.parse(serializationAdapter.toSerializable(value));
      },
      async async(value, ctx) {
        return await ctx.parse(serializationAdapter.toSerializable(value));
      },
      stream(value, ctx) {
        return ctx.parse(serializationAdapter.toSerializable(value));
      }
    },
    // we don't generate JS code outside of SSR (for now)
    serialize: void 0,
    deserialize(node, ctx) {
      return serializationAdapter.fromSerializable(ctx.deserialize(node));
    }
  });
}
var p = {}, ee2 = Hr({ tag: "seroval-plugins/web/ReadableStreamFactory", test(e) {
  return e === p;
}, parse: { sync() {
}, async async() {
  return await Promise.resolve(void 0);
}, stream() {
} }, serialize(e, r) {
  return r.createFunction(["d"], "new ReadableStream({start:" + r.createEffectfulFunction(["c"], "d.on({next:" + r.createEffectfulFunction(["v"], "try{c.enqueue(v)}catch{}") + ",throw:" + r.createEffectfulFunction(["v"], "c.error(v)") + ",return:" + r.createEffectfulFunction([], "try{c.close()}catch{}") + "})") + "})");
}, deserialize() {
  return p;
} });
function z(e) {
  let r = K(), a = e.getReader();
  async function t() {
    try {
      let n = await a.read();
      n.done ? r.return(n.value) : (r.next(n.value), await t());
    } catch (n) {
      r.throw(n);
    }
  }
  return t().catch(() => {
  }), r;
}
var re = Hr({ tag: "seroval/plugins/web/ReadableStream", extends: [ee2], test(e) {
  return typeof ReadableStream == "undefined" ? false : e instanceof ReadableStream;
}, parse: { sync(e, r) {
  return { factory: r.parse(p), stream: r.parse(K()) };
}, async async(e, r) {
  return { factory: await r.parse(p), stream: await r.parse(z(e)) };
}, stream(e, r) {
  return { factory: r.parse(p), stream: r.parse(z(e)) };
} }, serialize(e, r) {
  return "(" + r.serialize(e.factory) + ")(" + r.serialize(e.stream) + ")";
}, deserialize(e, r) {
  let a = r.deserialize(e.stream);
  return new ReadableStream({ start(t) {
    a.on({ next(n) {
      try {
        t.enqueue(n);
      } catch (b) {
      }
    }, throw(n) {
      t.error(n);
    }, return() {
      try {
        t.close();
      } catch (n) {
      }
    } });
  } });
} }), u = re;
const ShallowErrorPlugin = /* @__PURE__ */ Hr({
  tag: "$TSR/Error",
  test(value) {
    return value instanceof Error;
  },
  parse: {
    sync(value, ctx) {
      return {
        message: ctx.parse(value.message)
      };
    },
    async async(value, ctx) {
      return {
        message: await ctx.parse(value.message)
      };
    },
    stream(value, ctx) {
      return {
        message: ctx.parse(value.message)
      };
    }
  },
  serialize(node, ctx) {
    return "new Error(" + ctx.serialize(node.message) + ")";
  },
  deserialize(node, ctx) {
    return new Error(ctx.deserialize(node.message));
  }
});
const defaultSerovalPlugins = [
  ShallowErrorPlugin,
  // ReadableStreamNode is not exported by seroval
  u
];
const TSS_FORMDATA_CONTEXT = "__TSS_CONTEXT";
const TSS_SERVER_FUNCTION = Symbol.for("TSS_SERVER_FUNCTION");
const X_TSS_SERIALIZED = "x-tss-serialized";
const X_TSS_RAW_RESPONSE = "x-tss-raw";
const startStorage = new AsyncLocalStorage();
async function runWithStartContext(context, fn) {
  return startStorage.run(context, fn);
}
function getStartContext(opts) {
  const context = startStorage.getStore();
  if (!context && opts?.throwIfNotFound !== false) {
    throw new Error(
      `No Start context found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`
    );
  }
  return context;
}
const getStartOptions = () => getStartContext().startOptions;
function flattenMiddlewares(middlewares) {
  const seen = /* @__PURE__ */ new Set();
  const flattened = [];
  const recurse = (middleware) => {
    middleware.forEach((m2) => {
      if (m2.options.middleware) {
        recurse(m2.options.middleware);
      }
      if (!seen.has(m2)) {
        seen.add(m2);
        flattened.push(m2);
      }
    });
  };
  recurse(middlewares);
  return flattened;
}
function getDefaultSerovalPlugins() {
  const start = getStartOptions();
  const adapters = start?.serializationAdapters;
  return [
    ...adapters?.map(makeSerovalPlugin) ?? [],
    ...defaultSerovalPlugins
  ];
}
const minifiedTsrBootStrapScript = 'self.$_TSR={c(){document.querySelectorAll(".\\\\$tsr").forEach(e=>{e.remove()})},p(e){this.initialized?e():this.buffer.push(e)},buffer:[]};\n';
const SCOPE_ID = "tsr";
function dehydrateMatch(match) {
  const dehydratedMatch = {
    i: match.id,
    u: match.updatedAt,
    s: match.status
  };
  const properties = [
    ["__beforeLoadContext", "b"],
    ["loaderData", "l"],
    ["error", "e"],
    ["ssr", "ssr"]
  ];
  for (const [key, shorthand] of properties) {
    if (match[key] !== void 0) {
      dehydratedMatch[shorthand] = match[key];
    }
  }
  return dehydratedMatch;
}
function attachRouterServerSsrUtils({
  router,
  manifest: manifest2
}) {
  router.ssr = {
    manifest: manifest2
  };
  let initialScriptSent = false;
  const getInitialScript = () => {
    if (initialScriptSent) {
      return "";
    }
    initialScriptSent = true;
    return `${xr(SCOPE_ID)};${minifiedTsrBootStrapScript};`;
  };
  let _dehydrated = false;
  const listeners = [];
  router.serverSsr = {
    injectedHtml: [],
    injectHtml: (getHtml) => {
      const promise = Promise.resolve().then(getHtml);
      router.serverSsr.injectedHtml.push(promise);
      router.emit({
        type: "onInjectedHtml",
        promise
      });
      return promise.then(() => {
      });
    },
    injectScript: (getScript) => {
      return router.serverSsr.injectHtml(async () => {
        const script = await getScript();
        return `<script ${router.options.ssr?.nonce ? `nonce='${router.options.ssr.nonce}'` : ""} class='$tsr'>${getInitialScript()}${script};$_TSR.c()<\/script>`;
      });
    },
    dehydrate: async () => {
      invariant(!_dehydrated);
      let matchesToDehydrate = router.state.matches;
      if (router.isShell()) {
        matchesToDehydrate = matchesToDehydrate.slice(0, 1);
      }
      const matches = matchesToDehydrate.map(dehydrateMatch);
      const dehydratedRouter = {
        manifest: router.ssr.manifest,
        matches
      };
      const lastMatchId = matchesToDehydrate[matchesToDehydrate.length - 1]?.id;
      if (lastMatchId) {
        dehydratedRouter.lastMatchId = lastMatchId;
      }
      dehydratedRouter.dehydratedData = await router.options.dehydrate?.();
      _dehydrated = true;
      const p2 = createControlledPromise();
      const trackPlugins = { didRun: false };
      const plugins = router.options.serializationAdapters?.map((t) => makeSsrSerovalPlugin(t, trackPlugins)) ?? [];
      gr(dehydratedRouter, {
        refs: /* @__PURE__ */ new Map(),
        plugins: [...plugins, ...defaultSerovalPlugins],
        onSerialize: (data, initial) => {
          let serialized = initial ? GLOBAL_TSR + ".router=" + data : data;
          if (trackPlugins.didRun) {
            serialized = GLOBAL_TSR + ".p(()=>" + serialized + ")";
          }
          router.serverSsr.injectScript(() => serialized);
        },
        scopeId: SCOPE_ID,
        onDone: () => p2.resolve(""),
        onError: (err) => p2.reject(err)
      });
      router.serverSsr.injectHtml(() => p2);
    },
    isDehydrated() {
      return _dehydrated;
    },
    onRenderFinished: (listener) => listeners.push(listener),
    setRenderFinished: () => {
      listeners.forEach((l) => l());
    }
  };
}
function getOrigin(request) {
  const originHeader = request.headers.get("Origin");
  if (originHeader) {
    try {
      new URL(originHeader);
      return originHeader;
    } catch {
    }
  }
  try {
    return new URL(request.url).origin;
  } catch {
  }
  return "http://localhost";
}
const NullProtoObj = /* @__PURE__ */ (() => {
  const e = function() {
  };
  return e.prototype = /* @__PURE__ */ Object.create(null), Object.freeze(e.prototype), e;
})();
function splitSetCookieString(cookiesString) {
  if (Array.isArray(cookiesString)) return cookiesString.flatMap((c) => splitSetCookieString(c));
  if (typeof cookiesString !== "string") return [];
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) pos += 1;
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) pos += 1;
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else pos = lastComma + 1;
      } else pos += 1;
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) cookiesStrings.push(cookiesString.slice(start));
  }
  return cookiesStrings;
}
function lazyInherit(target, source, sourceKey) {
  for (const key of Object.getOwnPropertyNames(source)) {
    if (key === "constructor") continue;
    const targetDesc = Object.getOwnPropertyDescriptor(target, key);
    const desc = Object.getOwnPropertyDescriptor(source, key);
    let modified = false;
    if (desc.get) {
      modified = true;
      desc.get = targetDesc?.get || function() {
        return this[sourceKey][key];
      };
    }
    if (desc.set) {
      modified = true;
      desc.set = targetDesc?.set || function(value) {
        this[sourceKey][key] = value;
      };
    }
    if (typeof desc.value === "function") {
      modified = true;
      desc.value = function(...args) {
        return this[sourceKey][key](...args);
      };
    }
    if (modified) Object.defineProperty(target, key, desc);
  }
}
const FastURL = /* @__PURE__ */ (() => {
  const NativeURL = globalThis.URL;
  const FastURL$1 = class URL {
    #url;
    #href;
    #protocol;
    #host;
    #pathname;
    #search;
    #searchParams;
    #pos;
    constructor(url) {
      if (typeof url === "string") this.#href = url;
      else {
        this.#protocol = url.protocol;
        this.#host = url.host;
        this.#pathname = url.pathname;
        this.#search = url.search;
      }
    }
    get _url() {
      if (this.#url) return this.#url;
      this.#url = new NativeURL(this.href);
      this.#href = void 0;
      this.#protocol = void 0;
      this.#host = void 0;
      this.#pathname = void 0;
      this.#search = void 0;
      this.#searchParams = void 0;
      this.#pos = void 0;
      return this.#url;
    }
    get href() {
      if (this.#url) return this.#url.href;
      if (!this.#href) this.#href = `${this.#protocol || "http:"}//${this.#host || "localhost"}${this.#pathname || "/"}${this.#search || ""}`;
      return this.#href;
    }
    #getPos() {
      if (!this.#pos) {
        const url = this.href;
        const protoIndex = url.indexOf("://");
        const pathnameIndex = protoIndex === -1 ? -1 : url.indexOf("/", protoIndex + 4);
        const qIndex = pathnameIndex === -1 ? -1 : url.indexOf("?", pathnameIndex);
        this.#pos = [
          protoIndex,
          pathnameIndex,
          qIndex
        ];
      }
      return this.#pos;
    }
    get pathname() {
      if (this.#url) return this.#url.pathname;
      if (this.#pathname === void 0) {
        const [, pathnameIndex, queryIndex] = this.#getPos();
        if (pathnameIndex === -1) return this._url.pathname;
        this.#pathname = this.href.slice(pathnameIndex, queryIndex === -1 ? void 0 : queryIndex);
      }
      return this.#pathname;
    }
    get search() {
      if (this.#url) return this.#url.search;
      if (this.#search === void 0) {
        const [, pathnameIndex, queryIndex] = this.#getPos();
        if (pathnameIndex === -1) return this._url.search;
        const url = this.href;
        this.#search = queryIndex === -1 || queryIndex === url.length - 1 ? "" : url.slice(queryIndex);
      }
      return this.#search;
    }
    get searchParams() {
      if (this.#url) return this.#url.searchParams;
      if (!this.#searchParams) this.#searchParams = new URLSearchParams(this.search);
      return this.#searchParams;
    }
    get protocol() {
      if (this.#url) return this.#url.protocol;
      if (this.#protocol === void 0) {
        const [protocolIndex] = this.#getPos();
        if (protocolIndex === -1) return this._url.protocol;
        const url = this.href;
        this.#protocol = url.slice(0, protocolIndex + 1);
      }
      return this.#protocol;
    }
    toString() {
      return this.href;
    }
    toJSON() {
      return this.href;
    }
  };
  lazyInherit(FastURL$1.prototype, NativeURL.prototype, "_url");
  Object.setPrototypeOf(FastURL$1.prototype, NativeURL.prototype);
  Object.setPrototypeOf(FastURL$1, NativeURL);
  return FastURL$1;
})();
const NodeResponse = /* @__PURE__ */ (() => {
  const NativeResponse = globalThis.Response;
  const STATUS_CODES = globalThis.process?.getBuiltinModule?.("node:http")?.STATUS_CODES || {};
  class NodeResponse$1 {
    #body;
    #init;
    #headers;
    #response;
    constructor(body, init) {
      this.#body = body;
      this.#init = init;
    }
    get status() {
      return this.#response?.status || this.#init?.status || 200;
    }
    get statusText() {
      return this.#response?.statusText || this.#init?.statusText || STATUS_CODES[this.status] || "";
    }
    get headers() {
      if (this.#response) return this.#response.headers;
      if (this.#headers) return this.#headers;
      const initHeaders = this.#init?.headers;
      return this.#headers = initHeaders instanceof Headers ? initHeaders : new Headers(initHeaders);
    }
    get ok() {
      if (this.#response) return this.#response.ok;
      const status = this.status;
      return status >= 200 && status < 300;
    }
    get _response() {
      if (this.#response) return this.#response;
      this.#response = new NativeResponse(this.#body, this.#headers ? {
        ...this.#init,
        headers: this.#headers
      } : this.#init);
      this.#init = void 0;
      this.#headers = void 0;
      this.#body = void 0;
      return this.#response;
    }
    nodeResponse() {
      const status = this.status;
      const statusText = this.statusText;
      let body;
      let contentType;
      let contentLength;
      if (this.#response) body = this.#response.body;
      else if (this.#body) if (this.#body instanceof ReadableStream) body = this.#body;
      else if (typeof this.#body === "string") {
        body = this.#body;
        contentType = "text/plain; charset=UTF-8";
        contentLength = Buffer.byteLength(this.#body);
      } else if (this.#body instanceof ArrayBuffer) {
        body = Buffer.from(this.#body);
        contentLength = this.#body.byteLength;
      } else if (this.#body instanceof Uint8Array) {
        body = this.#body;
        contentLength = this.#body.byteLength;
      } else if (this.#body instanceof DataView) {
        body = Buffer.from(this.#body.buffer);
        contentLength = this.#body.byteLength;
      } else if (this.#body instanceof Blob) {
        body = this.#body.stream();
        contentType = this.#body.type;
        contentLength = this.#body.size;
      } else if (typeof this.#body.pipe === "function") body = this.#body;
      else body = this._response.body;
      const rawNodeHeaders = [];
      const initHeaders = this.#init?.headers;
      const headerEntries = this.#response?.headers || this.#headers || (initHeaders ? Array.isArray(initHeaders) ? initHeaders : initHeaders?.entries ? initHeaders.entries() : Object.entries(initHeaders).map(([k2, v2]) => [k2.toLowerCase(), v2]) : void 0);
      let hasContentTypeHeader;
      let hasContentLength;
      if (headerEntries) for (const [key, value] of headerEntries) {
        if (key === "set-cookie") {
          for (const setCookie of splitSetCookieString(value)) rawNodeHeaders.push(["set-cookie", setCookie]);
          continue;
        }
        rawNodeHeaders.push([key, value]);
        if (key === "content-type") hasContentTypeHeader = true;
        else if (key === "content-length") hasContentLength = true;
      }
      if (contentType && !hasContentTypeHeader) rawNodeHeaders.push(["content-type", contentType]);
      if (contentLength && !hasContentLength) rawNodeHeaders.push(["content-length", String(contentLength)]);
      this.#init = void 0;
      this.#headers = void 0;
      this.#response = void 0;
      this.#body = void 0;
      return {
        status,
        statusText,
        headers: rawNodeHeaders,
        body
      };
    }
  }
  lazyInherit(NodeResponse$1.prototype, NativeResponse.prototype, "_response");
  Object.setPrototypeOf(NodeResponse$1, NativeResponse);
  Object.setPrototypeOf(NodeResponse$1.prototype, NativeResponse.prototype);
  return NodeResponse$1;
})();
var H3Event = class {
  /**
  * Access to the H3 application instance.
  */
  app;
  /**
  * Incoming HTTP request info.
  *
  * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/Request)
  */
  req;
  /**
  * Access to the parsed request URL.
  *
  * [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/URL)
  */
  url;
  /**
  * Event context.
  */
  context;
  /**
  * @internal
  */
  static __is_event__ = true;
  /**
  * @internal
  */
  _res;
  constructor(req, context, app) {
    this.context = context || req.context || new NullProtoObj();
    this.req = req;
    this.app = app;
    const _url = req._url;
    this.url = _url && _url instanceof URL ? _url : new FastURL(req.url);
  }
  /**
  * Prepared HTTP response.
  */
  get res() {
    if (!this._res) this._res = new H3EventResponse();
    return this._res;
  }
  /**
  * Access to runtime specific additional context.
  *
  */
  get runtime() {
    return this.req.runtime;
  }
  /**
  * Tell the runtime about an ongoing operation that shouldn't close until the promise resolves.
  */
  waitUntil(promise) {
    this.req.waitUntil?.(promise);
  }
  toString() {
    return `[${this.req.method}] ${this.req.url}`;
  }
  toJSON() {
    return this.toString();
  }
  /**
  * Access to the raw Node.js req/res objects.
  *
  * @deprecated Use `event.runtime.{node|deno|bun|...}.` instead.
  */
  get node() {
    return this.req.runtime?.node;
  }
  /**
  * Access to the incoming request headers.
  *
  * @deprecated Use `event.req.headers` instead.
  *
  */
  get headers() {
    return this.req.headers;
  }
  /**
  * Access to the incoming request url (pathname+search).
  *
  * @deprecated Use `event.url.pathname + event.url.search` instead.
  *
  * Example: `/api/hello?name=world`
  * */
  get path() {
    return this.url.pathname + this.url.search;
  }
  /**
  * Access to the incoming request method.
  *
  * @deprecated Use `event.req.method` instead.
  */
  get method() {
    return this.req.method;
  }
};
var H3EventResponse = class {
  status;
  statusText;
  _headers;
  get headers() {
    if (!this._headers) this._headers = new Headers();
    return this._headers;
  }
};
const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) return defaultStatusCode;
  if (typeof statusCode === "string") statusCode = +statusCode;
  if (statusCode < 100 || statusCode > 599) return defaultStatusCode;
  return statusCode;
}
var HTTPError = class HTTPError2 extends Error {
  get name() {
    return "HTTPError";
  }
  /**
  * HTTP status code in range [200...599]
  */
  status;
  /**
  * HTTP status text
  *
  * **NOTE:** This should be short (max 512 to 1024 characters).
  * Allowed characters are tabs, spaces, visible ASCII characters, and extended characters (byte value 128–255).
  *
  * **TIP:** Use `message` for longer error descriptions in JSON body.
  */
  statusText;
  /**
  * Additional HTTP headers to be sent in error response.
  */
  headers;
  /**
  * Original error object that caused this error.
  */
  cause;
  /**
  * Additional data attached in the error JSON body under `data` key.
  */
  data;
  /**
  * Additional top level JSON body properties to attach in the error JSON body.
  */
  body;
  /**
  * Flag to indicate that the error was not handled by the application.
  *
  * Unhandled error stack trace, data and message are hidden in non debug mode for security reasons.
  */
  unhandled;
  /**
  * Check if the input is an instance of HTTPError using its constructor name.
  *
  * It is safer than using `instanceof` because it works across different contexts (e.g., if the error was thrown in a different module).
  */
  static isError(input) {
    return input instanceof Error && input?.name === "HTTPError";
  }
  /**
  * Create a new HTTPError with the given status code and optional status text and details.
  *
  * @example
  *
  * HTTPError.status(404)
  * HTTPError.status(418, "I'm a teapot")
  * HTTPError.status(403, "Forbidden", { message: "Not authenticated" })
  */
  static status(status, statusText, details) {
    return new HTTPError2({
      ...details,
      statusText,
      status
    });
  }
  constructor(arg1, arg2) {
    let messageInput;
    let details;
    if (typeof arg1 === "string") {
      messageInput = arg1;
      details = arg2;
    } else details = arg1;
    const status = sanitizeStatusCode(details?.status || details?.cause?.status || details?.status || details?.statusCode, 500);
    const statusText = sanitizeStatusMessage(details?.statusText || details?.cause?.statusText || details?.statusText || details?.statusMessage);
    const message = messageInput || details?.message || details?.cause?.message || details?.statusText || details?.statusMessage || [
      "HTTPError",
      status,
      statusText
    ].filter(Boolean).join(" ");
    super(message, { cause: details });
    this.cause = details;
    Error.captureStackTrace?.(this, this.constructor);
    this.status = status;
    this.statusText = statusText || void 0;
    const rawHeaders = details?.headers || details?.cause?.headers;
    this.headers = rawHeaders ? new Headers(rawHeaders) : void 0;
    this.unhandled = details?.unhandled ?? details?.cause?.unhandled ?? void 0;
    this.data = details?.data;
    this.body = details?.body;
  }
  /**
  * @deprecated Use `status`
  */
  get statusCode() {
    return this.status;
  }
  /**
  * @deprecated Use `statusText`
  */
  get statusMessage() {
    return this.statusText;
  }
  toJSON() {
    const unhandled = this.unhandled;
    return {
      status: this.status,
      statusText: this.statusText,
      unhandled,
      message: unhandled ? "HTTPError" : this.message,
      data: unhandled ? void 0 : this.data,
      ...unhandled ? void 0 : this.body
    };
  }
};
function isJSONSerializable(value, _type) {
  if (value === null || value === void 0) return true;
  if (_type !== "object") return _type === "boolean" || _type === "number" || _type === "string";
  if (typeof value.toJSON === "function") return true;
  if (Array.isArray(value)) return true;
  if (typeof value.pipe === "function" || typeof value.pipeTo === "function") return false;
  if (value instanceof NullProtoObj) return true;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
const kNotFound = /* @__PURE__ */ Symbol.for("h3.notFound");
const kHandled = /* @__PURE__ */ Symbol.for("h3.handled");
function toResponse(val, event, config = {}) {
  if (typeof val?.then === "function") return (val.catch?.((error) => error) || Promise.resolve(val)).then((resolvedVal) => toResponse(resolvedVal, event, config));
  const response = prepareResponse(val, event, config);
  if (typeof response?.then === "function") return toResponse(response, event, config);
  const { onResponse: onResponse$1 } = config;
  return onResponse$1 ? Promise.resolve(onResponse$1(response, event)).then(() => response) : response;
}
function prepareResponse(val, event, config, nested) {
  if (val === kHandled) return new NodeResponse(null);
  if (val === kNotFound) val = new HTTPError({
    status: 404,
    message: `Cannot find any route matching [${event.req.method}] ${event.url}`
  });
  if (val && val instanceof Error) {
    const isHTTPError = HTTPError.isError(val);
    const error = isHTTPError ? val : new HTTPError(val);
    if (!isHTTPError) {
      error.unhandled = true;
      if (val?.stack) error.stack = val.stack;
    }
    if (error.unhandled && !config.silent) console.error(error);
    const { onError: onError$1 } = config;
    return onError$1 && !nested ? Promise.resolve(onError$1(error, event)).catch((error$1) => error$1).then((newVal) => prepareResponse(newVal ?? val, event, config, true)) : errorResponse(error, config.debug);
  }
  const eventHeaders = event.res._headers;
  if (!(val instanceof Response)) {
    const res = prepareResponseBody(val, event, config);
    const status = event.res.status;
    return new NodeResponse(nullBody(event.req.method, status) ? null : res.body, {
      status,
      statusText: event.res.statusText,
      headers: res.headers && eventHeaders ? mergeHeaders$1(res.headers, eventHeaders) : res.headers || eventHeaders
    });
  }
  if (!eventHeaders) return val;
  return new NodeResponse(nullBody(event.req.method, val.status) ? null : val.body, {
    status: val.status,
    statusText: val.statusText,
    headers: mergeHeaders$1(eventHeaders, val.headers)
  });
}
function mergeHeaders$1(base, merge) {
  const mergedHeaders = new Headers(base);
  for (const [name, value] of merge) if (name === "set-cookie") mergedHeaders.append(name, value);
  else mergedHeaders.set(name, value);
  return mergedHeaders;
}
const emptyHeaders = /* @__PURE__ */ new Headers({ "content-length": "0" });
const jsonHeaders = /* @__PURE__ */ new Headers({ "content-type": "application/json;charset=UTF-8" });
function prepareResponseBody(val, event, config) {
  if (val === null || val === void 0) return {
    body: "",
    headers: emptyHeaders
  };
  const valType = typeof val;
  if (valType === "string") return { body: val };
  if (val instanceof Uint8Array) {
    event.res.headers.set("content-length", val.byteLength.toString());
    return { body: val };
  }
  if (isJSONSerializable(val, valType)) return {
    body: JSON.stringify(val, void 0, config.debug ? 2 : void 0),
    headers: jsonHeaders
  };
  if (valType === "bigint") return {
    body: val.toString(),
    headers: jsonHeaders
  };
  if (val instanceof Blob) {
    const headers = {
      "content-type": val.type,
      "content-length": val.size.toString()
    };
    let filename = val.name;
    if (filename) {
      filename = encodeURIComponent(filename);
      headers["content-disposition"] = `filename="${filename}"; filename*=UTF-8''${filename}`;
    }
    return {
      body: val.stream(),
      headers
    };
  }
  if (valType === "symbol") return { body: val.toString() };
  if (valType === "function") return { body: `${val.name}()` };
  return { body: val };
}
function nullBody(method, status) {
  return method === "HEAD" || status === 100 || status === 101 || status === 102 || status === 204 || status === 205 || status === 304;
}
function errorResponse(error, debug) {
  return new NodeResponse(JSON.stringify({
    ...error.toJSON(),
    stack: debug && error.stack ? error.stack.split("\n").map((l) => l.trim()) : void 0
  }, void 0, debug ? 2 : void 0), {
    status: error.status,
    statusText: error.statusText,
    headers: error.headers ? mergeHeaders$1(jsonHeaders, error.headers) : jsonHeaders
  });
}
const eventStorage = new AsyncLocalStorage();
function requestHandler(handler) {
  return (request, requestOpts) => {
    const h3Event = new H3Event(request);
    const response = eventStorage.run(
      { h3Event },
      () => handler(request, requestOpts)
    );
    return toResponse(response, h3Event);
  };
}
function getH3Event() {
  const event = eventStorage.getStore();
  if (!event) {
    throw new Error(
      `No StartEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`
    );
  }
  return event.h3Event;
}
function getResponse() {
  const event = getH3Event();
  return event._res;
}
const VIRTUAL_MODULES = {
  startManifest: "tanstack-start-manifest:v",
  injectedHeadScripts: "tanstack-start-injected-head-scripts:v"
};
async function loadVirtualModule(id) {
  switch (id) {
    case VIRTUAL_MODULES.startManifest:
      return await import('../_/_tanstack-start-manifest_v-C4FO4LtN.mjs');
    case VIRTUAL_MODULES.injectedHeadScripts:
      return await import('../_/_tanstack-start-injected-head-scripts_v-DBbVcQpM.mjs');
    default:
      throw new Error(`Unknown virtual module: ${id}`);
  }
}
async function getStartManifest() {
  const { tsrStartManifest } = await loadVirtualModule(
    VIRTUAL_MODULES.startManifest
  );
  const startManifest = tsrStartManifest();
  const rootRoute = startManifest.routes[rootRouteId] = startManifest.routes[rootRouteId] || {};
  rootRoute.assets = rootRoute.assets || [];
  let script = `import('${startManifest.clientEntry}')`;
  rootRoute.assets.push({
    tag: "script",
    attrs: {
      type: "module",
      suppressHydrationWarning: true,
      async: true
    },
    children: script
  });
  const manifest2 = {
    ...startManifest,
    routes: Object.fromEntries(
      Object.entries(startManifest.routes).map(([k2, v2]) => {
        const { preloads, assets } = v2;
        const result = {};
        if (preloads) {
          result["preloads"] = preloads;
        }
        if (assets) {
          result["assets"] = assets;
        }
        return [k2, result];
      })
    )
  };
  return manifest2;
}
const manifest = {};
async function getServerFnById(id) {
  const serverFnInfo = manifest[id];
  if (!serverFnInfo) {
    throw new Error("Server function info not found for " + id);
  }
  const fnModule = await serverFnInfo.importer();
  if (!fnModule) {
    console.info("serverFnInfo", serverFnInfo);
    throw new Error("Server function module not resolved for " + id);
  }
  const action = fnModule[serverFnInfo.functionName];
  if (!action) {
    console.info("serverFnInfo", serverFnInfo);
    console.info("fnModule", fnModule);
    throw new Error(
      `Server function module export not resolved for serverFn ID: ${id}`
    );
  }
  return action;
}
let regex = void 0;
const handleServerAction = async ({
  request,
  context
}) => {
  const controller = new AbortController();
  const signal = controller.signal;
  const abort = () => controller.abort();
  request.signal.addEventListener("abort", abort);
  if (regex === void 0) {
    regex = new RegExp(`${"/_serverFn/"}([^/?#]+)`);
  }
  const method = request.method;
  const url = new URL(request.url, "http://localhost:3000");
  const match = url.pathname.match(regex);
  const serverFnId = match ? match[1] : null;
  const search = Object.fromEntries(url.searchParams.entries());
  const isCreateServerFn = "createServerFn" in search;
  if (typeof serverFnId !== "string") {
    throw new Error("Invalid server action param for serverFnId: " + serverFnId);
  }
  const action = await getServerFnById(serverFnId);
  const formDataContentTypes = [
    "multipart/form-data",
    "application/x-www-form-urlencoded"
  ];
  const contentType = request.headers.get("Content-Type");
  const serovalPlugins = getDefaultSerovalPlugins();
  function parsePayload(payload) {
    const parsedPayload = Lo(payload, { plugins: serovalPlugins });
    return parsedPayload;
  }
  const response = await (async () => {
    try {
      let result = await (async () => {
        if (formDataContentTypes.some(
          (type) => contentType && contentType.includes(type)
        )) {
          invariant(
            method.toLowerCase() !== "get",
            "GET requests with FormData payloads are not supported"
          );
          const formData = await request.formData();
          const serializedContext = formData.get(TSS_FORMDATA_CONTEXT);
          formData.delete(TSS_FORMDATA_CONTEXT);
          const params = {
            context,
            data: formData
          };
          if (typeof serializedContext === "string") {
            try {
              const parsedContext = JSON.parse(serializedContext);
              if (typeof parsedContext === "object" && parsedContext) {
                params.context = { ...context, ...parsedContext };
              }
            } catch {
            }
          }
          return await action(params, signal);
        }
        if (method.toLowerCase() === "get") {
          invariant(
            isCreateServerFn,
            "expected GET request to originate from createServerFn"
          );
          let payload = search.payload;
          payload = payload ? parsePayload(JSON.parse(payload)) : {};
          payload.context = { ...context, ...payload.context };
          return await action(payload, signal);
        }
        if (method.toLowerCase() !== "post") {
          throw new Error("expected POST method");
        }
        let jsonPayload;
        if (contentType?.includes("application/json")) {
          jsonPayload = await request.json();
        }
        if (isCreateServerFn) {
          const payload = jsonPayload ? parsePayload(jsonPayload) : {};
          payload.context = { ...payload.context, ...context };
          return await action(payload, signal);
        }
        return await action(...jsonPayload);
      })();
      if (result.result instanceof Response) {
        result.result.headers.set(X_TSS_RAW_RESPONSE, "true");
        return result.result;
      }
      if (!isCreateServerFn) {
        result = result.result;
        if (result instanceof Response) {
          return result;
        }
      }
      if (isNotFound(result)) {
        return isNotFoundResponse(result);
      }
      const response2 = getResponse();
      let nonStreamingBody = void 0;
      if (result !== void 0) {
        let done = false;
        const callbacks = {
          onParse: (value) => {
            nonStreamingBody = value;
          },
          onDone: () => {
            done = true;
          },
          onError: (error) => {
            throw error;
          }
        };
        So(result, {
          refs: /* @__PURE__ */ new Map(),
          plugins: serovalPlugins,
          onParse(value) {
            callbacks.onParse(value);
          },
          onDone() {
            callbacks.onDone();
          },
          onError: (error) => {
            callbacks.onError(error);
          }
        });
        if (done) {
          return new Response(
            nonStreamingBody ? JSON.stringify(nonStreamingBody) : void 0,
            {
              status: response2?.status,
              statusText: response2?.statusText,
              headers: {
                "Content-Type": "application/json",
                [X_TSS_SERIALIZED]: "true"
              }
            }
          );
        }
        const stream = new ReadableStream({
          start(controller2) {
            callbacks.onParse = (value) => controller2.enqueue(JSON.stringify(value) + "\n");
            callbacks.onDone = () => {
              try {
                controller2.close();
              } catch (error) {
                controller2.error(error);
              }
            };
            callbacks.onError = (error) => controller2.error(error);
            if (nonStreamingBody !== void 0) {
              callbacks.onParse(nonStreamingBody);
            }
          }
        });
        return new Response(stream, {
          status: response2?.status,
          statusText: response2?.statusText,
          headers: {
            "Content-Type": "application/x-ndjson",
            [X_TSS_SERIALIZED]: "true"
          }
        });
      }
      return new Response(void 0, {
        status: response2?.status,
        statusText: response2?.statusText
      });
    } catch (error) {
      if (error instanceof Response) {
        return error;
      }
      if (isNotFound(error)) {
        return isNotFoundResponse(error);
      }
      console.info();
      console.info("Server Fn Error!");
      console.info();
      console.error(error);
      console.info();
      const serializedError = JSON.stringify(
        await Promise.resolve(
          go(error, {
            refs: /* @__PURE__ */ new Map(),
            plugins: serovalPlugins
          })
        )
      );
      const response2 = getResponse();
      return new Response(serializedError, {
        status: response2?.status ?? 500,
        statusText: response2?.statusText,
        headers: {
          "Content-Type": "application/json",
          [X_TSS_SERIALIZED]: "true"
        }
      });
    }
  })();
  request.signal.removeEventListener("abort", abort);
  return response;
};
function isNotFoundResponse(error) {
  const { headers, ...rest } = error;
  return new Response(JSON.stringify(rest), {
    status: 404,
    headers: {
      "Content-Type": "application/json",
      ...headers || {}
    }
  });
}
const HEADERS = {
  TSS_SHELL: "X-TSS_SHELL"
};
const createServerRpc = (functionId, splitImportFn) => {
  const url = "/_serverFn/" + functionId;
  return Object.assign(splitImportFn, {
    url,
    functionId,
    [TSS_SERVER_FUNCTION]: true
  });
};
const ServerFunctionSerializationAdapter = createSerializationAdapter({
  key: "$TSS/serverfn",
  test: (v2) => {
    if (typeof v2 !== "function") return false;
    if (!(TSS_SERVER_FUNCTION in v2)) return false;
    return !!v2[TSS_SERVER_FUNCTION];
  },
  toSerializable: ({ functionId }) => ({ functionId }),
  fromSerializable: ({ functionId }) => {
    const fn = async (opts, signal) => {
      const serverFn = await getServerFnById(functionId);
      const result = await serverFn(opts ?? {}, signal);
      return result.result;
    };
    return createServerRpc(functionId, fn);
  }
});
function getStartResponseHeaders(opts) {
  const headers = mergeHeaders(
    {
      "Content-Type": "text/html; charset=utf-8"
    },
    ...opts.router.state.matches.map((match) => {
      return match.headers;
    })
  );
  return headers;
}
function createStartHandler(cb) {
  const ROUTER_BASEPATH = "/";
  let startRoutesManifest = null;
  let startEntry = null;
  let routerEntry = null;
  const getEntries = async () => {
    if (routerEntry === null) {
      routerEntry = await import('../_/router-Dgt9epnn.mjs').then((n) => n.r);
    }
    if (startEntry === null) {
      startEntry = await import('../_/start-Ch0oDu9F.mjs');
    }
    return {
      startEntry,
      routerEntry
    };
  };
  const originalFetch = globalThis.fetch;
  const startRequestResolver = async (request, requestOpts) => {
    const origin = getOrigin(request);
    globalThis.fetch = async function(input, init) {
      function resolve(url2, requestOptions) {
        const fetchRequest = new Request(url2, requestOptions);
        return startRequestResolver(fetchRequest, requestOpts);
      }
      if (typeof input === "string" && input.startsWith("/")) {
        const url2 = new URL(input, origin);
        return resolve(url2, init);
      } else if (typeof input === "object" && "url" in input && typeof input.url === "string" && input.url.startsWith("/")) {
        const url2 = new URL(input.url, origin);
        return resolve(url2, init);
      }
      return originalFetch(input, init);
    };
    const url = new URL(request.url);
    const href = url.href.replace(url.origin, "");
    let router = null;
    const getRouter = async () => {
      if (router) return router;
      router = await (await getEntries()).routerEntry.getRouter();
      const isPrerendering = process.env.TSS_PRERENDERING === "true";
      let isShell = process.env.TSS_SHELL === "true";
      if (isPrerendering && !isShell) {
        isShell = request.headers.get(HEADERS.TSS_SHELL) === "true";
      }
      const history = createMemoryHistory({
        initialEntries: [href]
      });
      router.update({
        history,
        isShell,
        isPrerendering,
        origin: router.options.origin ?? origin,
        ...{
          defaultSsr: startOptions.defaultSsr,
          serializationAdapters: [
            ...startOptions.serializationAdapters || [],
            ...router.options.serializationAdapters || []
          ]
        },
        basepath: ROUTER_BASEPATH
      });
      return router;
    };
    const startOptions = await (await getEntries()).startEntry.startInstance?.getOptions() || {};
    startOptions.serializationAdapters = startOptions.serializationAdapters || [];
    startOptions.serializationAdapters.push(ServerFunctionSerializationAdapter);
    const requestHandlerMiddleware = handlerToMiddleware(
      async ({ context }) => {
        const response2 = await runWithStartContext(
          {
            getRouter,
            startOptions,
            contextAfterGlobalMiddlewares: context,
            request
          },
          async () => {
            try {
              if (href.startsWith("/_serverFn/")) {
                return await handleServerAction({
                  request,
                  context: requestOpts?.context
                });
              }
              const executeRouter = async ({
                serverContext
              }) => {
                const requestAcceptHeader = request.headers.get("Accept") || "*/*";
                const splitRequestAcceptHeader = requestAcceptHeader.split(",");
                const supportedMimeTypes = ["*/*", "text/html"];
                const isRouterAcceptSupported = supportedMimeTypes.some(
                  (mimeType) => splitRequestAcceptHeader.some(
                    (acceptedMimeType) => acceptedMimeType.trim().startsWith(mimeType)
                  )
                );
                if (!isRouterAcceptSupported) {
                  return json(
                    {
                      error: "Only HTML requests are supported here"
                    },
                    {
                      status: 500
                    }
                  );
                }
                if (startRoutesManifest === null) {
                  startRoutesManifest = await getStartManifest();
                }
                const router2 = await getRouter();
                attachRouterServerSsrUtils({
                  router: router2,
                  manifest: startRoutesManifest
                });
                router2.update({ additionalContext: { serverContext } });
                await router2.load();
                if (router2.state.redirect) {
                  return router2.state.redirect;
                }
                await router2.serverSsr.dehydrate();
                const responseHeaders = getStartResponseHeaders({ router: router2 });
                const response4 = await cb({
                  request,
                  router: router2,
                  responseHeaders
                });
                return response4;
              };
              const response3 = await handleServerRoutes({
                getRouter,
                request,
                executeRouter,
                context
              });
              return response3;
            } catch (err) {
              if (err instanceof Response) {
                return err;
              }
              throw err;
            }
          }
        );
        return response2;
      }
    );
    const flattenedMiddlewares = startOptions.requestMiddleware ? flattenMiddlewares(startOptions.requestMiddleware) : [];
    const middlewares = flattenedMiddlewares.map((d2) => d2.options.server);
    const ctx = await executeMiddleware(
      [...middlewares, requestHandlerMiddleware],
      {
        request,
        context: requestOpts?.context || {}
      }
    );
    const response = ctx.response;
    if (isRedirect(response)) {
      if (isResolvedRedirect(response)) {
        if (request.headers.get("x-tsr-redirect") === "manual") {
          return json(
            {
              ...response.options,
              isSerializedRedirect: true
            },
            {
              headers: response.headers
            }
          );
        }
        return response;
      }
      if (response.options.to && typeof response.options.to === "string" && !response.options.to.startsWith("/")) {
        throw new Error(
          `Server side redirects must use absolute paths via the 'href' or 'to' options. The redirect() method's "to" property accepts an internal path only. Use the "href" property to provide an external URL. Received: ${JSON.stringify(response.options)}`
        );
      }
      if (["params", "search", "hash"].some(
        (d2) => typeof response.options[d2] === "function"
      )) {
        throw new Error(
          `Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(
            response.options
          ).filter((d2) => typeof response.options[d2] === "function").map((d2) => `"${d2}"`).join(", ")}`
        );
      }
      const router2 = await getRouter();
      const redirect = router2.resolveRedirect(response);
      if (request.headers.get("x-tsr-redirect") === "manual") {
        return json(
          {
            ...response.options,
            isSerializedRedirect: true
          },
          {
            headers: response.headers
          }
        );
      }
      return redirect;
    }
    return response;
  };
  return requestHandler(startRequestResolver);
}
async function handleServerRoutes({
  getRouter,
  request,
  executeRouter,
  context
}) {
  const router = await getRouter();
  let url = new URL(request.url);
  url = executeRewriteInput(router.rewrite, url);
  const pathname = url.pathname;
  const { matchedRoutes, foundRoute, routeParams } = router.getMatchedRoutes(
    pathname,
    void 0
  );
  const middlewares = flattenMiddlewares(
    matchedRoutes.flatMap((r) => r.options.server?.middleware).filter(Boolean)
  ).map((d2) => d2.options.server);
  const server2 = foundRoute?.options.server;
  if (server2) {
    if (server2.handlers) {
      const handlers = typeof server2.handlers === "function" ? server2.handlers({
        createHandlers: (d2) => d2
      }) : server2.handlers;
      const requestMethod = request.method.toUpperCase();
      const handler = handlers[requestMethod] ?? handlers["ANY"];
      if (handler) {
        const mayDefer = !!foundRoute.options.component;
        if (typeof handler === "function") {
          middlewares.push(handlerToMiddleware(handler, mayDefer));
        } else {
          const { middleware } = handler;
          if (middleware && middleware.length) {
            middlewares.push(
              ...flattenMiddlewares(middleware).map((d2) => d2.options.server)
            );
          }
          if (handler.handler) {
            middlewares.push(handlerToMiddleware(handler.handler, mayDefer));
          }
        }
      }
    }
  }
  middlewares.push(
    handlerToMiddleware((ctx2) => executeRouter({ serverContext: ctx2.context }))
  );
  const ctx = await executeMiddleware(middlewares, {
    request,
    context,
    params: routeParams,
    pathname
  });
  const response = ctx.response;
  return response;
}
function throwRouteHandlerError() {
  throw new Error("Internal Server Error");
}
function throwIfMayNotDefer() {
  throw new Error("Internal Server Error");
}
function handlerToMiddleware(handler, mayDefer = false) {
  if (mayDefer) {
    return handler;
  }
  return async ({ next: _next, ...rest }) => {
    const response = await handler({ ...rest, next: throwIfMayNotDefer });
    if (!response) {
      throwRouteHandlerError();
    }
    return response;
  };
}
function executeMiddleware(middlewares, ctx) {
  let index = -1;
  const next = async (ctx2) => {
    index++;
    const middleware = middlewares[index];
    if (!middleware) return ctx2;
    let result;
    try {
      result = await middleware({
        ...ctx2,
        // Allow the middleware to call the next middleware in the chain
        next: async (nextCtx) => {
          const nextResult = await next({
            ...ctx2,
            ...nextCtx,
            context: {
              ...ctx2.context,
              ...nextCtx?.context || {}
            }
          });
          return Object.assign(ctx2, handleCtxResult(nextResult));
        }
        // Allow the middleware result to extend the return context
      });
    } catch (err) {
      if (isSpecialResponse(err)) {
        result = {
          response: err
        };
      } else {
        throw err;
      }
    }
    return Object.assign(ctx2, handleCtxResult(result));
  };
  return handleCtxResult(next(ctx));
}
function handleCtxResult(result) {
  if (isSpecialResponse(result)) {
    return {
      response: result
    };
  }
  return result;
}
function isSpecialResponse(err) {
  return isResponse(err) || isRedirect(err);
}
function isResponse(response) {
  return response instanceof Response;
}
const fetch = createStartHandler(defaultStreamHandler);
const server = {
  // Providing `RequestHandler` from `@tanstack/react-start/server` is required so that the output types don't import it from `@tanstack/start-server-core`
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  fetch
};

const entry = fromWebHandler(server.fetch);

export { entry as default };
//# sourceMappingURL=entry.mjs.map
