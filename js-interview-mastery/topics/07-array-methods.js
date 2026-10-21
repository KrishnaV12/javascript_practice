/*
═══════════════════════════════════════════════════════════════════
  TOPIC 07: ARRAY METHODS MASTERY  (map, filter, reduce & friends)
  Run this file:  node topics/07-array-methods.js
═══════════════════════════════════════════════════════════════════

WHY THIS MATTERS IN INTERVIEWS
  Live-coding rounds are FULL of array transformations. Interviewers
  check two things: (1) do you pick the RIGHT method, (2) do you know
  which methods MUTATE the original array.

PICKING THE RIGHT METHOD — ask "what do I want back?"

  I want…                                  → use
  ──────────────────────────────────────────────────────────
  a NEW array, same length, transformed    → map
  a NEW array, fewer items (a subset)      → filter
  ONE single value (sum, object, max…)     → reduce
  the FIRST matching item                  → find   (its index → findIndex)
  a yes/no: does AT LEAST ONE match?       → some
  a yes/no: do ALL match?                  → every
  just to loop with side effects           → forEach (returns undefined!)

MUTATING vs NON-MUTATING (memorize — guaranteed question)
  MUTATE the original:  push, pop, shift, unshift, splice, sort, reverse, fill
  RETURN a new array:   map, filter, slice, concat, flat, toSorted, toReversed
  Memory hook: "splice is a knife 🔪 (cuts the original), slice is a
  camera 📷 (takes a copy)."
*/

"use strict";
console.log("===== TOPIC 07: ARRAY METHODS =====\n");

const nums = [4, 1, 8, 3, 10];

/* ──────────────────────────────────────────────────────────────────
   STEP 1: map — transform every item (1-to-1)
   ────────────────────────────────────────────────────────────────── */

const doubled = nums.map((n, index) => n * 2);   // callback gets (item, index, array)
console.log("STEP 1 → map doubled:", doubled);   // [8,2,16,6,20]
console.log("STEP 1 → original untouched:", nums);

/*
  forEach vs map (asked a lot):
  • map RETURNS a new array → chainable, fits functional style.
  • forEach returns undefined → only for side effects (logging, DOM).
  • If you're not using map's returned array, you wanted forEach.
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 2: filter — keep items that pass a test
   ────────────────────────────────────────────────────────────────── */

const big = nums.filter((n) => n > 3);   // callback must return true/false
console.log("\nSTEP 2 → filter > 3:", big); // [4,8,10]

/* ──────────────────────────────────────────────────────────────────
   STEP 3: ⭐ reduce — fully explained (most feared, most asked)
   ────────────────────────────────────────────────────────────────── */
/*
  reduce(callback, initialValue) boils an array down to ONE value.
  callback = (accumulator, currentItem) => newAccumulator

  ANALOGY: making one smoothie 🥤 from a basket of fruits.
    accumulator = the blender's contents so far
    currentItem = the next fruit you drop in
    initialValue = what's in the blender before you start (often 0, {} or [])

  TRACE of [4,1,8].reduce((acc, n) => acc + n, 0):
    start: acc = 0
    step1: acc = 0 + 4 = 4
    step2: acc = 4 + 1 = 5
    step3: acc = 5 + 8 = 13   → final answer 13

  ⚠️ If you OMIT initialValue, the FIRST element becomes acc and the
  loop starts from the SECOND element. On an empty array that throws —
  so always pass an initial value.
*/

const sum = nums.reduce((acc, n) => acc + n, 0);
console.log("\nSTEP 3 → reduce sum:", sum); // 26

// reduce can build ANYTHING — these patterns ARE interview questions:

// (a) max value
const max = nums.reduce((acc, n) => (n > acc ? n : acc), -Infinity);
console.log("STEP 3 → max:", max); // 10

// (b) ⭐ count occurrences → "frequency counter" (asked constantly)
const fruits = ["apple", "kiwi", "apple", "mango", "kiwi", "apple"];
const count = fruits.reduce((acc, f) => {
  acc[f] = (acc[f] || 0) + 1;   // if missing start at 0, then add 1
  return acc;
}, {});
console.log("STEP 3 → frequency:", count); // { apple:3, kiwi:2, mango:1 }

// (c) ⭐ group by property
const people = [
  { name: "Asha", city: "Pune" },
  { name: "Ravi", city: "Delhi" },
  { name: "Meera", city: "Pune" },
];
const byCity = people.reduce((acc, p) => {
  (acc[p.city] ||= []).push(p.name);   // create bucket if missing, then push
  return acc;
}, {});
console.log("STEP 3 → group by city:", byCity); // { Pune:['Asha','Meera'], Delhi:['Ravi'] }

