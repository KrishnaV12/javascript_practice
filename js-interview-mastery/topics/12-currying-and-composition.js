/*
═══════════════════════════════════════════════════════════════════
  TOPIC 12: CURRYING, PARTIAL APPLICATION & COMPOSITION
  Run this file:  node topics/12-currying-and-composition.js
═══════════════════════════════════════════════════════════════════

WHY THIS MATTERS IN INTERVIEWS
  "Make sum(1)(2)(3) work" is a rite of passage. It tests closures,
  returned functions, and functional thinking — all in five lines.

THE BIG IDEA — CURRYING
  Transform a function that takes MANY arguments at once…
      add(a, b, c)
  …into a chain of functions that each take ONE argument:
      add(a)(b)(c)

  Each call returns a NEW function that REMEMBERS the arguments so far
  (via closure — the backpack 🎒 from file 04) and waits for the next.

  WHY would anyone want this?
  1. REUSABLE SPECIALIZATION: lock in early args once, reuse forever.
       const logError = log('ERROR');  logError('db down');
  2. CONFIG-THEN-DATA pipelines: build small focused functions that
     slot into map/filter/compose.
  3. It's the foundation of functional utility libraries (Ramda, fp-lodash).
*/

"use strict";
console.log("===== TOPIC 12: CURRYING & COMPOSITION =====\n");

/* ──────────────────────────────────────────────────────────────────
   STEP 1: Manual currying — the warm-up
   ────────────────────────────────────────────────────────────────── */

// Normal:
const add3 = (a, b, c) => a + b + c;

// Curried by hand (read inside-out: each arrow returns the next):
const curriedAdd3 = (a) => (b) => (c) => a + b + c;
//    call 1 stores a ─┘    │         │
//    call 2 stores b ──────┘         │
//    call 3 has a,b,c → computes ────┘

console.log("STEP 1 → add3(1,2,3):       ", add3(1, 2, 3));        // 6
console.log("STEP 1 → curriedAdd3(1)(2)(3):", curriedAdd3(1)(2)(3)); // 6

const add1and2 = curriedAdd3(1)(2);    // a "specialized" function, c pending
console.log("STEP 1 → reuse: add1and2(10):", add1and2(10), "| add1and2(100):", add1and2(100));

/* ──────────────────────────────────────────────────────────────────
   STEP 2: A practical example — configuration first, data later
   ────────────────────────────────────────────────────────────────── */

const log = (level) => (message) => console.log(`   [${level}] ${message}`);
const logInfo  = log("INFO");
const logError = log("ERROR");

console.log("\nSTEP 2 → specialized loggers:");
logInfo("user signed in");
logError("payment gateway timeout");
// One generic function → a family of focused ones. THIS is the selling point.

/* ──────────────────────────────────────────────────────────────────
   STEP 3: ⭐ Generic curry(fn) — convert ANY function automatically
   ────────────────────────────────────────────────────────────────── */

function curry(fn) {
  return function curried(...args) {
    // fn.length = number of parameters fn DECLARED (its "arity")
    if (args.length >= fn.length) {
      return fn.apply(this, args);            // enough args → actually run
    }
    // not enough yet → return a collector that merges old + new args
    return (...nextArgs) => curried.apply(this, [...args, ...nextArgs]);
  };
}

const curriedMul = curry((a, b, c) => a * b * c);
console.log("\nSTEP 3 → generic curry, every calling style works:");
console.log("   (2)(3)(4) →", curriedMul(2)(3)(4));   // 24
console.log("   (2,3)(4)  →", curriedMul(2, 3)(4));   // 24
console.log("   (2)(3,4)  →", curriedMul(2)(3, 4));   // 24
console.log("   (2,3,4)   →", curriedMul(2, 3, 4));   // 24

/*
  HOW IT WORKS (narrate this):
  • Closure accumulates args across calls: [2] → [2,3] → [2,3,4].
  • The moment collected args ≥ fn.length, we call the real fn.
  • Recursion + spread does the merging.
  ⚠️ fn.length doesn't count rest (...args) or defaulted params — a fair
  follow-up question; for those you'd need a fixed arity or a sentinel.
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 4: ⭐⭐ INFINITE currying — sum(1)(2)(3)...() 
   ────────────────────────────────────────────────────────────────── */

function sum(a) {
  return function (b) {
    if (b !== undefined) return sum(a + b);   // got another number → keep folding,
    return a;                                 // empty call () → b is undefined → STOP
  };
}

console.log("\nSTEP 4 → infinite curry:");
console.log("   sum(1)(2)()       →", sum(1)(2)());          // 3
console.log("   sum(1)(2)(3)(4)() →", sum(1)(2)(3)(4)());    // 10

/*
  THE TRICK: there's no fixed arity, so we need a TERMINATOR — calling
  with no argument. Each numbered call returns a new closure carrying
  the running total (a + b). The empty call returns the total.

  Variant some interviewers ask: make `sum(1)(2)(3) + 0` work directly.
  → give the returned function a custom valueOf/toString so coercion
    unwraps the total. Worth mentioning; the () version is the standard answer.
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 5: Currying vs Partial Application (one-line distinction)
   ────────────────────────────────────────────────────────────────── */

// Currying: ALL args become unary steps:        f(a)(b)(c)
// Partial application: pre-fill SOME args, rest arrive together:
const addPartial = (a, b, c) => a + b + c;
const add10 = addPartial.bind(null, 10);        // bind = built-in partial applier!
console.log("\nSTEP 5 → partial via bind: add10(2, 3) =", add10(2, 3)); // 15

/* ──────────────────────────────────────────────────────────────────
   STEP 6: ⭐ COMPOSE & PIPE — gluing small functions together
   ────────────────────────────────────────────────────────────────── */
/*
  compose(f, g, h)(x) = f(g(h(x)))   → executes RIGHT-to-LEFT (math style)
  pipe(f, g, h)(x)    = h(g(f(x)))   → executes LEFT-to-RIGHT (reads like steps)

  Implementation insight: "feed the output of one function as input to
  the next" is literally a reduce over the function list.
*/
const compose = (...fns) => (input) => fns.reduceRight((acc, fn) => fn(acc), input);
const pipe    = (...fns) => (input) => fns.reduce((acc, fn) => fn(acc), input);

const trim      = (s) => s.trim();
const lower     = (s) => s.toLowerCase();
const dashes    = (s) => s.replaceAll(" ", "-");

const slugify = pipe(trim, lower, dashes);      // read top-to-bottom: trim → lower → dashes
console.log("\nSTEP 6 → slugify('  Senior JS Interview  '):", slugify("  Senior JS Interview  "));
// "senior-js-interview"

const shout = compose((s) => s + "!!!", (s) => s.toUpperCase());
console.log("STEP 6 → compose shout('hire me'):", shout("hire me")); // uppercase first, then !!!

/*
  ───────────────────────────────────────────────────────────────────
  30-SECOND INTERVIEW SUMMARY
  "Currying converts f(a,b,c) into f(a)(b)(c); each step returns a
  closure that remembers earlier arguments, enabling reusable
  specialized functions. A generic curry compares collected args
  against fn.length and either runs fn or returns a collector.
  Infinite currying like sum(1)(2)(3)() recurses with a running total
  and uses an empty call as the terminator. Partial application
  pre-fills some args (bind does this natively). compose/pipe chain
  unary functions via reduceRight/reduce — output of one becomes input
  of the next."
  ───────────────────────────────────────────────────────────────────
  NEXT FILE → 13-polyfills.js
*/
