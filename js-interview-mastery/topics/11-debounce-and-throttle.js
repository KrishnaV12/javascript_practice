/*
═══════════════════════════════════════════════════════════════════
  TOPIC 11: DEBOUNCE & THROTTLE  ⭐ #1 machine-coding question
  Run this file:  node topics/11-debounce-and-throttle.js
═══════════════════════════════════════════════════════════════════

THE PROBLEM THEY SOLVE
  Some browser events fire ABSURDLY often: typing, scrolling, resizing,
  mousemove can fire dozens of times per second. If each event triggers
  an API call or heavy re-render, you melt the network and the UI.
  Debounce and throttle are RATE-LIMITING wrappers around a function.

THE TWO STRATEGIES — one analogy each:

  DEBOUNCE = the elevator door 🛗
    Every time someone walks in (an event), the door-close timer RESTARTS.
    The elevator moves only after a quiet gap with no new arrivals.
    → "Run the function only after the user has STOPPED for X ms."
    USE FOR: search-as-you-type (wait till typing pauses), window resize
    (recalculate once at the end), auto-save drafts, form validation.

  THROTTLE = a metro train 🚇
    The train leaves every 5 minutes NO MATTER how many people arrive.
    Crowds in between simply wait for the next departure.
    → "Run the function AT MOST once every X ms, no matter what."
    USE FOR: infinite-scroll position checks, mousemove/drag handlers,
    game loops, "spam-proof" buttons, analytics pings while scrolling.

  ONE-LINE DIFFERENCE (say this first in interviews):
  Debounce fires AFTER the storm ends. Throttle fires steadily DURING
  the storm. Continuous typing → debounced fn may run ONCE at the end;
  throttled fn keeps running every X ms throughout.
*/

"use strict";
console.log("===== TOPIC 11: DEBOUNCE & THROTTLE =====\n");

/* ──────────────────────────────────────────────────────────────────
   STEP 1: ⭐ DEBOUNCE — build it line by line
   ────────────────────────────────────────────────────────────────── */

function debounce(fn, delay) {
  let timerId;                                  // lives in the CLOSURE (file 04!)
                                                // one private timer per debounced fn
  return function (...args) {                   // this wrapper replaces fn
    clearTimeout(timerId);                      // ① someone walked in → cancel old timer
    timerId = setTimeout(() => {                // ② restart the countdown
      fn.apply(this, args);                     // ③ quiet for `delay` ms → finally run,
    }, delay);                                  //    forwarding this + latest args
  };
}

/*
  WHY EACH PIECE EXISTS (interviewers probe these):
  • closure over timerId → state survives between calls without globals.
  • clearTimeout BEFORE setTimeout → that's the "restart" behavior;
    without it you'd just delay every call (and run all of them).
  • fn.apply(this, args) → preserves the caller's `this` (works as an
    object method / DOM handler) and passes the MOST RECENT arguments.
  • regular function (not arrow) for the wrapper → so it HAS a dynamic
    `this` to forward.
*/

// SIMULATION: a user types "react" quickly, then pauses.
const search = debounce((query) => console.log(`   🔍 API call for "${query}"`), 100);

console.log("STEP 1 → typing r, re, rea, reac, react fast…");
search("r"); search("re"); search("rea"); search("reac"); search("react");
// → exactly ONE api call, for "react", ~100ms after the last keystroke.

/* ──────────────────────────────────────────────────────────────────
   STEP 2: ⭐ THROTTLE — version A: timestamp (leading edge)
   ────────────────────────────────────────────────────────────────── */

function throttle(fn, interval) {
  let lastRun = 0;                              // when did we last allow a run?
  return function (...args) {
    const now = Date.now();
    if (now - lastRun >= interval) {            // enough time passed?
      lastRun = now;                            // mark this departure
      fn.apply(this, args);                     // run IMMEDIATELY (leading edge)
    }                                           // else: silently drop the call
  };
}

