/* ═══════════════════════════════════════════════════════════════════
   FILE 14: LOGIC BUILDING PROBLEMS — the "write code live" round
   Run me:  node topics/14-logic-building-problems.js
   ═══════════════════════════════════════════════════════════════════

   WHY THIS MATTERS IN INTERVIEWS
   ──────────────────────────────
   Theory rounds prove you KNOW JavaScript. Logic rounds prove you can
   USE it. These 10 problems are the ones interviewers reuse constantly
   because each one tests a specific muscle:

     recursion        → flatten, deepClone, fibonacci
     closures + Maps  → memoize
     hashmap thinking → twoSum, firstNonRepeating, anagram
     two pointers     → palindrome
     index math       → chunk

   THE BIG IDEA: don't memorize solutions — memorize the PATTERN each
   solution uses. In the interview, name the pattern out loud first
   ("I'll use a hashmap for O(n) lookup"), THEN write code. That one
   sentence is worth more than perfect syntax.
*/
'use strict';

/* ────────────────────────────────────────────────────────────────────
   PROBLEM 1 ⭐: FLATTEN A NESTED ARRAY (the recursion classic)
   ──────────────────────────────────────────────────────────────────── */
/*
  Task: [1, [2, [3, [4]]]]  →  [1, 2, 3, 4]

  PATTERN: recursion. Ask of every item: "are you an array?"
    • No  → keep you.
    • Yes → flatten YOU first, then keep your contents.

  Recursion always needs two parts:
    1. BASE CASE   → item is not an array → just push it (stops the dive)
    2. RECURSIVE   → item is an array     → call flatten on it
*/
function flatten(arr) {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flatten(item)); // dive deeper, spread what comes back
    } else {
      result.push(item);             // base case: plain value
    }
  }
  return result;
}

console.log('1) flatten:', flatten([1, [2, [3, [4]], 5]])); // [1,2,3,4,5]

/*
  TRACE for [1, [2, [3]]]:
    item 1      → not array → push 1
    item [2,[3]]→ array → flatten([2,[3]])
                    item 2   → push 2
                    item [3] → flatten([3]) → [3]
                  returns [2, 3]
    final: [1, 2, 3]

  FOLLOW-UP they love: "flatten only N levels deep?"
  → add a depth parameter: flatten(item, depth - 1) and treat depth === 0
    as a base case. (You built exactly this in file 13 as myFlat!)
*/

/* ────────────────────────────────────────────────────────────────────
   PROBLEM 2 ⭐⭐: DEEP CLONE AN OBJECT (asked in 8/10 interviews)
   ──────────────────────────────────────────────────────────────────── */
/*
  WHY: from file 02 — objects copy by REFERENCE (shared Google Doc).
  A shallow copy ({...obj}) only copies the FIRST level; nested objects
  are still shared. Deep clone = brand-new copies all the way down.

  PATTERN: recursion again, with 3 cases checked IN THIS ORDER:
    1. primitives / null  → return as-is (they copy by value anyway)
    2. special objects    → Date (add Map/Set in real apps)
    3. arrays vs objects  → rebuild each, cloning every child
*/
function deepClone(value) {
  // Case 1: primitives and null pass straight through
  if (value === null || typeof value !== 'object') return value;

  // Case 2: special built-ins that would break with plain copying
  if (value instanceof Date) return new Date(value.getTime());

  // Case 3a: arrays → clone every element
  if (Array.isArray(value)) return value.map(deepClone);

  // Case 3b: plain objects → clone every own property
  const copy = {};
  for (const key in value) {
    if (Object.hasOwn(value, key)) copy[key] = deepClone(value[key]);
  }
  return copy;
}

const original = { name: 'Ravi', skills: ['JS'], joined: new Date('2024-01-01'), address: { city: 'Bengaluru' } };
const cloned = deepClone(original);
cloned.address.city = 'Mumbai';
cloned.skills.push('React');

console.log('2) original city:', original.address.city);   // 'Bengaluru' — untouched!
console.log('   original skills:', original.skills);        // ['JS'] — untouched!
console.log('   clone is new Date object:', cloned.joined !== original.joined); // true

/*
  INTERVIEW TALKING POINTS:
  • "Why not JSON.parse(JSON.stringify(obj))?" → loses Dates (become
    strings), drops functions/undefined, crashes on circular references.
  • "Modern alternative?" → structuredClone(obj) is built-in now, but
    interviewers still want the manual version.
  • "Circular references?" → pass a WeakMap, check it before cloning,
    store clone in it first. Mentioning this = senior signal.
*/

/* ────────────────────────────────────────────────────────────────────
   PROBLEM 3 ⭐: MEMOIZE (closures + Map, ties to file 04)
   ──────────────────────────────────────────────────────────────────── */
