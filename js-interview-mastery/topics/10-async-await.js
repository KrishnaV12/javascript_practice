/*
═══════════════════════════════════════════════════════════════════
  TOPIC 10: ASYNC / AWAIT
  Run this file:  node topics/10-async-await.js
═══════════════════════════════════════════════════════════════════

THE BIG IDEA
  async/await is SYNTACTIC SUGAR over promises. Nothing new happens at
  runtime — it just lets you WRITE asynchronous code that READS like
  synchronous code.

  TWO RULES COVER EVERYTHING:

  RULE 1: `async` in front of a function
     → the function ALWAYS returns a PROMISE.
       return 5         → resolves with 5
       throw new Error  → rejects with that error

  RULE 2: `await somePromise` inside an async function
     → PAUSES that function (only that function — the thread is free!)
       until the promise settles, then:
       fulfilled → await EVALUATES to the value
       rejected  → await THROWS the error (so try/catch works!)

  ANALOGY: ordering at a food court 🍜
    await = you place an order and wait at YOUR counter; the whole food
    court (the JS thread) keeps serving everyone else. "Pause" applies
    to your function, never to the program.

  Under the hood, everything after an `await` is scheduled as a
  MICROTASK continuation (see file 08, Step 5).
*/

"use strict";
console.log("===== TOPIC 10: ASYNC / AWAIT =====\n");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fetchUser = async (id) => { await sleep(60); return { id, name: "User" + id }; };
const fetchFail = async () => { await sleep(40); throw new Error("API exploded 💥"); };

/* ──────────────────────────────────────────────────────────────────
   STEP 1: Rule 1 in action — async ALWAYS returns a promise
   ────────────────────────────────────────────────────────────────── */

async function giveFive() { return 5; }
console.log("STEP 1 → raw call:", giveFive());          // Promise { 5 } — not 5!
giveFive().then((v) => console.log("STEP 1 → unwrapped:", v)); // 5

/* ──────────────────────────────────────────────────────────────────
   STEP 2: The before/after — same logic, promises vs await
   ────────────────────────────────────────────────────────────────── */

function withThen() {
  return fetchUser(1)
    .then((user) => fetchUser(user.id + 1))
    .then((user2) => console.log("STEP 2 → then-style got:", user2.name));
}

async function withAwait() {
  const user = await fetchUser(1);          // reads top-to-bottom
  const user2 = await fetchUser(user.id + 1);
  console.log("STEP 2 → await-style got:", user2.name);
}

withThen().then(withAwait);

/* ──────────────────────────────────────────────────────────────────
   STEP 3: ⭐ Error handling — try/catch finally works for async!
   ────────────────────────────────────────────────────────────────── */

async function errorDemo() {
  try {
    const data = await fetchFail();     // rejected promise → await THROWS
    console.log("never reached", data);
  } catch (err) {
    console.log("\nSTEP 3 → caught with try/catch:", err.message);
  } finally {
    console.log("STEP 3 → finally: hide the loading spinner here");
  }

  // Alternative style — catch on the awaited promise itself:
  const result = await fetchFail().catch((err) => "fallback after: " + err.message);
  console.log("STEP 3 → inline .catch fallback:", result);
}

/*
  ⚠️ TRAP: forgetting that an UN-awaited promise's rejection escapes
  your try/catch:
     try { fetchFail(); }      // no await → try block already exited
     catch (e) { ... }         // NEVER catches → unhandled rejection!
  RULE: try/catch only sees errors of promises you AWAIT inside it.
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 4: ⭐⭐ SEQUENTIAL vs PARALLEL — the senior-level question
   ────────────────────────────────────────────────────────────────── */

async function sequential() {
  const t0 = Date.now();
  const a = await fetchUser(1);   // ~60ms — b doesn't even START yet
  const b = await fetchUser(2);   // +60ms
  console.log(`\nSTEP 4 → sequential took ~${Date.now() - t0}ms`, a.name, b.name);
}

async function parallel() {
  const t0 = Date.now();
  const pa = fetchUser(1);        // start BOTH immediately (no await yet)
  const pb = fetchUser(2);        // both timers now ticking together
  const [a, b] = await Promise.all([pa, pb]);   // wait for both, ~60ms total
  console.log(`STEP 4 → parallel   took ~${Date.now() - t0}ms`, a.name, b.name);
}

/*
  WHEN TO USE WHICH:
  • b NEEDS a's result (token → profile)        → sequential awaits ✅
  • independent calls (user + settings + feed)  → Promise.all ✅
  THE INTERVIEW LINE: "await in series adds latencies; Promise.all
  overlaps them. I start independent promises first, await together."
  Also know: Promise.all is fail-fast → use allSettled when partial
  success is acceptable (file 09, Step 4).
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 5: ⭐ await inside loops — forEach is a TRAP
   ────────────────────────────────────────────────────────────────── */

async function loopTrap() {
  const ids = [1, 2, 3];

  console.log("\nSTEP 5 → forEach (broken — does NOT wait):");
  ids.forEach(async (id) => {           // forEach ignores returned promises!
    await sleep(30);
    console.log("   forEach finished id", id);
  });
  console.log("   forEach line AFTER loop — printed FIRST 😬");

  await sleep(120);                     // let the strays finish for clean output

  console.log("STEP 5 → for...of (correct — one at a time):");
  for (const id of ids) {
    await sleep(30);
    console.log("   for...of finished id", id);
  }

  console.log("STEP 5 → map + Promise.all (correct — all at once):");
  const results = await Promise.all(ids.map(async (id) => { await sleep(30); return id * 10; }));
  console.log("   parallel results:", results);
}

/*
  WHY forEach fails: forEach calls your async callback and THROWS AWAY
  the promise it returns — it never waits. Use:
    for...of            → sequential
    map + Promise.all   → parallel
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 6: Output question — async functions are not magic threads
   ────────────────────────────────────────────────────────────────── */

async function outputQuiz() {
  console.log("\nSTEP 6 → predict: ");
  async function f() {
    console.log("   1");                 // sync until first await
    await null;                          // pause; rest = microtask
    console.log("   3");
  }
  f();
  console.log("   2");
  await sleep(10);
  /*
    ANSWER: 1 → 2 → 3
    Calling f() runs its body synchronously up to the first await,
    then returns control; the remainder resumes as a microtask.
  */
}

/* run all steps in order */
(async () => {
  await sleep(250);          // let steps 1–2 finish printing
  await errorDemo();
  await sequential();
  await parallel();
  await loopTrap();
  await outputQuiz();
  console.log("\n✅ Topic 10 complete");
})();

/*
  ───────────────────────────────────────────────────────────────────
  30-SECOND INTERVIEW SUMMARY
  "async/await is sugar over promises: an async function always returns
  a promise, and await pauses only that function — the code after await
  resumes as a microtask, so the main thread never blocks. Rejected
  awaited promises throw, so try/catch/finally works naturally.
  The key performance rule: awaiting in series serializes independent
  calls — I start them together and await Promise.all. And forEach
  can't await — I use for...of for sequential or map + Promise.all for
  parallel."
  ───────────────────────────────────────────────────────────────────
  NEXT FILE → 11-debounce-and-throttle.js
*/
