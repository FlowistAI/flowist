(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(require("react")) : typeof define === "function" && define.amd ? define(["react"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.React));
})(this, function(React) {
  "use strict";
  var _jsxFileName = "/home/tusen/repo/gide/plugins/demo-plugin/src/Counter.tsx";
  function Counter() {
    window.bbb = React;
    const [count, setCount] = React.useState(0);
    return /* @__PURE__ */ React.createElement("div", { __self: this, __source: {
      fileName: _jsxFileName,
      lineNumber: 8,
      columnNumber: 9
    } }, /* @__PURE__ */ React.createElement("p", { __self: this, __source: {
      fileName: _jsxFileName,
      lineNumber: 9,
      columnNumber: 13
    } }, "Count: ", count), "hello", /* @__PURE__ */ React.createElement("button", { onClick: () => setCount(count + 1), __self: this, __source: {
      fileName: _jsxFileName,
      lineNumber: 11,
      columnNumber: 13
    } }, "Increment"));
  }
  window.pluginBridge.register({
    name: "My Plugin",
    description: "This is my plugin",
    version: "1.0.0",
    component: Counter
  });
});
