/* ═══════════════════════════════════════════════════════════════════
   FILE 16: ES6+ FEATURES — modern syntax interviewers expect fluency in
   Run me:  node topics/16-es6-features.js
   ═══════════════════════════════════════════════════════════════════

   WHY THIS MATTERS IN INTERVIEWS
   ──────────────────────────────
   "Tell me about ES6 features" is a warm-up question in nearly every
   round — but follow-ups go deep fast ("what does spread do to nested
   objects?", "Map vs object?"). Interviewers also read your live code:
   using destructuring, optional chaining and spread NATURALLY marks
   you as current; var and arguments mark you as 2014.

   THE BIG IDEA: ES6+ features mostly REPLACE clunky old patterns.
   For each one, know (a) the syntax, (b) the old pain it removes,
   (c) the one gotcha interviewers poke at.
*/
'use strict';

/* ────────────────────────────────────────────────────────────────────
   STEP 1: TEMPLATE LITERALS — strings with superpowers
   ──────────────────────────────────────────────────────────────────── */
const dev = 'Priya';
const years = 4;

// OLD pain: 'Hi ' + name + ', ' + years + ' yrs' — quote/plus soup
// NEW: backticks, ${expression} holes, real multi-line support
console.log(`1) Hi ${dev}, ${years} ${years === 1 ? 'year' : 'years'} of JS`);

const multiLine = `line one
line two`;                       // actual newline, no \n gymnastics
console.log('   multi-line works:', multiLine.includes('\n'));   // true

/*
  GOTCHA they ask: ${} accepts ANY expression — function calls,
  ternaries, math — it's evaluated and converted to a string.
  Bonus term to drop: "tagged templates" (a function can intercept the
  template — how libraries like styled-components work).
*/

/* ────────────────────────────────────────────────────────────────────
   STEP 2 ⭐: DESTRUCTURING — unpack values in one line
   ──────────────────────────────────────────────────────────────────── */
// Object destructuring: pluck by NAME (order doesn't matter)
const employee = { name: 'Ravi', city: 'Bengaluru', role: 'Frontend' };
const { name, role } = employee;
console.log('2) plucked:', name, '-', role);             // Ravi - Frontend

// Rename + default in one go:
const { city: location, salary = 'not disclosed' } = employee;
console.log('   renamed + default:', location, '|', salary);

// Nested destructuring (interview favorite):
const config = { server: { host: 'localhost', port: 8080 } };
const { server: { port } } = config;       // dives two levels
console.log('   nested port:', port);                     // 8080

// Array destructuring: pluck by POSITION
const [first, second] = ['gold', 'silver', 'bronze'];
console.log('   array:', first, second);                  // gold silver

// ⭐ The classic trick — swap WITHOUT a temp variable:
let p = 1, q = 2;
[p, q] = [q, p];
console.log('   swapped:', p, q);                         // 2 1

// In function parameters (you'll write this daily in React):
function greet({ name, role = 'developer' }) {
  return `${name} the ${role}`;
}
console.log('  ', greet(employee));                       // Ravi the Frontend

/*
  GOTCHAS:
  • Objects pluck by NAME, arrays by POSITION — mixing this up is the #1 slip.
  • Destructuring a missing key gives undefined (defaults only kick in
    for undefined, not null — same rule as default params, file 03).
  • Skipping array items: const [, , third] = arr;
*/

/* ────────────────────────────────────────────────────────────────────
   STEP 3 ⭐: SPREAD vs REST — same dots, opposite directions
   ──────────────────────────────────────────────────────────────────── */
/*
  MEMORY HOOK:
    SPREAD = unpacking a suitcase (one box → loose items)  — in calls/literals
    REST   = packing a suitcase  (loose items → one box)   — in parameters
*/
const base = [1, 2, 3];
const extended = [...base, 4, 5];           // SPREAD: copy + add
console.log('3) spread array:', extended);                 // [1,2,3,4,5]

const defaults = { theme: 'dark', lang: 'en' };
const userPrefs = { lang: 'kn' };
const settings = { ...defaults, ...userPrefs };  // later spread WINS conflicts
console.log('   merged (later wins):', settings);          // {theme:'dark', lang:'kn'}

function sum(...nums) {                     // REST: gather all args into array
  return nums.reduce((total, n) => total + n, 0);
}
console.log('   rest params:', sum(1, 2, 3, 4));            // 10

