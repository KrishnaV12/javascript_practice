/* ═══════════════════════════════════════════════════════════════════
   FILE 15: OUTPUT-BASED QUESTIONS — the rapid-fire prediction round
   Run me:  node topics/15-output-based-questions.js
   ═══════════════════════════════════════════════════════════════════

   WHY THIS MATTERS IN INTERVIEWS
   ──────────────────────────────
   Almost every JS interview has a round of "what does this print?".
   It's the fastest way to test whether you ACTUALLY understand
   hoisting, closures, `this`, references, coercion and the event loop
   — everything from files 01–10 — or just recognize the words.

   HOW TO USE THIS FILE (important!)
   ─────────────────────────────────
   Each question shows the code in a comment FIRST. Cover the terminal,
   read the code, say your answer OUT LOUD (like in a real interview),
   THEN look at the printed output and the WHY. Predicting before
   peeking is the whole workout.
*/
'use strict';

const divider = (n, title) =>
  console.log(`\n──────── Q${n}: ${title} ────────`);

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function main() {

  /* ──────────────────────────────────────────────────────────────────
     Q1 ⭐: var hoisting vs function hoisting
     ──────────────────────────────────────────────────────────────────
     function q1() {
       console.log(a);
       var a = 10;
       hello();
       function hello() { console.log('hello from below!'); }
     }
     q1();
     What prints?
  */
  divider(1, 'var vs function hoisting');
  function q1() {
    console.log(a);            // ?
    var a = 10;
    hello();                   // ?
    function hello() { console.log('hello from below!'); }
  }
  q1();
  /*
    ANSWER: undefined, then "hello from below!"
    WHY: In the memory-creation phase (file 01), `var a` is hoisted and
    set to undefined — the VALUE 10 isn't assigned until that line runs.
    Function DECLARATIONS hoist completely (name + body), so calling
    hello() before its line works fine.
  */

  /* ──────────────────────────────────────────────────────────────────
     Q2: the Temporal Dead Zone
     ──────────────────────────────────────────────────────────────────
     console.log(b);
     let b = 5;
     What happens?
  */
  divider(2, 'TDZ — let before its line');
  try {
    console.log(b);            // ?
    let b = 5;
  } catch (err) {
    console.log('Threw:', err.constructor.name, '—', err.message);
  }
  /*
    ANSWER: ReferenceError: Cannot access 'b' before initialization
    WHY: `let` IS hoisted, but stays uninitialized in the Temporal Dead
    Zone until its declaration line. Touching it there throws — unlike
    var's silent undefined. (We caught it so the file keeps running.)
  */

  /* ──────────────────────────────────────────────────────────────────
     Q3 ⭐: closures in a loop — var vs let
     ──────────────────────────────────────────────────────────────────
     const fns = [];
     for (var i = 0; i < 3; i++) fns.push(() => i);
     console.log(fns.map(f => f()));

     const gns = [];
     for (let j = 0; j < 3; j++) gns.push(() => j);
     console.log(gns.map(f => f()));
  */
  divider(3, 'closure over var vs let');
  const fns = [];
  for (var i = 0; i < 3; i++) fns.push(() => i);
  console.log('var:', fns.map((f) => f()));   // ?

  const gns = [];
  for (let j = 0; j < 3; j++) gns.push(() => j);
  console.log('let:', gns.map((f) => f()));   // ?
  /*
    ANSWER: var: [3, 3, 3]   let: [0, 1, 2]
    WHY: `var i` is ONE shared variable; all 3 arrow functions close
    over the same `i`, which is 3 when they finally run. `let j`
    creates a FRESH j per iteration, so each closure keeps its own
    snapshot. (Files 01 & 04 — the single most-asked output question.)
  */

  /* ──────────────────────────────────────────────────────────────────
     Q4 ⭐: coercion rapid-fire
     ──────────────────────────────────────────────────────────────────
     1 + '2' + 3        '5' - 3        [] + []
     [] + {}            null == 0      null >= 0      NaN === NaN
  */
  divider(4, 'coercion rapid-fire');
  console.log("1 + '2' + 3  →", 1 + '2' + 3);     // ?
  console.log("'5' - 3      →", '5' - 3);          // ?
  console.log('[] + []      →', JSON.stringify([] + []));  // ?
  console.log('[] + {}      →', [] + {});          // ?
  console.log('null == 0    →', null == 0);        // ?
  console.log('null >= 0    →', null >= 0);        // ?
  console.log('NaN === NaN  →', NaN === NaN);      // ?
  /*
    ANSWERS: '123', 2, '' (empty string), '[object Object]',
             false, true, false
    WHY (file 02):
    • + with a string concatenates: 1+'2'→'12', then '12'+3→'123'.
    • − only works on numbers, so '5' becomes 5 → 2.
    • [] + [] → both become '' → '' + '' = ''.
    • {} becomes '[object Object]'.
    • == treats null as equal ONLY to undefined → null == 0 is false.
    • >= is a NUMERIC comparison: null → 0, and 0 >= 0 → true. Evil pair!
    • NaN is the only value not equal to itself. Use Number.isNaN().
  */

  /* ──────────────────────────────────────────────────────────────────
     Q5 ⭐: object references
     ──────────────────────────────────────────────────────────────────
     console.log({} === {});
     const a = { x: 1 };
     const b = a;
     b.x = 99;
     console.log(a.x, a === b);
  */
  divider(5, 'reference equality & shared objects');
  console.log('{} === {}  →', {} === {});          // ?
  const a = { x: 1 };
  const b = a;
  b.x = 99;
  console.log('a.x →', a.x, '| a === b →', a === b); // ?
  /*
    ANSWER: false, then a.x is 99 and a === b is true
    WHY (file 02): each {} literal builds a NEW object — === compares
    addresses, not contents. `b = a` copies the ADDRESS (shared Google
    Doc), so editing through b is visible through a.
  */

  /* ──────────────────────────────────────────────────────────────────
     Q6 ⭐: this — detached method & arrow-as-method
     ──────────────────────────────────────────────────────────────────
     const user = {
       name: 'Asha',
       regular() { return this.name; },
       arrow: () => this?.name,
     };
     console.log(user.regular());
     const detached = user.regular;
     detached();                       // strict mode!
     console.log(user.arrow());
  */
  divider(6, 'this: detached & arrow methods');
  const user = {
    name: 'Asha',
    regular() { return this.name; },
    arrow: () => (this ? this.name : this),
  };
  console.log('user.regular() →', user.regular());  // ?
  try {
    const detached = user.regular;
    detached();                                     // ?
  } catch (err) {
    console.log('detached() threw:', err.constructor.name);
  }
  console.log('user.arrow()   →', user.arrow());    // ?
  /*
    ANSWER: 'Asha', then TypeError, then undefined
    WHY (file 05):
    • user.regular() — someone left of the dot → this = user. ✓
    • detached() — no dot, and strict mode makes this undefined →
      reading undefined.name throws TypeError.
    • Arrows have NO own this; they inherit from where they were
      WRITTEN — here the surrounding function (where strict mode makes
      this undefined), NOT `user`. The object's name is invisible.
      Rule: arrows as methods = bug.
  */

  /* ──────────────────────────────────────────────────────────────────
     Q7: shadow hoisting inside a function
     ──────────────────────────────────────────────────────────────────
     var x = 1;
     function test() {
       console.log(x);
       var x = 2;
     }
     test();
  */
  divider(7, 'inner var shadows outer — before its line');
  var x = 1;
  function test() {
    console.log('inside test →', x);   // ?
    var x = 2;
  }
  test();
  /*
    ANSWER: undefined (NOT 1!)
    WHY: hoisting is PER FUNCTION. test() has its own `var x`, hoisted
    to the top of test as undefined. That inner x shadows the outer
    x = 1 for the whole function body — even on lines above `var x = 2`.
  */

  /* ──────────────────────────────────────────────────────────────────
     Q8: array length & array "+"
     ──────────────────────────────────────────────────────────────────
     const arr = [1, 2, 3];
     arr[10] = 11;
     console.log(arr.length);
     console.log([1, 2, 3] + [4, 5]);
  */
  divider(8, 'sparse arrays & array addition');
  const arr = [1, 2, 3];
  arr[10] = 11;
  console.log('arr.length →', arr.length);          // ?
  console.log('[1,2,3] + [4,5] →', [1, 2, 3] + [4, 5]); // ?
  /*
    ANSWER: 11, then the STRING '1,2,34,5'
    WHY:
    • length = highest index + 1; positions 3–9 are empty "holes".
    • + can't add arrays, so both become strings: '1,2,3' + '4,5' —
      note the weird '34' where they glue together. Use concat/spread!
  */

  /* ──────────────────────────────────────────────────────────────────
     Q9: pass by value vs pass by reference
     ──────────────────────────────────────────────────────────────────
     function change(obj, num) {
       obj.x = 99;          // mutate
       num = 42;            // reassign primitive
       obj = { x: -1 };     // reassign object
     }
     const o = { x: 1 };  let n = 1;
     change(o, n);
     console.log(o.x, n);
  */
  divider(9, 'mutation vs reassignment through functions');
  function change(obj, num) {
    obj.x = 99;
    num = 42;
    obj = { x: -1 };
  }
  const o = { x: 1 };
  let n = 1;
  change(o, n);
  console.log('o.x →', o.x, '| n →', n);            // ?
  /*
    ANSWER: o.x is 99, n is still 1
    WHY (file 02): the function gets a COPY of the reference and a COPY
    of the number. Mutating through the reference (obj.x = 99) edits
    the shared object → visible outside. Reassigning the parameter
    (num = 42, obj = {...}) only repoints the LOCAL copy → invisible.
  */

  /* ──────────────────────────────────────────────────────────────────
     Q10: strings are immutable (strict mode surprise!)
     ──────────────────────────────────────────────────────────────────
     let s = 'hello';
     s[0] = 'H';
     console.log(s);
  */
  divider(10, 'mutating a string character');
  try {
    let s = 'hello';
    s[0] = 'H';                                     // ?
    console.log('s →', s);
  } catch (err) {
    console.log('Threw:', err.constructor.name, '— strings are immutable');
  }
  /*
    ANSWER here: TypeError! (In sloppy mode it FAILS SILENTLY and
    prints 'hello'.)
    WHY: primitives are immutable — you can never edit a string in
    place, only build a new one ('H' + s.slice(1)). Strict mode turns
    the silent failure into a loud error. Great trivia to mention.
  */

  /* ──────────────────────────────────────────────────────────────────
     Q11 ⭐⭐: the event-loop classic
     ──────────────────────────────────────────────────────────────────
     console.log('start');
     setTimeout(() => console.log('timeout'), 0);
     Promise.resolve().then(() => console.log('promise'));
     console.log('end');
  */
  divider(11, 'sync vs microtask vs macrotask');
  console.log('start');
  setTimeout(() => console.log('timeout'), 0);
  Promise.resolve().then(() => console.log('promise'));
  console.log('end');
  await sleep(20); // let the timeout finish before the next question
  /*
    ANSWER: start, end, promise, timeout
    WHY (file 08): sync code runs to completion first (start, end).
    Then the event loop drains ALL microtasks (.then → promise) before
    touching a single macrotask (setTimeout → timeout). Even with 0ms,
    a timeout can never beat a ready microtask.
  */

  /* ──────────────────────────────────────────────────────────────────
     Q12 ⭐: await ordering
     ──────────────────────────────────────────────────────────────────
     async function foo() {
       console.log('A');
       await null;
       console.log('B');
     }
     foo();
     console.log('C');
  */
  divider(12, 'what await actually pauses');
  async function foo() {
    console.log('A');
    await null;
    console.log('B');
  }
  foo();
  console.log('C');
  await sleep(0);
  /*
    ANSWER: A, C, B
    WHY (file 10): an async function runs SYNCHRONOUSLY until the first
    await — so 'A' prints immediately. `await` pauses only foo and
    schedules the rest ('B') as a microtask, returning control to the
    caller → 'C' prints. Then the microtask runs → 'B'.
  */

  /* ──────────────────────────────────────────────────────────────────
     Q13: the promise executor is synchronous
     ──────────────────────────────────────────────────────────────────
     console.log('1');
     const p = new Promise((resolve) => {
       console.log('2');
       resolve('4');
     });
     console.log('3');
     p.then(v => console.log(v));
  */
  divider(13, 'new Promise runs its body NOW');
  console.log('1');
  const p = new Promise((resolve) => {
    console.log('2');
    resolve('4');
  });
  console.log('3');
  p.then((v) => console.log(v));
  await sleep(0);
  /*
    ANSWER: 1, 2, 3, 4
    WHY (file 09): the executor function you pass to new Promise runs
    IMMEDIATELY and synchronously → '2' prints between '1' and '3'.
    Only the .then callback is deferred (microtask) → '4' last.
  */

  /* ═════════════════════════════════════════════════════════════════
     SCORE YOURSELF
     ═════════════════════════════════════════════════════════════════
     11–13 correct → interview-ready on fundamentals. 
      7–10 correct → re-read the files referenced in the WHYs you missed.
       < 7 correct → restart at file 01; the foundations will fix these.

     ───────────────────────────────────────────────────────────────
     30-SECOND INTERVIEW SUMMARY (the meta-skill)
     "When predicting output I run a mental checklist: first hoisting —
     vars become undefined, lets throw in the TDZ, declarations hoist
     fully. Then references — objects share, primitives copy. Then
     `this` — who's left of the dot, arrows inherit. Then coercion —
     + favors strings, comparisons favor numbers. Finally the event
     loop — sync first, all microtasks, then one macrotask. Walking
     that order out loud catches almost every trick."
     ───────────────────────────────────────────────────────────────
     NEXT FILE → 16-es6-features.js (the modern-syntax finale!)
  */
}

main();