/*
  Task: wrap an expensive function so repeated calls with the SAME
  arguments return a cached answer instantly.

  PATTERN: closure holds a private Map (the "backpack" from file 04).
    key   = JSON.stringify(args)  → same args produce same key
    value = the computed result
*/
function memoize(fn) {
  const cache = new Map();                      // private, lives in closure
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log('   (cache hit for', key + ')');
      return cache.get(key);
    }
    const result = fn.apply(this, args);        // compute once...
    cache.set(key, result);                     // ...remember forever
    return result;
  };
}

let computeCount = 0;
const slowSquare = (n) => { computeCount++; return n * n; };
const fastSquare = memoize(slowSquare);

console.log('3) memoize:', fastSquare(9), fastSquare(9), fastSquare(9)); // 81 81 81
console.log('   actually computed:', computeCount, 'time(s)');           // 1

/*
  WHY JSON.stringify for the key? A Map keyed by the raw args array
  would never hit — every call creates a NEW array (reference equality!).
  Stringifying turns (2,3) into the stable string "[2,3]".
  Caveat to mention: it can't distinguish functions/undefined in args.
*/

/* ────────────────────────────────────────────────────────────────────
   PROBLEM 4 ⭐⭐: FIBONACCI — plain vs memoized (the follow-up combo)
   ──────────────────────────────────────────────────────────────────── */
/*
  fib(n) = fib(n-1) + fib(n-2), with fib(0)=0, fib(1)=1
  Sequence: 0 1 1 2 3 5 8 13 ...

  Plain recursion recomputes the same values over and over:
  fib(5) calls fib(3) TWICE, fib(2) THREE times → O(2^n). Terrible.
  Memoization stores each answer the first time → O(n). The interviewer
  is really testing: "do you see the repeated work?"
*/
function fib(n, memo = {}) {
  if (n <= 1) return n;              // base cases stop the recursion
  if (memo[n] !== undefined) return memo[n];   // already solved? reuse!
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
  return memo[n];
}

console.log('4) fib(40):', fib(40)); // 102334155 — instant (plain recursion would take seconds)

/*
  BONUS — iterative version (no recursion, O(1) memory). Saying
  "I can also do it iteratively" earns points:
    let [a, b] = [0, 1];
    for (let i = 0; i < n; i++) [a, b] = [b, a + b];
    return a;
*/

/* ────────────────────────────────────────────────────────────────────
   PROBLEM 5 ⭐: TWO SUM — the hashmap pattern (O(n²) → O(n))
   ──────────────────────────────────────────────────────────────────── */
/*
  Task: given nums and a target, return indices of two numbers that add
  to target.  twoSum([2, 7, 11, 15], 9) → [0, 1]  (2 + 7 = 9)

  NAIVE: nested loops, try every pair → O(n²).
  PATTERN: one pass + a Map. For each number ask:
    "What PARTNER do I need? (target - current). Have I SEEN it already?"
    • Yes → done, return both indices.
    • No  → remember ME for future numbers, move on.
*/
function twoSum(nums, target) {
  const seen = new Map();                    // value → index
  for (let i = 0; i < nums.length; i++) {
    const partner = target - nums[i];        // what would complete the pair?
    if (seen.has(partner)) return [seen.get(partner), i];
    seen.set(nums[i], i);                    // remember current number
  }
  return [];                                 // no pair found
}

console.log('5) twoSum:', twoSum([2, 7, 11, 15], 9));  // [0, 1]
console.log('   twoSum:', twoSum([3, 2, 4], 6));        // [1, 2]

/*
  TRACE [3,2,4], target 6:
    i=0: num=3, partner=3, seen empty → store {3→0}
    i=1: num=2, partner=4, not seen   → store {3→0, 2→1}
    i=2: num=4, partner=2, SEEN at 1  → return [1, 2] ✓
  This "store what you've seen, look up what you need" trick solves
  dozens of interview problems. Internalize it.
*/

/* ────────────────────────────────────────────────────────────────────
   PROBLEM 6: PALINDROME — two pointers
   ──────────────────────────────────────────────────────────────────── */
/*
  Task: "madam" → true, "Race car" → true (ignore case/spaces), "hello" → false.

  PATTERN: two pointers — one finger at each END, walk toward the middle,
  compare at every step. Any mismatch = instant false.
*/
function isPalindrome(str) {
  const s = str.toLowerCase().replace(/[^a-z0-9]/g, ''); // clean: keep letters/digits
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;  // mismatch → not a palindrome
    left++;                                  // move both fingers inward
    right--;
  }
  return true;                               // fingers met → all matched
}

console.log('6) palindrome:', isPalindrome('madam'), isPalindrome('Race car'), isPalindrome('hello'));
// true true false

/*
  One-liner alternative: s === [...s].reverse().join('')
  Mention it, but note two pointers is O(1) extra memory and can exit
  early — the "better engineering" answer.
*/

/* ────────────────────────────────────────────────────────────────────
   PROBLEM 7: ANAGRAM CHECK — frequency counting
   ──────────────────────────────────────────────────────────────────── */