// ⭐ THE GOTCHA: spread copies are SHALLOW — one level only!
const team = { lead: 'Asha', stack: { fe: 'React' } };
const copy = { ...team };
copy.stack.fe = 'Vue';                      // mutates the SHARED nested object
console.log('   shallow trap — original:', team.stack.fe);  // 'Vue' 😱

/*
  Say it like this: "Spread clones the first level; nested objects are
  still shared references. For true independence you deep clone —
  structuredClone or the recursive version I can write." (file 14!)
*/

/* ────────────────────────────────────────────────────────────────────
   STEP 4: ENHANCED OBJECT LITERALS — less typing, same object
   ──────────────────────────────────────────────────────────────────── */
const make = 'Tata';
const key = 'color';

const car = {
  make,                          // shorthand: make: make
  start() {                      // method shorthand: start: function() {}
    return `${this.make} started`;
  },
  [key]: 'blue',                 // COMPUTED key: evaluates the variable
  [`is${make}`]: true,           // computed keys can be expressions
};
console.log('4) enhanced literal:', car.make, '|', car.start(), '|', car.color, '|', car.isTata);

/* ────────────────────────────────────────────────────────────────────
   STEP 5 ⭐: OPTIONAL CHAINING (?.) + NULLISH COALESCING (??)
   ──────────────────────────────────────────────────────────────────── */
/*
  THE PAIN THEY FIX: "Cannot read properties of undefined" — the most
  common crash in frontend code, usually from API data.

  obj?.a?.b  → if anything before a ?. is null/undefined, STOP and
               return undefined instead of crashing.
  x ?? fallback → use fallback ONLY if x is null/undefined.
                  (|| also replaces 0, '', false — often a BUG.)
*/
const response = { user: { profile: null } };

console.log('5) deep safe read:', response.user?.profile?.email);      // undefined, no crash
console.log('   works on calls too:', response.user.sayHi?.());        // undefined, no crash

// ⭐ THE ?? vs || question (asked constantly):
const itemsInCart = 0;
console.log('   0 || 10 →', itemsInCart || 10);   // 10  — WRONG! 0 is real data
console.log('   0 ?? 10 →', itemsInCart ?? 10);   // 0   — correct: 0 isn't nullish

/*
  ONE-LINER for interviews: "?? only treats null/undefined as missing;
  || treats ALL falsy values as missing — so || silently swallows
  legitimate 0, '' and false."
*/

/* ────────────────────────────────────────────────────────────────────
   STEP 6 ⭐: MAP & SET — proper data structures, finally
   ──────────────────────────────────────────────────────────────────── */
/*
  MAP vs plain object — the comparison they want:
  • Map keys can be ANY type (objects, functions); object keys become strings
  • Map remembers insertion order & has .size; object needs Object.keys().length
  • Map is iterable directly; no prototype junk to worry about
  Use object for fixed-shape records, Map for dynamic key→value lookups.
*/
const visits = new Map();
const userA = { id: 1 };           // an OBJECT as a key — impossible with {}
visits.set(userA, 5).set('guest', 1);   // set() chains
console.log('6) Map:', visits.get(userA), '| size:', visits.size);   // 5 | 2

// SET = a bag of UNIQUE values → instant dedupe (file 14 used this)
const tags = new Set(['js', 'css', 'js', 'html', 'css']);
tags.add('js');                    // ignored — already there
console.log('   Set:', [...tags], '| has css?', tags.has('css'));    // ['js','css','html'] true

/*
  Bonus name-drop: WeakMap/WeakSet hold keys WEAKLY — if the key object
  has no other references it can be garbage-collected. Used for private
  data and caches that don't cause memory leaks.
*/

/* ────────────────────────────────────────────────────────────────────
   STEP 7 ⭐: for...of vs for...in — one letter, huge difference
   ──────────────────────────────────────────────────────────────────── */
/*
  MEMORY HOOK:  for...of → values Of an iterable (arrays, strings, Maps)
                for...in → keys/Indexes IN an object (incl. inherited!)
*/
const colors = ['red', 'green'];
colors.extra = 'oops';             // arrays are objects; you CAN do this

let ofResult = [];
for (const value of colors) ofResult.push(value);

let inResult = [];
for (const k in colors) inResult.push(k);

