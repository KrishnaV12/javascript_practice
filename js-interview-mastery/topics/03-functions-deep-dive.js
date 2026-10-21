/*
═══════════════════════════════════════════════════════════════════
  TOPIC 03: FUNCTIONS DEEP DIVE
  Run this file:  node topics/03-functions-deep-dive.js
═══════════════════════════════════════════════════════════════════

WHY THIS MATTERS IN INTERVIEWS
  Functions are the heart of JavaScript. Closures (file 04), `this`
  (file 05), callbacks, promises — everything builds on the ideas here.

THE BIG IDEA — Functions are FIRST-CLASS CITIZENS
  In JS, a function is just a VALUE (technically an object). Anything
  you can do with a value, you can do with a function:
    ✔ store it in a variable
    ✔ pass it as an argument          → "callback"
    ✔ return it from another function → enables closures & currying
    ✔ attach properties to it

  A function that takes or returns another function is called a
  HIGHER-ORDER FUNCTION (HOF). map, filter, setTimeout, addEventListener
  are all HOFs you use daily.
*/

"use strict";
console.log("===== TOPIC 03: FUNCTIONS DEEP DIVE =====\n");

/* ──────────────────────────────────────────────────────────────────
   STEP 1: The 3 ways to create a function — and the hoisting difference
   ────────────────────────────────────────────────────────────────── */

// (A) FUNCTION DECLARATION — fully hoisted (body and all)
sayHello(); // ✅ works even BEFORE the definition
function sayHello() {
  console.log("STEP 1 → declaration: hello!");
}

// (B) FUNCTION EXPRESSION — only the variable is hoisted, not the function
try {
  sayHi(); // ❌ TypeError in var case / ReferenceError in const case
} catch (err) {
  console.log("STEP 1 → expression before definition:", err.constructor.name);
}
const sayHi = function () {
  console.log("STEP 1 → expression: hi!");
};
sayHi(); // ✅ fine after the line

// (C) ARROW FUNCTION — an expression with special behavior (Step 2)
const sayYo = () => console.log("STEP 1 → arrow: yo!");
sayYo();

/*
  INTERVIEW ANSWER: "Function declarations are hoisted with their entire
  body, so they're callable anywhere in their scope. Function expressions
  and arrow functions follow VARIABLE hoisting rules — with const/let
  they sit in the TDZ until defined."
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 2: ⭐ Arrow functions vs regular functions (asked in EVERY interview)
   ────────────────────────────────────────────────────────────────── */
/*
  THE 5 DIFFERENCES:

  1. `this`      → Arrow functions DO NOT get their own `this`.
                   They inherit it from the surrounding scope (lexical this).
                   Regular functions get `this` based on HOW they're called.
                   (Deep dive in file 05.)

  2. `arguments` → Regular functions get a magic array-like `arguments`
                   object. Arrows don't — use rest params (...args) instead.

  3. constructor → Regular functions can be called with `new`.
                   Arrows CANNOT: new MyArrow() → TypeError.

  4. hoisting    → Arrows are always expressions → never body-hoisted.

  5. syntax      → Arrows allow implicit return for one-liners:
                   const double = n => n * 2;   // no { } → auto-returned
*/

function regularArgs() {
  console.log("STEP 2 → arguments object:", arguments[0], arguments[1]);
}
regularArgs("a", "b");

const arrowArgs = (...args) => console.log("STEP 2 → rest params:", args);
arrowArgs("a", "b");

// `this` preview (full story in file 05):
const timer = {
  seconds: 0,
  start() {
    // The arrow inherits `this` from start(), so this.seconds works:
    const id = setInterval(() => {
      this.seconds++;
      if (this.seconds === 2) {
        console.log("STEP 2 → arrow kept `this`, seconds:", this.seconds);
        clearInterval(id);
      }
    }, 30);
    // A regular function here would have its OWN this → this.seconds = NaN bug.
  },
};
timer.start();