setTimeout(() => {
  console.log("\nSTEP 2 → scroll events every 25ms, throttled to 100ms:");
  const onScroll = throttle((y) => console.log(`   📜 handled scroll at y=${y}`), 100);
  let y = 0;
  const id = setInterval(() => {
    y += 25;
    onScroll(y);                                // fired ~12 times…
    if (y >= 300) clearInterval(id);            // …handled only ~3 times
  }, 25);
}, 300);

/* ──────────────────────────────────────────────────────────────────
   STEP 3: THROTTLE — version B: timer-based (trailing edge)
   Mention you know BOTH; senior follow-up: "your version A drops the
   final call — what if I need the last value too?"
   ────────────────────────────────────────────────────────────────── */

function throttleTrailing(fn, interval) {
  let timerId = null;
  let lastArgs = null;
  return function (...args) {
    lastArgs = args;                            // always remember the latest args
    if (timerId) return;                        // a departure is already scheduled
    timerId = setTimeout(() => {
      fn.apply(this, lastArgs);                 // run with the FRESHEST args
      timerId = null;                           // open the gate for the next window
    }, interval);
  };
}
// (Production libraries like lodash combine leading+trailing with options —
//  knowing the trade-off is what interviews actually test.)

/* ──────────────────────────────────────────────────────────────────
   STEP 4: Debounce with extras — common follow-ups
   ────────────────────────────────────────────────────────────────── */

// (a) "Add immediate/leading mode": run on the FIRST call, then go quiet.
function debounceLeading(fn, delay) {
  let timerId;
  return function (...args) {
    const shouldRunNow = !timerId;              // no pending timer = quiet period
    clearTimeout(timerId);
    timerId = setTimeout(() => (timerId = null), delay); // reopen after quiet gap
    if (shouldRunNow) fn.apply(this, args);     // leading-edge call
  };
}

// (b) "Add a cancel method": e.g. component unmounts before timer fires.
function debounceWithCancel(fn, delay) {
  let timerId;
  function wrapper(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  }
  wrapper.cancel = () => clearTimeout(timerId); // functions are objects → attach API
  return wrapper;
}

setTimeout(() => {
  console.log("\nSTEP 4 → leading debounce (button spam → one instant action):");
  const pay = debounceLeading(() => console.log("   💳 payment fired ONCE, instantly"), 150);
  pay(); pay(); pay();                          // clicks 2 & 3 ignored

  const autoSave = debounceWithCancel(() => console.log("   should never print"), 80);
  autoSave();
  autoSave.cancel();                            // unmounted → no stale save
  console.log("STEP 4 → cancel() prevented a stale call ✅");
}, 800);

/* ──────────────────────────────────────────────────────────────────
   STEP 5: How you'd wire these in a browser (reference snippet)
   ────────────────────────────────────────────────────────────────── */
/*
  const input = document.querySelector('#search');
  input.addEventListener('input', debounce((e) => {
    fetch('/api/search?q=' + e.target.value);   // fires after typing pauses
  }, 300));

  window.addEventListener('scroll', throttle(() => {
    checkIfNearPageBottom();                    // at most once per 200ms
  }, 200));

  ⚠️ Create the debounced function ONCE (outside the handler / outside
  React render, e.g. useMemo/useRef). Re-creating it per event makes a
  fresh timer each time → debouncing silently stops working.
*/

/*
  ───────────────────────────────────────────────────────────────────
  30-SECOND INTERVIEW SUMMARY
  "Both rate-limit a noisy function using a closure for private state.
  Debounce resets a timer on every call and runs only after X ms of
  silence — ideal for search inputs and resize. Throttle guarantees at
  most one run per X ms during continuous activity — ideal for scroll
  and mousemove. I implement debounce with clearTimeout+setTimeout and
  throttle with a timestamp; I use fn.apply(this, args) so `this` and
  the latest arguments are preserved, and I can extend either with
  leading-edge or cancel support."
  ───────────────────────────────────────────────────────────────────
  NEXT FILE → 12-currying-and-composition.js
*/