console.log('7) for...of →', ofResult);   // ['red','green']  — values only, ignores extra
console.log('   for...in →', inResult);   // ['0','1','extra'] — STRING keys + the stray prop!

/*
  THE RULE: arrays → for...of (or forEach/map). for...in is for plain
  objects only, and even there Object.keys/entries is usually cleaner
  because for...in also walks INHERITED enumerable props (file 06).
*/

/* ────────────────────────────────────────────────────────────────────
   STEP 8: SYMBOLS — guaranteed-unique keys (brief but asked)
   ──────────────────────────────────────────────────────────────────── */
const id1 = Symbol('id');
const id2 = Symbol('id');
console.log('8) Symbol("id") === Symbol("id") →', id1 === id2);   // false — ALWAYS unique

const order = { [id1]: 901, item: 'laptop' };
console.log('   hidden from keys:', Object.keys(order));           // ['item'] only!

/*
  WHY they exist: attach metadata to objects with ZERO risk of clashing
  with normal keys, invisible to for...in/JSON.stringify. "Well-known
  symbols" like Symbol.iterator are how for...of finds what to iterate.
*/

/* ────────────────────────────────────────────────────────────────────
   STEP 9: GENERATORS — functions you can pause (brief intro)
   ──────────────────────────────────────────────────────────────────── */
/*
  function* + yield = a function that PAUSES at each yield and resumes
  when .next() is called. Think: a Netflix series, one episode per next().
*/
function* idMaker() {
  let n = 1;
  while (true) yield n++;          // infinite, but lazy — only runs when asked
}
const ids = idMaker();
console.log('9) generator:', ids.next().value, ids.next().value, ids.next().value); // 1 2 3

/*
  Interview framing: "Generators produce values lazily on demand and
  power custom iterables; libraries like Redux-Saga built on them.
  Day-to-day, async/await (file 10) is actually built on the same
  pause/resume machinery."
*/

/* ────────────────────────────────────────────────────────────────────
   STEP 10: MODULES — import/export (syntax notes)
   ──────────────────────────────────────────────────────────────────── */
/*
  (Notes only — modules need separate files/package config to demo.)

  NAMED exports (many per file, import with EXACT names in braces):
      export const add = (a, b) => a + b;
      import { add, sub as minus } from './math.js';

  DEFAULT export (ONE per file, importer picks any name, no braces):
      export default function App() {}
      import App from './App.js';

  ES MODULES vs COMMONJS (the classic question):
      CommonJS  → require()/module.exports, loads SYNCHRONOUSLY at runtime,
                  Node's original system.
      ES Modules→ import/export, parsed STATICALLY before running — which
                  is what enables tree-shaking (bundlers drop unused
                  exports) and top-level await. Browsers + modern Node.
  One-liner: "Static structure is the superpower — tools can analyze
  imports without executing code."
*/
console.log('10) modules: see syntax notes in this file ↑');

/* ═══════════════════════════════════════════════════════════════════
   ONE-LINE ANSWERS — "name some ES6+ features" lightning round
   ═══════════════════════════════════════════════════════════════════
   let/const ........ block scope + TDZ (file 01)
   arrow fns ........ short syntax, lexical this (files 03, 05)
   template literals  `Hi ${name}`, multi-line
   destructuring .... unpack by name/position, swap trick
   spread/rest ...... unpack vs gather; shallow!
   default params ... f(x = 10), triggers on undefined only
   optional chain ... a?.b stops crashes
   nullish ?? ....... fallback for null/undefined ONLY
   Map/Set .......... any-type keys / unique values
   Promises/async ... files 09–10
   classes .......... prototype sugar (file 06)
   modules .......... import/export, static analysis

   ───────────────────────────────────────────────────────────────────
   30-SECOND INTERVIEW SUMMARY
   "ES6+ replaced old pain points: template literals over string
   concatenation, destructuring and spread/rest over manual unpacking
   — remembering spread is shallow — optional chaining and ?? over
   defensive && chains, with ?? correctly preserving 0 and empty
   string. Map and Set give real data structures with any-type keys
   and uniqueness. for...of iterates values, for...in keys. And ES
   modules' static imports are what make tree-shaking possible."
   ───────────────────────────────────────────────────────────────────
   🎉 THAT'S ALL 16 FILES — you've covered the entire core interview
   syllabus. Re-run file 15 cold in a few days; when you can explain
   every answer out loud, you're ready. Good luck — go get the offer!
*/
