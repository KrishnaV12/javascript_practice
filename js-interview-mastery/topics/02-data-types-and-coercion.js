/*
═══════════════════════════════════════════════════════════════════
  TOPIC 02: DATA TYPES & TYPE COERCION
  Run this file:  node topics/02-data-types-and-coercion.js
═══════════════════════════════════════════════════════════════════

WHY THIS MATTERS IN INTERVIEWS
  Interviewers love coercion because it separates "I write JS" from
  "I understand JS". Weird outputs like `[] + {}` are not random —
  they all follow a small set of rules you can learn in 10 minutes.

THE BIG IDEA — JavaScript has exactly 8 types:

  7 PRIMITIVES (stored & copied BY VALUE):
     string, number, boolean, undefined, null, symbol, bigint
  1 NON-PRIMITIVE (stored & copied BY REFERENCE):
     object  (this includes arrays, functions, dates, regex...)

ANALOGY
  Primitive = a photocopy. Give someone a copy, they can scribble on
  it, your original is untouched.
  Object = a Google Doc link. Give someone the link, you're BOTH
  editing the same document.
*/

"use strict";
console.log("===== TOPIC 02: DATA TYPES & COERCION =====\n");

/* ──────────────────────────────────────────────────────────────────
   STEP 1: Value vs Reference (the #1 source of real-world bugs)
   ────────────────────────────────────────────────────────────────── */

let p1 = 10;
let p2 = p1;     // COPY of the value
p2 = 99;
console.log("STEP 1 → primitives:", p1, p2); // 10 99  (p1 untouched)

let obj1 = { score: 10 };
let obj2 = obj1; // COPY of the REFERENCE (same object!)
obj2.score = 99;
console.log("STEP 1 → objects:", obj1.score, obj2.score); // 99 99

/*
  INTERVIEW FOLLOW-UP: "So how do I actually copy an object?"
    Shallow copy: {...obj1}  or  Object.assign({}, obj1)
      → copies one level; nested objects are still shared references.
    Deep copy: structuredClone(obj1)  (modern)
      → see file 14 where we BUILD deepClone() ourselves.
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 2: typeof — and its famous quirks
   ────────────────────────────────────────────────────────────────── */

console.log("\nSTEP 2 → typeof results:");
console.log("  typeof 'hi'      →", typeof "hi");      // string
console.log("  typeof 42        →", typeof 42);        // number
console.log("  typeof NaN       →", typeof NaN);       // number  ⚠️ quirk 1
console.log("  typeof undefined →", typeof undefined); // undefined
console.log("  typeof null      →", typeof null);      // object  ⚠️ quirk 2
console.log("  typeof []        →", typeof []);        // object  ⚠️ quirk 3
console.log("  typeof {}        →", typeof {});        // object
console.log("  typeof func      →", typeof function () {}); // function

/*
  QUIRK 1: NaN means "Not a Number" yet its TYPE is number. NaN is what
           you get when a numeric operation fails (e.g. "abc" * 2).
  QUIRK 2: typeof null === "object" is a 30-year-old bug kept for
           backward compatibility. Correct null check: value === null
  QUIRK 3: Arrays are just objects. Correct array check:
           Array.isArray(value)
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 3: null vs undefined (asked constantly)
   ────────────────────────────────────────────────────────────────── */
/*
  undefined → "the engine hasn't been given a value"
              (declared-but-unassigned vars, missing params,
               functions with no return, missing object properties)
  null      → "a developer DELIBERATELY set this to empty"

  undefined = empty apartment nobody has moved into yet.
  null      = apartment where someone hung a sign saying "intentionally vacant".

  null == undefined   → true   (loose equality treats them as a pair)
  null === undefined  → false  (different types)
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 4: Truthy & Falsy — memorize the falsy list, it's only 6 values
   ────────────────────────────────────────────────────────────────── */
/*
  THE ONLY FALSY VALUES:   false, 0 (and -0), "" , null, undefined, NaN
  EVERYTHING ELSE IS TRUTHY — including these traps:
     "0"   → truthy (non-empty string!)
     " "   → truthy (a space is a character)
     []    → truthy (empty array is still an object)
     {}    → truthy
*/
console.log("\nSTEP 4 → Boolean([]):", Boolean([]), "| Boolean('0'):", Boolean("0"));

/* ──────────────────────────────────────────────────────────────────
   STEP 5: == vs ===  (THE classic question)
   ────────────────────────────────────────────────────────────────── */
