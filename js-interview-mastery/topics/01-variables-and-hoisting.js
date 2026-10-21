/*
═══════════════════════════════════════════════════════════════════
  TOPIC 01: VARIABLES & HOISTING  (var, let, const, TDZ)
  Run this file:  node topics/01-variables-and-hoisting.js
═══════════════════════════════════════════════════════════════════

WHY THIS MATTERS IN INTERVIEWS
  This is almost always one of the first questions asked. If you can
  explain hoisting using the "two phases" mental model below, you
  immediately sound like someone who understands HOW JavaScript works,
  not just someone who memorized rules.

THE BIG IDEA — JavaScript runs your code in TWO PHASES:

  PHASE 1: MEMORY CREATION (the "scan")
     Before running a single line, the JS engine scans the code and
     allocates memory for variables and functions.
       - `var` variables  -> created in memory, set to `undefined`
       - `let` / `const`  -> created in memory, but left UNINITIALIZED
                             (this uninitialized zone is the TDZ)
       - function declarations -> the ENTIRE function body is stored

  PHASE 2: EXECUTION (the "run")
     Now the engine runs the code line by line, assigning real values.

  "Hoisting" is just the visible EFFECT of Phase 1. Nothing physically
  moves to the top of the file — the engine simply already knows about
  your variables before execution starts.

ANALOGY (use this in interviews)
  Think of Phase 1 like a hotel check-in: every guest (variable) gets a
  room reserved before anyone walks in.
    - `var` guests get a room with a placeholder name tag: "undefined".
    - `let`/`const` guests get a room, but the door is LOCKED until
      they officially arrive (their declaration line). Knocking early
      throws an error. That locked period = Temporal Dead Zone (TDZ).
*/

"use strict";
console.log("===== TOPIC 01: VARIABLES & HOISTING =====\n");

/* ──────────────────────────────────────────────────────────────────
   STEP 1: var is hoisted and initialized with undefined
   ────────────────────────────────────────────────────────────────── */

console.log("STEP 1 →", typeof a, a); // "undefined" undefined  (no crash!)
var a = 10;
console.log("STEP 1 → after assignment:", a); // 10

/*
  WHY no error? In Phase 1 the engine did:  var a = undefined;
  So by the time console.log runs, `a` EXISTS — it just has no value yet.
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 2: let/const are hoisted too — but live in the TDZ
   ────────────────────────────────────────────────────────────────── */

try {
  console.log(b); // ReferenceError: Cannot access 'b' before initialization
} catch (err) {
  console.log("STEP 2 →", err.message);
}
let b = 20;

/*
  IMPORTANT INTERVIEW NUANCE:
  ❌ Wrong answer: "let is not hoisted."
  ✅ Right answer: "let IS hoisted (memory is reserved in Phase 1), but it
     is NOT initialized. Accessing it before the declaration line throws a
     ReferenceError. The window between hoisting and declaration is called
     the Temporal Dead Zone (TDZ)."

  Proof that let is hoisted: the error says "Cannot access 'b' BEFORE
  INITIALIZATION" — the engine clearly knows `b` exists. If it didn't,
  the error would be "b is not defined" (like a truly unknown variable).
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 3: Scope — var is FUNCTION-scoped, let/const are BLOCK-scoped
   ────────────────────────────────────────────────────────────────── */

function scopeDemo() {
  if (true) {
    var x = "I leak out of the if-block";   // function scoped
    let y = "I stay inside the if-block";   // block scoped
  }
  console.log("STEP 3 →", x); // works — var ignores { } blocks
  try {
    console.log(y);
  } catch (err) {
    console.log("STEP 3 →", err.message); // y is not defined
  }
}
scopeDemo();

/*
  RULE OF THUMB:
    var   → scoped to the nearest FUNCTION (or global if none)
    let   → scoped to the nearest { } BLOCK (if, for, while, plain {})
    const → same as let, but cannot be reassigned
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 4: const — "no reassignment", NOT "no mutation"
   ────────────────────────────────────────────────────────────────── */

const user = { name: "Asha" };
user.name = "Ravi";          // ✅ allowed — we MUTATED the object
console.log("STEP 4 →", user.name); // Ravi

try {
  // user = {};               // ❌ TypeError: Assignment to constant variable
  eval("user = {}");          // (wrapped in eval so this file keeps running)
} catch (err) {
  console.log("STEP 4 →", err.message);
}

/*
  MENTAL MODEL: const locks the VARIABLE → VALUE binding (the arrow),
  not the value itself. The object the arrow points at can still change.
  To freeze the object too: Object.freeze(user) — shallow freeze only.
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 5: ⭐ THE CLASSIC INTERVIEW QUESTION — var in a loop
   ────────────────────────────────────────────────────────────────── */

console.log("\nSTEP 5 → var loop (prints after ~50ms):");
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("   var i =", i), 50); // 3, 3, 3
}

console.log("STEP 5 → let loop (prints after ~100ms):");
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("   let j =", j), 100); // 0, 1, 2
}

/*
  WHY does var print 3,3,3?
    1. `var i` is function/global scoped → there is exactly ONE `i`
       shared by all three iterations.
    2. setTimeout callbacks run LATER (after the loop has fully finished).
    3. By then, the single shared `i` has already become 3.
    4. All three callbacks look up the SAME variable → 3, 3, 3.

  WHY does let print 0,1,2?
    `let` is block scoped → each loop iteration gets a BRAND NEW `j`
    binding. Each callback closes over its own copy. (This connects
    directly to closures — see file 04.)

  FOLLOW-UP they will ask: "Fix the var version WITHOUT using let."
    Option A — IIFE (creates a new function scope per iteration):
       for (var i = 0; i < 3; i++) {
         (function (captured) {
           setTimeout(() => console.log(captured), 50);
         })(i);
       }
    Option B — setTimeout's extra arguments:
       setTimeout((v) => console.log(v), 50, i);
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 6: Redeclaration rules (quick-fire interview facts)
   ────────────────────────────────────────────────────────────────── */
/*
  var a = 1;  var a = 2;   ✅ allowed (silently — a common source of bugs)
  let b = 1;  let b = 2;   ❌ SyntaxError: already declared
  let c = 1;  var c = 2;   ❌ SyntaxError (same scope clash)
  const d;                 ❌ SyntaxError: const NEEDS an initial value
  let e;                   ✅ fine — e is undefined until assigned
*/

/* ──────────────────────────────────────────────────────────────────
   PRACTICE: predict the output BEFORE scrolling to the answer
   ────────────────────────────────────────────────────────────────── */

function quiz() {
  console.log("\nQUIZ →", num); // ?
  var num = 7;

  if (true) {
    let msg = "hello";
  }
  // console.log(msg); // ?
}
quiz();

/*
  ANSWERS:
    1. undefined  → `var num` was hoisted inside quiz() and initialized
       to undefined in Phase 1; the value 7 only arrives during Phase 2.
    2. ReferenceError: msg is not defined → `let msg` died with its block.

  ───────────────────────────────────────────────────────────────────
  30-SECOND INTERVIEW SUMMARY (memorize this)
  "JavaScript processes code in two phases. In the creation phase, var
  is hoisted and initialized to undefined, while let and const are
  hoisted but uninitialized — accessing them early throws a
  ReferenceError because they're in the Temporal Dead Zone. var is
  function-scoped; let and const are block-scoped. const prevents
  reassignment of the binding, but objects it points to can still be
  mutated."
  ───────────────────────────────────────────────────────────────────
  NEXT FILE → 02-data-types-and-coercion.js
*/
