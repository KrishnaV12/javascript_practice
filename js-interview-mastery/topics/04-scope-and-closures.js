/*
═══════════════════════════════════════════════════════════════════
  TOPIC 04: SCOPE & CLOSURES  ⭐ THE most asked JS interview topic
  Run this file:  node topics/04-scope-and-closures.js
═══════════════════════════════════════════════════════════════════

PART A — SCOPE (you need this to understand closures)

  SCOPE = "from where can I see this variable?"

  1. Global scope    → visible everywhere
  2. Function scope  → visible inside that function
  3. Block scope     → visible inside { } (let/const only)

  LEXICAL SCOPE (the key word interviewers listen for):
  Scope is decided by WHERE the function is WRITTEN in the source code,
  not where/how it is called. "Lexical" literally means "relating to the
  written text".

  THE SCOPE CHAIN: when JS needs a variable, it looks
     in the current function → then the function that contains it
     → then ITS container → ... → global → ReferenceError.
  Like asking your team lead, then their manager, then the CEO.

PART B — CLOSURES

  DEFINITION (say this in interviews):
  "A closure is a function bundled together with references to its
  surrounding (lexical) scope. In practice: an inner function keeps
  ACCESS to its outer function's variables even AFTER the outer
  function has finished running."

  ANALOGY — THE BACKPACK 🎒
  When a function is created, it packs a backpack containing references
  to every outer variable it uses. Wherever that function travels
  (returned, passed as a callback, stored in a timer), the backpack goes
  with it. Open the backpack later → the variables are still alive.

  WHY doesn't the variable die when the outer function returns?
  Normally a function's local variables are garbage-collected after it
  returns. But if an inner function still REFERENCES them, the engine
  keeps them alive — someone still holds the backpack.
*/

"use strict";
console.log("===== TOPIC 04: SCOPE & CLOSURES =====\n");

/* ──────────────────────────────────────────────────────────────────
   STEP 1: The simplest possible closure — read it line by line
   ────────────────────────────────────────────────────────────────── */

function outer() {
  let message = "I live inside outer()";   // local to outer
  function inner() {
    console.log("STEP 1 →", message);      // inner USES outer's variable
  }
  return inner;                            // outer FINISHES here…
}

const fn = outer();  // outer() has fully returned. Its scope "should" be gone.
fn();                // …yet this still prints the message. THAT is a closure.

/* ──────────────────────────────────────────────────────────────────
   STEP 2: ⭐ The counter — the most famous closure interview question
   "Create a counter that cannot be modified from outside."
   ────────────────────────────────────────────────────────────────── */

function createCounter() {
  let count = 0;                       // PRIVATE — nobody outside can touch it
  return {
    increment() { return ++count; },   // all three functions share
    decrement() { return --count; },   // the SAME backpack,
    value()     { return count; },     // the same single `count`
  };
}

const counter = createCounter();
counter.increment();
counter.increment();
counter.decrement();
console.log("STEP 2 → counter value:", counter.value()); // 1
console.log("STEP 2 → counter.count from outside:", counter.count); // undefined ✅ private!

/*
  KEY POINTS TO SAY OUT LOUD:
  • `count` is genuinely private — this is DATA ENCAPSULATION via closure.
  • The three methods CLOSE OVER the same variable, so they stay in sync.
  • Each call to createCounter() builds a fresh backpack:
*/
const counterA = createCounter();
const counterB = createCounter();
counterA.increment(); counterA.increment();
console.log("STEP 2 → A:", counterA.value(), "B:", counterB.value()); // A:2 B:0 (independent!)

/* ──────────────────────────────────────────────────────────────────
   STEP 3: The loop problem — closures + var (full story)
   ────────────────────────────────────────────────────────────────── */

console.log("\nSTEP 3 → predicting the classic loop:");
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("   var prints:", i), 60);   // 3 3 3
}
/*
  Each arrow function closes over the VARIABLE i — not its value at that
  moment. With `var` there is ONE shared i; the loop finishes (i = 3)
  long before any timeout fires, so every backpack contains the same
  variable, now holding 3.

  FIXES (be ready to write all three):
    1. let i        → new binding per iteration (each backpack gets its own i)
    2. IIFE         → (function(saved){ setTimeout(()=>console.log(saved),60) })(i)
    3. extra arg    → setTimeout(console.log, 60, i)
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 4: Function factories — closures that "remember configuration"
   ────────────────────────────────────────────────────────────────── */

