/*
═══════════════════════════════════════════════════════════════════
  TOPIC 13: POLYFILLS  ⭐ the senior-round writing test
  Run this file:  node topics/13-polyfills.js
═══════════════════════════════════════════════════════════════════

WHAT IS A POLYFILL?
  A polyfill is YOUR OWN implementation of a built-in feature, used to
  "fill in" support on environments that lack it. Interviewers ask for
  polyfills because writing one proves you truly understand the
  original: its inputs, outputs, edge cases, and `this` behavior.

THE UNIVERSAL RECIPE (use for any polyfill):
  1. WHERE does it live?  Array method → Array.prototype.x
                          Function method → Function.prototype.x
                          Static helper → Promise.x / Object.x
  2. WHAT is `this` inside it?  For arr.myMap(), `this` IS the array.
                                For fn.myBind(), `this` IS the function.
  3. WHAT does it return? New array? Single value? New function? Promise?
  4. WHAT does the callback receive? Usually (element, index, wholeArray).

  NOTE: we use names like myMap to avoid overwriting real methods.
  (Also: modifying built-in prototypes in production code is discouraged —
  say this out loud for senior points; in interviews it's expected.)
*/

"use strict";
console.log("===== TOPIC 13: POLYFILLS =====\n");

/* ──────────────────────────────────────────────────────────────────
   1. Array.prototype.myMap — transform each item into a NEW array
   ────────────────────────────────────────────────────────────────── */

Array.prototype.myMap = function (callback, thisArg) {
  if (typeof callback !== "function") throw new TypeError(callback + " is not a function");
  const result = [];                       // map NEVER mutates the original
  for (let i = 0; i < this.length; i++) {  // `this` = the array it's called on
    if (i in this) {                       // skip "holes" in sparse arrays (real map does)
      result[i] = callback.call(thisArg, this[i], i, this); // (element, index, array)
    }
  }
  return result;
};
console.log("1 → myMap:", [1, 2, 3].myMap((n, i) => n * 10 + i)); // [10, 21, 32]

/* ──────────────────────────────────────────────────────────────────
   2. Array.prototype.myFilter — keep items where callback is truthy
   ────────────────────────────────────────────────────────────────── */

Array.prototype.myFilter = function (callback, thisArg) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this && callback.call(thisArg, this[i], i, this)) {
      result.push(result.length ? this[i] : this[i]); // push keeps result dense
    }
  }
  return result;
};
console.log("2 → myFilter:", [1, 2, 3, 4, 5].myFilter((n) => n % 2)); // [1, 3, 5]

/* ──────────────────────────────────────────────────────────────────
   3. ⭐ Array.prototype.myReduce — the most asked polyfill of all
   ────────────────────────────────────────────────────────────────── */

Array.prototype.myReduce = function (callback, initialValue) {
  // Edge case interviewers ALWAYS check:
  if (this.length === 0 && initialValue === undefined) {
    throw new TypeError("Reduce of empty array with no initial value");
  }

  let accumulator = initialValue;
  let startIndex = 0;

  if (initialValue === undefined) {     // no seed given →
    accumulator = this[0];              // first element BECOMES the seed,
    startIndex = 1;                     // and the loop starts from the second
  }

  for (let i = startIndex; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this); // (acc, item, idx, arr)
  }
  return accumulator;
};
console.log("3 → myReduce sum:", [1, 2, 3, 4].myReduce((a, n) => a + n, 0));   // 10
console.log("3 → myReduce no seed:", [1, 2, 3, 4].myReduce((a, n) => a + n)); // 10

/* ──────────────────────────────────────────────────────────────────
   4. ⭐ Function.prototype.myCall — invoke with a chosen `this`
   ────────────────────────────────────────────────────────────────── */
/*
  THE TRICK: we can't "set" this directly — but IMPLICIT binding can!
  (file 05: obj.fn() makes this = obj). So: temporarily ATTACH the
  function to the context object, call it with a dot, then clean up.
*/
Function.prototype.myCall = function (context, ...args) {
  context = context ?? globalThis;       // null/undefined → global (sloppy-mode spec)
  context = Object(context);             // primitives like 5 get boxed to objects
  const key = Symbol("fn");              // Symbol → guaranteed no property collision
  context[key] = this;                   // `this` = the function being called
  const result = context[key](...args);  // dot-call → implicit binding does the magic
  delete context[key];                   // leave no trace
  return result;
};

