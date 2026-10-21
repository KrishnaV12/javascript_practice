/*
═══════════════════════════════════════════════════════════════════
  TOPIC 09: PROMISES
  Run this file:  node topics/09-promises.js
═══════════════════════════════════════════════════════════════════

WHY PROMISES EXIST — the problem first

  Before promises, async results arrived via CALLBACKS. Dependent
  steps forced nesting:

    getUser(id, (user) => {
      getOrders(user, (orders) => {
        getInvoice(orders[0], (invoice) => {
          sendEmail(invoice, () => { ... })   // 😱 "callback hell"
        })
      })
    })

  Problems: pyramid shape, error handling duplicated at every level,
  inversion of control (you HAND your function to someone and hope
  they call it exactly once).

THE BIG IDEA — A promise is a RECEIPT for a future value 🧾
  Order a coffee → you get a receipt immediately (the promise object),
  not the coffee. Later it either succeeds (fulfilled → coffee) or
  fails (rejected → "machine broken"). You declare in advance what to
  do in each case using .then / .catch.

THE 3 STATES (one-way doors):
  pending → fulfilled (with a VALUE)      via resolve(value)
  pending → rejected  (with a REASON)     via reject(error)
  Once settled, a promise can NEVER change again — calling resolve
  twice does nothing. (This fixes the "called my callback twice" fear.)
*/

"use strict";
console.log("===== TOPIC 09: PROMISES =====\n");

/* ──────────────────────────────────────────────────────────────────
   STEP 1: Create and consume a promise
   ────────────────────────────────────────────────────────────────── */

function fakeFetch(url, shouldFail = false) {
  return new Promise((resolve, reject) => {
    // The executor runs SYNCHRONOUSLY (see file 08, Step 4).
    setTimeout(() => {
      if (shouldFail) reject(new Error("Network down for " + url));
      else resolve({ url, data: "📦 payload" });
    }, 50);
  });
}

fakeFetch("/api/user")
  .then((res) => console.log("STEP 1 → fulfilled:", res.data))   // success path
  .catch((err) => console.log("STEP 1 → rejected:", err.message)) // failure path
  .finally(() => console.log("STEP 1 → finally: runs either way (cleanup/spinners)"));

/* ──────────────────────────────────────────────────────────────────
   STEP 2: ⭐ CHAINING — how .then defeats callback hell
   ────────────────────────────────────────────────────────────────── */
/*
  THE THREE CHAINING RULES (interviewers probe exactly these):

  RULE 1: .then ALWAYS returns a NEW promise → that's why you can chain.
  RULE 2: whatever you RETURN inside .then becomes the next .then's input.
          • return plain value      → next gets that value
          • return another PROMISE  → chain WAITS for it, next gets its result
          • return nothing          → next gets undefined  ⚠️ classic bug
  RULE 3: throwing inside .then rejects the chain → nearest .catch handles it.
*/
setTimeout(() => {
  console.log("\nSTEP 2 → chaining (flat, readable):");
  fakeFetch("/api/user")
    .then((user) => {
      console.log("   got user from", user.url);
      return fakeFetch("/api/orders");        // RULE 2: return promise → chain waits
    })
    .then((orders) => {
      console.log("   got orders from", orders.url);
      return 42;                              // plain value passes along
    })
    .then((n) => console.log("   previous returned:", n)) // 42
    .catch((err) => console.log("   any step failed:", err.message));
}, 200);

/* ──────────────────────────────────────────────────────────────────
   STEP 3: Error handling — bubbling and recovery
   ────────────────────────────────────────────────────────────────── */
setTimeout(() => {
  console.log("\nSTEP 3 → error bubbling:");
  fakeFetch("/api/a")
    .then(() => fakeFetch("/api/b", true))    // 💥 this one rejects
    .then(() => console.log("   SKIPPED — rejected chains jump over .then"))
    .catch((err) => {
      console.log("   caught:", err.message);
      return "fallback-data";                 // ⭐ catch can RECOVER the chain
    })
    .then((v) => console.log("   chain continues with:", v)); // "fallback-data"
  /*
    KEY POINTS:
    • A rejection skips every .then until the NEAREST .catch.
    • .catch returning a value puts the chain back on the success track.
    • .then(onSuccess, onError) exists, but a trailing .catch is preferred:
      it also catches errors thrown INSIDE onSuccess.
  */
}, 500);

/* ──────────────────────────────────────────────────────────────────
   STEP 4: ⭐ The combinators — all 4, with one-line memory hooks
   ────────────────────────────────────────────────────────────────── */