/*
  ===  strict equality   → compares value AND type. No conversion. Predictable.
  ==   loose equality    → if types differ, JS CONVERTS one side first,
                           then compares. The conversion rules (simplified):

    1. null == undefined → true (special pair; they equal nothing else)
    2. number == string  → string is converted to number
    3. boolean == anything → boolean is converted to number first
    4. object == primitive → object is converted via toString/valueOf

  Walking through  1 == "1":
    types differ (number vs string) → rule 2 → "1" becomes 1 → 1 == 1 → true

  Walking through  true == "1"  (interviewers love this one):
    rule 3: true → 1.  Now  1 == "1"  → rule 2: "1" → 1.  → true
*/
console.log("\nSTEP 5 → coercion table:");
console.log("  1 == '1'        →", 1 == "1");        // true
console.log("  1 === '1'       →", 1 === "1");       // false
console.log("  true == '1'     →", true == "1");     // true
console.log("  null == 0       →", null == 0);       // false (rule 1: null only equals undefined)
console.log("  null >= 0       →", null >= 0);       // true ⚠️ (comparisons convert null→0, equality doesn't!)
console.log("  NaN == NaN      →", NaN == NaN);      // false (NaN equals NOTHING, not even itself)
console.log("  Number.isNaN(NaN) →", Number.isNaN(NaN)); // the right way to test for NaN

/* ──────────────────────────────────────────────────────────────────
   STEP 6: The + operator — string glue OR math, decided at runtime
   ────────────────────────────────────────────────────────────────── */
/*
  RULE for `+`: if EITHER side is a string (after objects are converted
  to primitives), it CONCATENATES. Otherwise it does math.
  Every other math operator (-, *, /, %) ONLY does math → converts to numbers.
*/
console.log("\nSTEP 6 → operator coercion:");
console.log("  '5' + 3   →", "5" + 3);    // "53"  (string wins with +)
console.log("  '5' - 3   →", "5" - 3);    // 2     (- forces numbers)
console.log("  '5' * '2' →", "5" * "2");  // 10
console.log("  1 + '2' + 3 →", 1 + "2" + 3); // "123" (left to right: 1+'2'→'12', '12'+3→'123')
console.log("  1 + 2 + '3' →", 1 + 2 + "3"); // "33"  (1+2→3 first, then 3+'3'→'33')

/* ──────────────────────────────────────────────────────────────────
   STEP 7: ⭐ The famous bracket questions — fully explained
   ────────────────────────────────────────────────────────────────── */
/*
  How objects become primitives for `+`:
    [] .toString()        → ""               (empty array → empty string)
    [1,2].toString()      → "1,2"
    {}.toString()         → "[object Object]"
*/
console.log("\nSTEP 7 → bracket madness:");
console.log("  [] + []   →", JSON.stringify([] + []));  // ""  ("" + "" = "")
console.log("  [] + {}   →", [] + {});                  // "[object Object]"
console.log("  [] == ''  →", [] == "");                 // true ([]→"" then compare)
console.log("  [] == ![] →", [] == ![]);                // true ⚠️ explained below

/*
  [] == ![]  step by step (a senior-level favorite):
    1. ![]      → [] is truthy → ![] is false.        Now: [] == false
    2. boolean → number:  false → 0.                  Now: [] == 0
    3. object → primitive: [] → "" .                  Now: "" == 0
    4. string → number:   "" → 0.                     Now: 0 == 0 → TRUE

  Note: typing {} + [] directly into a browser console prints 0, because
  the console parses the leading {} as an empty BLOCK, leaving +[] → 0.
  Inside console.log(({} + [])) it's an expression → "[object Object]".
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 8: 0.1 + 0.2 — the floating point question
   ────────────────────────────────────────────────────────────────── */
console.log("\nSTEP 8 → 0.1 + 0.2 =", 0.1 + 0.2);            // 0.30000000000000004
console.log("  0.1 + 0.2 === 0.3 →", 0.1 + 0.2 === 0.3);     // false

/*
  WHY: JS numbers are 64-bit binary floats (IEEE 754). 0.1 and 0.2 cannot
  be represented EXACTLY in binary (like how 1/3 can't be exact in decimal),
  so tiny rounding errors leak out.
  FIXES:
    (0.1 + 0.2).toFixed(2)                          → "0.30" (string, for display)
    Math.abs(a - b) < Number.EPSILON                → safe comparison
    Work in integers (paise/cents) for money math.
*/

/*
  ───────────────────────────────────────────────────────────────────
  30-SECOND INTERVIEW SUMMARY
  "JS has 7 primitive types copied by value and objects copied by
  reference. typeof null returns 'object' due to a legacy bug. There
  are only 6 falsy values. === compares without conversion; == coerces
  types first — strings become numbers, booleans become numbers, and
  objects become primitives via toString. I default to === and explicit
  conversions like Number() to keep code predictable."
  ───────────────────────────────────────────────────────────────────
  NEXT FILE → 03-functions-deep-dive.js
*/