function introduce(city) { return `I'm ${this.name} from ${city}`; }
console.log("4 → myCall:", introduce.myCall({ name: "Asha" }, "Pune"));

/* ──────────────────────────────────────────────────────────────────
   5. Function.prototype.myApply — same, args as an array
   ────────────────────────────────────────────────────────────────── */

Function.prototype.myApply = function (context, argsArray = []) {
  return this.myCall(context, ...argsArray);   // reuse! apply = call + spread
};
console.log("5 → myApply:", introduce.myApply({ name: "Ravi" }, ["Delhi"]));

/* ──────────────────────────────────────────────────────────────────
   6. ⭐ Function.prototype.myBind — return a NEW function, run later
   ────────────────────────────────────────────────────────────────── */

Function.prototype.myBind = function (context, ...boundArgs) {
  const originalFn = this;                       // capture in closure
  return function (...callArgs) {
    // bound args (locked early) come first, call-time args after = partial application
    return originalFn.apply(context, [...boundArgs, ...callArgs]);
  };
};

const intro = introduce.myBind({ name: "Meera" });
console.log("6 → myBind:", intro("Goa"));
/*
  Senior follow-up: "real bind also works with `new`." True — when a
  bound function is constructed with new, the locked `this` is ignored.
  Handling it needs new.target + prototype wiring; KNOWING the gap is
  usually enough.
*/

/* ──────────────────────────────────────────────────────────────────
   7. Array.prototype.myFlat — recursion with a depth limit
   ────────────────────────────────────────────────────────────────── */

Array.prototype.myFlat = function (depth = 1) {
  const result = [];
  for (const item of this) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...item.myFlat(depth - 1));  // go one level deeper, budget shrinks
    } else {
      result.push(item);
    }
  }
  return result;
};
const nested = [1, [2, [3, [4]]]];
console.log("7 → myFlat(1):", nested.myFlat());          // [1, 2, [3, [4]]]
console.log("7 → myFlat(Infinity):", nested.myFlat(Infinity)); // [1, 2, 3, 4]

/* ──────────────────────────────────────────────────────────────────
   8. ⭐⭐ Promise.myAll — THE async polyfill (asked constantly)
   ────────────────────────────────────────────────────────────────── */
/*
  CONTRACT to satisfy (recite before coding):
  • input: array of promises (or plain values!)
  • resolves with results IN INPUT ORDER (not finish order!) when ALL succeed
  • rejects IMMEDIATELY with the first error (fail-fast)
  • empty array → resolves with []
*/
function promiseMyAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;

    if (promises.length === 0) return resolve([]);   // edge case first

    promises.forEach((p, index) => {
      Promise.resolve(p)                 // wraps plain values too
        .then((value) => {
          results[index] = value;        // ⭐ index, not push → preserves ORDER
          completed++;                   // count, don't rely on array length
          if (completed === promises.length) resolve(results);
        })
        .catch(reject);                  // first failure rejects everything
    });
  });
}

const delay = (ms, value) => new Promise((res) => setTimeout(() => res(value), ms));

promiseMyAll([delay(60, "slow"), delay(10, "fast"), "instant"])
  .then((r) => console.log("8 → promiseMyAll order kept:", r)); // [slow, fast, instant]

promiseMyAll([delay(30, "ok"), Promise.reject(new Error("boom"))])
  .catch((e) => console.log("8 → promiseMyAll fail-fast:", e.message));

/*
  WHY results[index] and a separate counter?
  • Promises finish in RANDOM order; writing by index restores input order.
  • `results.length` lies (sparse arrays), so we count completions manually.

  ───────────────────────────────────────────────────────────────────
  30-SECOND INTERVIEW SUMMARY
  "A polyfill recreates a built-in, which forces precision about
  `this`, return types, and edge cases. For array methods, `this` is
  the array and callbacks get (element, index, array); reduce's tricky
  part is the missing-initialValue path and the empty-array TypeError.
  myCall works by temporarily attaching the function to the context
  object so implicit binding sets `this`; bind is closure + apply with
  merged arguments. Promise.all needs order-preserving writes by index,
  a completion counter, fail-fast rejection, and Promise.resolve to
  accept plain values."
  ───────────────────────────────────────────────────────────────────
  NEXT FILE → 14-logic-building-problems.js
*/
