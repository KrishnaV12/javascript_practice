/*
═══════════════════════════════════════════════════════════════════
  TOPIC 08: THE EVENT LOOP  (call stack, microtasks, macrotasks)
  Run this file:  node topics/08-event-loop.js
═══════════════════════════════════════════════════════════════════

WHY THIS MATTERS IN INTERVIEWS
  "Explain the event loop" + "predict this output" is THE async
  question combo. Master the model below and you can trace ANY snippet.

THE BIG IDEA — JS is single-threaded but never blocks (when written well)

  JavaScript has ONE call stack → it executes one thing at a time.
  So how do timers, network calls and clicks work without freezing the
  page? The RUNTIME (browser / Node) helps with four pieces:

  ┌────────────────────────────────────────────────────────────┐
  │ 1. CALL STACK     → where code actually runs, one frame    │
  │                     at a time (LIFO)                       │
  │ 2. WEB APIs /     → the runtime's helpers: timers, fetch,  │
  │    Node APIs        DOM events run HERE, off the stack     │
  │ 3. QUEUES         → finished callbacks wait in line:       │
  │      MICROTASK queue → promise .then/.catch/.finally,      │
  │                        queueMicrotask, await continuations │
  │      MACROTASK queue → setTimeout, setInterval, I/O, UI    │
  │                        events (a.k.a. task/callback queue) │
  │ 4. EVENT LOOP     → a tiny manager that repeats forever:   │
  │      "Is the call stack empty?                             │
  │       → first DRAIN the ENTIRE microtask queue             │
  │       → then take ONE macrotask → repeat"                  │
  └────────────────────────────────────────────────────────────┘

  ⭐ THE PRIORITY RULE (this answers 90% of output questions):
     synchronous code  >  ALL microtasks  >  one macrotask  > (repeat)

  ANALOGY: a doctor's clinic 🏥
    Current patient        = call stack (one at a time)
    VIP line (microtasks)  = fully emptied between patients
    Normal line (macrotasks)= only ONE called in per round
    Receptionist           = event loop

  setTimeout(fn, 0) therefore does NOT mean "run now". It means:
  "after AT LEAST 0ms, put fn in the macrotask queue" — it still waits
  for the stack to clear and all microtasks to finish.
*/

"use strict";
console.log("===== TOPIC 08: EVENT LOOP =====\n");

/* ──────────────────────────────────────────────────────────────────
   STEP 1: ⭐ THE classic — trace it like the engine does
   ────────────────────────────────────────────────────────────────── */

console.log("STEP 1 → A (sync)");

setTimeout(() => console.log("STEP 1 → C (macrotask)"), 0);

Promise.resolve().then(() => console.log("STEP 1 → B (microtask)"));

console.log("STEP 1 → D (sync)");

/*
  EXPECTED ORDER:  A → D → B → C

  FULL TRACE (narrate exactly like this in interviews):
  1. console.log("A")          → runs on the stack → prints A
  2. setTimeout(...)           → handed to the timer API; after 0ms its
                                 callback is placed in the MACROTASK queue
  3. Promise.resolve().then    → already resolved → callback goes
                                 straight to the MICROTASK queue
  4. console.log("D")          → prints D. Script ends → stack EMPTY.
  5. Event loop: drain microtasks first → prints B
  6. Event loop: take one macrotask     → prints C
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 2: Chained microtasks all run before any macrotask
   ────────────────────────────────────────────────────────────────── */
setTimeout(() => {
  console.log("\nSTEP 2 → start");
  setTimeout(() => console.log("STEP 2 → timeout 1"), 0);
  Promise.resolve()
    .then(() => console.log("STEP 2 → promise 1"))
    .then(() => console.log("STEP 2 → promise 2"));   // queued as a NEW microtask
  setTimeout(() => console.log("STEP 2 → timeout 2"), 0);
  console.log("STEP 2 → end");
  /*
    ORDER: start → end → promise 1 → promise 2 → timeout 1 → timeout 2
    KEY INSIGHT: promise 2 is queued WHILE draining microtasks, and the
    loop keeps draining until the micro queue is EMPTY — so even a chain
    of 100 .then()s would all run before timeout 1.
  */
}, 150);