function createGreeter(greeting) {        // factory
  return (name) => `${greeting}, ${name}!`;
}
const sayNamaste = createGreeter("Namaste");
const sayHello   = createGreeter("Hello");
console.log("\nSTEP 4 →", sayNamaste("Priya")); // Namaste, Priya!
console.log("STEP 4 →", sayHello("Sam"));       // Hello, Sam!
// Each greeter permanently remembers ITS OWN greeting. This exact pattern
// powers currying (file 12), memoize (file 14) and debounce (file 11).

/* ──────────────────────────────────────────────────────────────────
   STEP 5: ⭐ Interview build: once(fn) — run a function only one time
   (Real use: initialize SDK once, bind a payment handler once, etc.)
   ────────────────────────────────────────────────────────────────── */

function once(fn) {
  let called = false;   // state lives in the backpack
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;      // later calls return the FIRST result
  };
}

const init = once((env) => {
  console.log("STEP 5 → initializing app for:", env);
  return "ready-" + env;
});
console.log(init("prod"));  // runs → "ready-prod"
console.log(init("dev"));   // skipped → still "ready-prod"
console.log(init("test"));  // skipped → still "ready-prod"

/* ──────────────────────────────────────────────────────────────────
   STEP 6: The Module Pattern (pre-ES6 modules — still asked!)
   ────────────────────────────────────────────────────────────────── */

const bankAccount = (function () {
  let balance = 1000;                            // private state
  function log(msg) { console.log("   [bank]", msg); } // private helper

  return {                                       // PUBLIC API only
    deposit(amount) {
      if (amount <= 0) return log("invalid amount");
      balance += amount;
      log(`deposited ${amount}, balance: ${balance}`);
    },
    withdraw(amount) {
      if (amount > balance) return log("insufficient funds ❌");
      balance -= amount;
      log(`withdrew ${amount}, balance: ${balance}`);
    },
    getBalance: () => balance,
  };
})();

console.log("\nSTEP 6 → module pattern:");
bankAccount.deposit(500);
bankAccount.withdraw(2000);   // blocked — validation can't be bypassed
bankAccount.withdraw(300);
// bankAccount.balance → undefined. The ONLY door in is the public API.

/* ──────────────────────────────────────────────────────────────────
   STEP 7: Closure output questions (predict before reading answers)
   ────────────────────────────────────────────────────────────────── */

// Q1:
function makeFns() {
  const fns = [];
  for (var i = 0; i < 3; i++) fns.push(() => i);
  return fns;
}
console.log("\nSTEP 7 → Q1:", makeFns().map((f) => f())); // [3,3,3] — one shared var i

// Q2:
let x = 10;
function show() { console.log("STEP 7 → Q2:", x); }
function run() {
  let x = 99;       // irrelevant! show() was WRITTEN next to the outer x
  show();
}
run(); // 10 — LEXICAL scope: where defined, not where called.

// Q3:
function secretHolder() {
  let secret = 0;
  return {
    add: () => ++secret,
    peek: () => secret,
  };
}
const s1 = secretHolder();
const s2 = secretHolder();
s1.add(); s1.add(); s2.add();
console.log("STEP 7 → Q3:", s1.peek(), s2.peek()); // 2 1 — separate backpacks

/*
  COMMON PITFALL TO MENTION (senior signal): closures keep variables
  alive, so a long-lived closure referencing a HUGE object prevents
  garbage collection → memory leak. Classic case: event listeners that
  close over big data and are never removed.

  ───────────────────────────────────────────────────────────────────
  30-SECOND INTERVIEW SUMMARY
  "A closure is a function plus its lexical environment — an inner
  function retains access to its outer function's variables even after
  the outer function returns. I use closures for data privacy (counters,
  module pattern), function factories, and utilities like once, debounce,
  throttle, and memoize. The classic var-in-a-loop bug happens because
  all callbacks close over one shared variable; let fixes it by creating
  a new binding per iteration."
  ───────────────────────────────────────────────────────────────────
  NEXT FILE → 05-this-keyword.js
*/