/* ──────────────────────────────────────────────────────────────────
   STEP 4: find / some / every / includes
   ────────────────────────────────────────────────────────────────── */

console.log("\nSTEP 4 → find > 5:", nums.find((n) => n > 5));        // 8 (FIRST match only)
console.log("STEP 4 → some even:", nums.some((n) => n % 2 === 0));   // true (≥1 passes)
console.log("STEP 4 → every even:", nums.every((n) => n % 2 === 0)); // false (all must pass)
console.log("STEP 4 → includes 8:", nums.includes(8));               // true (simple membership)
// find vs filter: find = first ITEM (or undefined). filter = ARRAY of all matches.

/* ──────────────────────────────────────────────────────────────────
   STEP 5: ⭐ sort — the gotcha everyone gets wrong once
   ────────────────────────────────────────────────────────────────── */

console.log("\nSTEP 5 → default sort:", [25, 100, 9].sort()); // [100, 25, 9] ⚠️
/*
  WHY: without a comparator, sort converts items to STRINGS and sorts
  alphabetically → "100" < "25" < "9". Always pass a comparator for numbers:
     (a, b) => a - b    negative → a first  → ASCENDING
     (a, b) => b - a                         → DESCENDING
*/
console.log("STEP 5 → numeric sort :", [25, 100, 9].sort((a, b) => a - b)); // [9,25,100]
// ⚠️ sort MUTATES. Non-mutating copy: [...arr].sort(...) or arr.toSorted(...)

/* ──────────────────────────────────────────────────────────────────
   STEP 6: slice vs splice (rapid-fire favorite)
   ────────────────────────────────────────────────────────────────── */

const letters = ["a", "b", "c", "d", "e"];
console.log("\nSTEP 6 → slice(1,3):", letters.slice(1, 3));  // ['b','c'] copy; end EXCLUSIVE
console.log("STEP 6 → original after slice:", letters);      // unchanged ✅

const removed = letters.splice(1, 2, "X");  // (start, deleteCount, ...itemsToInsert)
console.log("STEP 6 → splice removed:", removed);            // ['b','c']
console.log("STEP 6 → original after splice:", letters);     // ['a','X','d','e'] ❗mutated

/* ──────────────────────────────────────────────────────────────────
   STEP 7: Chaining — how real interview answers look
   ────────────────────────────────────────────────────────────────── */

const orders = [
  { id: 1, amount: 250, status: "paid" },
  { id: 2, amount: 90,  status: "pending" },
  { id: 3, amount: 400, status: "paid" },
];
const totalPaid = orders
  .filter((o) => o.status === "paid")   // narrow down…
  .map((o) => o.amount)                 // …reshape…
  .reduce((acc, amt) => acc + amt, 0);  // …collapse to one value
console.log("\nSTEP 7 → total of paid orders:", totalPaid); // 650

/* ──────────────────────────────────────────────────────────────────
   STEP 8: Mini problems with model answers
   ────────────────────────────────────────────────────────────────── */

// Q1: remove duplicates (two ways — say both!)
const dup = [1, 2, 2, 3, 1, 4];
console.log("\nSTEP 8 → unique (Set):   ", [...new Set(dup)]);
console.log("STEP 8 → unique (filter):", dup.filter((n, i) => dup.indexOf(n) === i));
// indexOf returns the FIRST position; keep an item only if we're AT that first position.

// Q2: second largest number (sort-free, O(n))
function secondLargest(arr) {
  let first = -Infinity, second = -Infinity;
  for (const n of arr) {
    if (n > first) { second = first; first = n; }       // new champion; old → runner-up
    else if (n > second && n !== first) second = n;     // beats runner-up only
  }
  return second;
}
console.log("STEP 8 → second largest of", nums, "→", secondLargest(nums)); // 8

// Q3: flatten one-level pairs into an object
const entries = [["theme", "dark"], ["lang", "en"]];
console.log("STEP 8 → fromEntries:", Object.fromEntries(entries));

/*
  ───────────────────────────────────────────────────────────────────
  30-SECOND INTERVIEW SUMMARY
  "I choose by return type: map for 1-to-1 transforms, filter for
  subsets, reduce when many values collapse into one — sums, maxima,
  frequency maps, group-bys. find returns the first match, some/every
  answer boolean questions. I'm careful with mutators: sort, reverse,
  splice change the original (and sort compares as strings unless given
  a comparator), while map, filter, slice return new arrays."
  ───────────────────────────────────────────────────────────────────
  NEXT FILE → 08-event-loop.js  (the async heart of JavaScript)
*/