/* ──────────────────────────────────────────────────────────────────
   STEP 3: Microtasks can schedule macrotasks (and vice versa)
   ────────────────────────────────────────────────────────────────── */
setTimeout(() => {
  setTimeout(() => console.log("STEP 3 → A (macro)"), 0);
  Promise.resolve().then(() => {
    console.log("STEP 3 → B (micro)");
    setTimeout(() => console.log("STEP 3 → C (macro scheduled BY micro)"), 0);
  });
  console.log("STEP 3 → D (sync)");
  /*
    ORDER: D → B → A → C
    Why is C last? C was added to the macrotask queue AFTER A was already
    waiting there. Queues are first-in-first-out.
  */
}, 400);

/* ──────────────────────────────────────────────────────────────────
   STEP 4: The executor runs SYNCHRONOUSLY (sneaky favorite)
   ────────────────────────────────────────────────────────────────── */
setTimeout(() => {
  console.log("\nSTEP 4 → before new Promise");
  new Promise((resolve) => {
    console.log("STEP 4 → inside executor (SYNC!)"); // runs immediately
    resolve();
  }).then(() => console.log("STEP 4 → then (micro)"));
  console.log("STEP 4 → after new Promise");
  /*
    ORDER: before → inside executor → after → then
    Only .then callbacks are async; the function you pass to
    `new Promise(...)` executes right away on the stack.
  */
}, 650);

/* ──────────────────────────────────────────────────────────────────
   STEP 5: async/await translated into event-loop language
   ────────────────────────────────────────────────────────────────── */
setTimeout(async () => {
  async function demo() {
    console.log("\nSTEP 5 → 1 (sync part of async fn)");
    await null;   // ⭐ await = "pause me; resume as a MICROTASK"
    console.log("STEP 5 → 3 (after await = microtask)");
  }
  demo();
  console.log("STEP 5 → 2 (sync after calling demo)");
  /*
    ORDER: 1 → 2 → 3
    An async function runs synchronously UNTIL the first await; the rest
    of its body is queued as a microtask. So `await` is just .then in
    a prettier coat. (Full async/await coverage in file 10.)
  */
}, 900);

/* ──────────────────────────────────────────────────────────────────
   STEP 6: Why a blocked stack freezes EVERYTHING
   ────────────────────────────────────────────────────────────────── */
setTimeout(() => {
  console.log("\nSTEP 6 → blocking the stack for ~80ms…");
  setTimeout(() => console.log("STEP 6 → timer wanted 0ms, got the stack late"), 0);
  const start = Date.now();
  while (Date.now() - start < 80) { /* busy loop: stack is occupied */ }
  console.log("STEP 6 → done blocking");
  /*
    The 0ms timer fires only AFTER the busy loop — because callbacks can
    only run when the stack is empty. This is why long synchronous work
    freezes UI in browsers, and why we chunk heavy work or move it to
    Web Workers.
  */
}, 1150);

/*
  BONUS QUICK-FIRE FACTS:
  • Microtask examples: .then/.catch/.finally, await, queueMicrotask,
    MutationObserver. Macrotask examples: setTimeout/Interval, DOM
    events, network I/O callbacks, setImmediate (Node).
  • Browsers may RENDER between macrotasks (after microtasks drain) —
    a flood of microtasks can starve rendering.
  • Node extras (mention only if asked): process.nextTick runs even
    before promise microtasks; setImmediate runs in the "check" phase.

  ───────────────────────────────────────────────────────────────────
  30-SECOND INTERVIEW SUMMARY
  "JS runs on a single call stack; async work is delegated to runtime
  APIs whose callbacks wait in queues. The event loop, whenever the
  stack empties, first drains the ENTIRE microtask queue (promise
  callbacks, await continuations) and only then runs ONE macrotask
  (timers, events). That's why a resolved promise's .then always beats
  setTimeout(fn, 0), and why blocking the stack freezes everything."
  ───────────────────────────────────────────────────────────────────
  NEXT FILE → 09-promises.js
*/
