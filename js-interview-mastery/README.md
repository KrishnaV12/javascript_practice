# 🧠 JS Interview Mastery

A complete, hands-on JavaScript interview preparation course — **16 standalone files**, each covering one core topic with elaborate theory, runnable step-by-step demos, the classic interview questions on that topic, and a memorizable *30-second interview answer*.

Written so a junior developer can follow every line, deep enough that a senior developer can sharpen the exact answers interviewers probe for.

## ✅ Requirements

- [Node.js](https://nodejs.org) (any recent version — v18+ recommended)
- A terminal and your favorite editor. That's it. No npm install, no dependencies.

## 🚀 How to use it

Every topic is **one self-contained .js file** that runs directly:

```bash
node topics/01-variables-and-hoisting.js
```

The workflow that actually builds mastery:

1. **Read the theory block** at the top of the file (the WHY + the analogy).
2. **Predict** what each `console.log` will print *before* running.
3. **Run the file** and compare against your predictions.
4. **Read the traced explanations** for anything you missed.
5. **Say the 30-second summary out loud** — that's your interview answer.
6. Open `index.html` in a browser to track which topics you've completed.

## 📚 The 16 topics

| # | File | What you'll master |
|---|------|--------------------|
| 01 | `01-variables-and-hoisting.js` | var/let/const, hoisting's two phases, TDZ, the loop question |
| 02 | `02-data-types-and-coercion.js` | primitives vs references, ==/===, typeof quirks, `[] + {}` traps |
| 03 | `03-functions-deep-dive.js` | declarations vs expressions vs arrows, default/rest params, HOFs |
| 04 | `04-scope-and-closures.js` | lexical scope, closures ("the backpack"), private state, module pattern |
| 05 | `05-this-keyword.js` | the 4 binding rules, call/apply/bind, arrow `this`, losing `this` |
| 06 | `06-objects-and-prototypes.js` | prototype chain, classes, inheritance, instanceof, shadowing |
| 07 | `07-array-methods.js` | map/filter/reduce mastery, mutating vs non-mutating, sort gotcha |
| 08 | `08-event-loop.js` | call stack, microtasks vs macrotasks, output-ordering questions |
| 09 | `09-promises.js` | states, chaining rules, error bubbling, all/allSettled/race/any |
| 10 | `10-async-await.js` | the 2 rules, error handling, sequential vs parallel, loop traps |
| 11 | `11-debounce-and-throttle.js` | build both from scratch, line by line, with variations |
| 12 | `12-currying-and-composition.js` | curry, infinite currying, partial application, compose/pipe |
| 13 | `13-polyfills.js` | write myMap, myFilter, myReduce, myCall/Apply/Bind, Promise.all |
| 14 | `14-logic-building-problems.js` | flatten, deepClone, memoize, twoSum + the patterns behind them |
| 15 | `15-output-based-questions.js` | 13 tricky "what does this print?" questions with full answers |
| 16 | `16-es6-features.js` | destructuring, spread/rest, ?. and ??, Map/Set, modules |

## 🗓️ Study plans

**16-day plan (thorough)** — one file per day, ~45–60 minutes:
read → predict → run → re-explain out loud. On days 8 and 16, re-run file 15 cold as a self-test.

**7-day plan (crunch mode)** — for an interview next week:

| Day | Files | Theme |
|-----|-------|-------|
| 1 | 01, 02 | Foundations: hoisting + types |
| 2 | 03, 04 | Functions + closures |
| 3 | 05, 06 | `this` + prototypes |
| 4 | 07, 08 | Arrays + event loop |
| 5 | 09, 10 | Promises + async/await |
| 6 | 11, 12, 13 | The "build it live" round |
| 7 | 14, 15, 16 | Logic problems + mock test |

**Night-before refresher:** re-read only the *30-SECOND INTERVIEW SUMMARY* block at the bottom of each file — all 16 take about 10 minutes total.

## 🎯 Interview tips baked into these files

- **Name the pattern before coding.** "I'll use a hashmap for O(n) lookup" earns more points than silent perfect code (file 14 lists the patterns).
- **Trace out loud** on output questions: hoisting → references → `this` → coercion → event loop, in that order (file 15's checklist).
- **Always mention the gotcha**: spread is shallow, `sort` coerces to strings, `||` swallows `0`, arrows can't be methods. Gotchas are senior signals.
- **Edge cases close the deal**: empty array, `null` input, single element. Say them even if you don't code them.
- ⭐ markers throughout the files = the questions asked most often. If you're short on time, hit those first.

## 📂 Structure

```
js-interview-mastery/
├── index.html        ← progress dashboard (open in any browser)
├── README.md         ← you are here
└── topics/
    ├── 01-variables-and-hoisting.js
    ├── ...
    └── 16-es6-features.js
```

Good luck — go get that offer! 🚀