/*
  Promise.all([])        → "ALL or nothing." Waits for every promise;
                           resolves with array of results IN INPUT ORDER;
                           rejects IMMEDIATELY if ANY rejects (fail-fast).
                           Use: parallel calls where you need all of them.

  Promise.allSettled([]) → "Tell me how EVERYONE did." Never rejects;
                           gives [{status:'fulfilled',value} | {status:'rejected',reason}]
                           Use: batch jobs where partial success is fine.

  Promise.race([])       → "FIRST to settle wins" — success OR failure.
                           Use: timeout pattern (race fetch vs timer).

  Promise.any([])        → "First to SUCCEED wins"; ignores rejections;
                           rejects (AggregateError) only if ALL fail.
                           Use: hit mirror servers, take fastest success.
*/
setTimeout(async () => {
  const fast = new Promise((res) => setTimeout(() => res("fast✅"), 30));
  const slow = new Promise((res) => setTimeout(() => res("slow✅"), 90));
  const bad  = new Promise((_, rej) => setTimeout(() => rej(new Error("bad❌")), 60));
  bad.catch(() => {}); // ⚠️ real-world detail: `bad` rejects at 60ms, but we only
  // hand it to allSettled/race/any AFTER awaiting Promise.all (~90ms). A promise
  // that rejects with NO handler attached yet makes Node crash with
  // "unhandled rejection" — so we pre-attach a no-op catch. The original
  // promise stays rejected and works in the combinators below as normal.

  console.log("\nSTEP 4 → combinators:");
  console.log("   all(fast,slow)   :", await Promise.all([fast, slow]));
  console.log("   allSettled(f,bad):", (await Promise.allSettled([fast, bad]))
    .map((r) => r.status));
  console.log("   race(slow,bad)   :", await Promise.race([slow, bad]).catch((e) => "raced→" + e.message));
  console.log("   any(bad,slow)    :", await Promise.any([bad, slow])); // slow✅ (ignores bad)
}, 800);

/* ──────────────────────────────────────────────────────────────────
   STEP 5: ⭐ Interview builds (memorize these two)
   ────────────────────────────────────────────────────────────────── */

// (a) sleep/delay — used inside countless other interview answers
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// (b) timeout wrapper using race — "fail any call slower than X ms"
function withTimeout(promise, ms) {
  const timer = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timer]);
}

setTimeout(async () => {
  console.log("\nSTEP 5 → builds:");
  await sleep(40);
  console.log("   slept 40ms ✅");
  try {
    await withTimeout(sleep(500), 100);
  } catch (e) {
    console.log("   withTimeout:", e.message); // Timed out after 100ms
  }
}, 1200);

/* ──────────────────────────────────────────────────────────────────
   STEP 6: Run promises SEQUENTIALLY (vs all = parallel) — common ask
   ────────────────────────────────────────────────────────────────── */
setTimeout(async () => {
  const tasks = ["task-1", "task-2", "task-3"].map(
    (name) => () => sleep(40).then(() => console.log("   done:", name))
  ); // ⚠️ note: array of FUNCTIONS returning promises — promises start the
     //          moment they're CREATED, so to control order, delay creation.

  console.log("\nSTEP 6 → sequential with reduce:");
  await tasks.reduce(
    (chain, task) => chain.then(task),   // each task starts after the previous ends
    Promise.resolve()
  );
  console.log("   all sequential tasks finished");
}, 1500);

/*
  RAPID-FIRE FACTS interviewers check:
  • Promise.resolve(x) wraps x; if x is already a promise it's returned as-is.
  • .then callbacks ALWAYS run as microtasks — even for already-resolved
    promises (consistency guarantee). See file 08.
  • Unhandled rejections crash Node processes (warnings → errors in
    modern Node) — always attach a .catch.

  ───────────────────────────────────────────────────────────────────
  30-SECOND INTERVIEW SUMMARY
  "A promise is a one-time container for a future value with three
  states — pending, fulfilled, rejected — and it can settle only once.
  .then returns a new promise, and returning a promise inside .then
  makes the chain wait, which is how chaining flattens callback hell.
  Rejections skip ahead to the nearest .catch, which can recover the
  chain. For concurrency: all is fail-fast, allSettled reports
  everything, race takes the first to settle, any the first to succeed."
  ───────────────────────────────────────────────────────────────────
  NEXT FILE → 10-async-await.js
*/