/*
  Task: 'listen' vs 'silent' → true (same letters, rearranged).

  PATTERN: frequency counter. Count letters of word A (+1 each), then
  walk word B subtracting (−1 each). Anagram ⇨ every count lands on 0.
*/
function isAnagram(a, b) {
  if (a.length !== b.length) return false;   // quick exit: lengths must match
  const count = {};
  for (const ch of a) count[ch] = (count[ch] || 0) + 1;  // add
  for (const ch of b) {
    if (!count[ch]) return false;            // letter missing or used up
    count[ch]--;                             // subtract
  }
  return true;
}

console.log('7) anagram:', isAnagram('listen', 'silent'), isAnagram('hello', 'world'));
// true false

/*
  The (count[ch] || 0) + 1 idiom: first time we see 'l', count['l'] is
  undefined → undefined || 0 gives 0 → 0 + 1 = 1. No "if exists" dance.
  Alternative answer: sort both strings and compare — O(n log n) vs this
  O(n). Say both, recommend the counter.
*/

/* ────────────────────────────────────────────────────────────────────
   PROBLEM 8: FIRST NON-REPEATING CHARACTER
   ──────────────────────────────────────────────────────────────────── */
/*
  Task: 'swiss' → 'w'  (s repeats, w never does)

  PATTERN: two passes with a frequency counter.
    Pass 1: count every character.
    Pass 2: walk the string IN ORDER, return the first char whose count is 1.
  (You can't do it in one pass — you don't know a char is unique until
   you've seen the whole string.)
*/
function firstNonRepeating(str) {
  const count = {};
  for (const ch of str) count[ch] = (count[ch] || 0) + 1;
  for (const ch of str) {
    if (count[ch] === 1) return ch;
  }
  return null;                                // every char repeats
}

console.log('8) first non-repeating in "swiss":', firstNonRepeating('swiss'));     // 'w'
console.log('   first non-repeating in "aabbcc":', firstNonRepeating('aabbcc'));   // null

/* ────────────────────────────────────────────────────────────────────
   PROBLEM 9: CHUNK AN ARRAY — index math
   ──────────────────────────────────────────────────────────────────── */
/*
  Task: chunk([1,2,3,4,5], 2) → [[1,2], [3,4], [5]]
  Real-world: pagination, rendering rows of cards.

  PATTERN: jump through the array in steps of `size`, slicing as you go.
  slice(i, i + size) is safe — it just stops at the end (no overflow).
*/
function chunk(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {  // note: i += size, not i++
    result.push(arr.slice(i, i + size));
  }
  return result;
}

console.log('9) chunk:', JSON.stringify(chunk([1, 2, 3, 4, 5], 2))); // [[1,2],[3,4],[5]]

/* ────────────────────────────────────────────────────────────────────
   PROBLEM 10: REMOVE DUPLICATES — three ways (show range!)
   ──────────────────────────────────────────────────────────────────── */
/*
  Same task, three tools — interviewers often say "now do it WITHOUT Set":
*/
const dupes = [1, 2, 2, 3, 1, 4, 3];

// Way 1 ⭐: Set — a Set physically cannot hold duplicates. One line.
const unique1 = [...new Set(dupes)];

// Way 2: filter + indexOf — "keep me only if I'm the FIRST occurrence"
const unique2 = dupes.filter((item, index) => dupes.indexOf(item) === index);

// Way 3: reduce — build a new array, push only unseen items
const unique3 = dupes.reduce(
  (acc, item) => (acc.includes(item) ? acc : [...acc, item]),
  []
);

console.log('10) unique:', unique1, unique2, unique3); // [1,2,3,4] ×3

/*
  Complexity talk (senior signal): Set is O(n). filter+indexOf and the
  reduce version are O(n²) because indexOf/includes re-scan each time.
  For objects (dedupe by id), use a Map keyed by the id.
*/

/* ═══════════════════════════════════════════════════════════════════
   THE PATTERN CHEAT SHEET (name these out loud in interviews)
   ═══════════════════════════════════════════════════════════════════
   recursion           → "base case + smaller subproblem" (flatten, clone, fib)
   hashmap / Map       → "trade memory for O(n) lookup"   (twoSum, memoize)
   frequency counter   → "count, then verify"             (anagram, non-repeating)
   two pointers        → "both ends, walk inward"         (palindrome)
   index stepping      → "i += size, slice windows"       (chunk)

   ───────────────────────────────────────────────────────────────────
   30-SECOND INTERVIEW SUMMARY
   "For logic problems I reach for a small set of patterns: recursion
   with a clear base case for nested structures like flatten and deep
   clone; a Map for O(n) lookups as in two sum and memoize; frequency
   counters for anagram-style questions; and two pointers for
   palindromes. I state the pattern and complexity first, code second,
   then mention edge cases — empty input, null, single element."
   ───────────────────────────────────────────────────────────────────
   NEXT FILE → 15-output-based-questions.js (the rapid-fire round!)
*/