/* ──────────────────────────────────────────────────────────────────
   STEP 3: Parameters — default, rest, and a sneaky gotcha
   ────────────────────────────────────────────────────────────────── */

function greet(name = "Guest", ...rest) {
  // default kicks in for `undefined` ONLY (not for null, 0, or "")
  console.log(`STEP 3 → hello ${name}, extras: [${rest}]`);
}
greet();                       // hello Guest
greet(undefined, 1, 2);        // hello Guest, extras: [1,2]
greet(null);                   // hello null  ⚠️ null does NOT trigger default!

/* ──────────────────────────────────────────────────────────────────
   STEP 4: IIFE — Immediately Invoked Function Expression
   ────────────────────────────────────────────────────────────────── */

const result = (function () {
  const secret = "I never leak to the outside";
  return "STEP 4 → IIFE ran once, secret stays private";
})();
console.log(result);

/*
  WHY IIFEs exist: before ES6 modules and block scope, an IIFE was THE way
  to create a private scope and avoid polluting global variables. Today
  you'll mostly see them in older codebases and the module pattern
  (file 04), but interviewers still ask: "What is this syntax and why?"
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 5: Higher-Order Functions & Callbacks — build one yourself
   ────────────────────────────────────────────────────────────────── */

// A callback is simply: "a function I hand to you, please call it later."
function repeat(times, callback) {     // repeat is a HOF (takes a function)
  for (let i = 0; i < times; i++) callback(i);
}
repeat(3, (i) => console.log("STEP 5 → callback run #", i));

// A HOF that RETURNS a function (this is the seed of closures & currying):
function multiplier(factor) {
  return (n) => n * factor;            // the returned fn "remembers" factor
}
const triple = multiplier(3);
console.log("STEP 5 → triple(7):", triple(7)); // 21

/* ──────────────────────────────────────────────────────────────────
   STEP 6: Pure vs Impure functions (frequently asked with React)
   ────────────────────────────────────────────────────────────────── */
/*
  A PURE function:
    1. Same inputs → ALWAYS same output.
    2. No side effects (doesn't touch globals, DOM, network, console,
       doesn't mutate its arguments).

  Pure functions are predictable, testable, and cacheable (memoize — file 14).
  React render logic is expected to be pure — this is why interviewers care.
*/
const pureAdd = (a, b) => a + b;                      // ✅ pure

let total = 0;
const impureAdd = (a) => (total += a);                // ❌ mutates outside state

const impurePush = (arr, x) => { arr.push(x); return arr; };      // ❌ mutates input
const purePush   = (arr, x) => [...arr, x];                       // ✅ returns new array
console.log("STEP 6 → purePush([1,2], 3):", purePush([1, 2], 3));

/* ──────────────────────────────────────────────────────────────────
   STEP 7: Mini interview problems
   ────────────────────────────────────────────────────────────────── */

// Q1: "Write a function that runs another function only after N calls."
function after(n, fn) {
  let count = 0;
  return function (...args) {
    count++;
    if (count >= n) return fn.apply(this, args);
  };
}
const ready = after(3, () => console.log("STEP 7 → fired on the 3rd call!"));
ready(); ready(); ready();

// Q2 (output question): What does this print?
var fn = function inner() {
  // Named function expression: the name `inner` is visible ONLY inside itself
  return typeof inner;
};
console.log("STEP 7 → named fn expression:", fn());        // "function"
console.log("STEP 7 → typeof inner outside:", typeof inner); // "undefined"

/*
  ───────────────────────────────────────────────────────────────────
  30-SECOND INTERVIEW SUMMARY
  "Functions are first-class values in JS. Declarations hoist fully;
  expressions follow variable hoisting. Arrow functions differ from
  regular ones in five ways — most importantly they have no own `this`
  or `arguments`, and can't be constructors. Higher-order functions take
  or return functions, which is the basis of callbacks, closures, and
  array methods. I prefer pure functions because they're predictable
  and easy to test."
  ───────────────────────────────────────────────────────────────────
  NEXT FILE → 04-scope-and-closures.js  (the most asked topic of all)
*/
