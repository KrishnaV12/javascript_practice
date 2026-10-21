/*
═══════════════════════════════════════════════════════════════════
  TOPIC 05: THE `this` KEYWORD  (+ call, apply, bind)
  Run this file:  node topics/05-this-keyword.js
═══════════════════════════════════════════════════════════════════

WHY THIS MATTERS IN INTERVIEWS
  `this` confuses everyone at first because it's NOT like other
  languages. The trick: `this` is decided by HOW a function is CALLED,
  not where it is written. Learn the 4 rules below and every `this`
  question becomes a simple pattern-match.

THE GOLDEN QUESTION: "What is to the LEFT of the dot at call time?"

THE 4 BINDING RULES (check them in this priority order):

  RULE 4 (highest): `new` binding
     new Foo()        → this = the brand-new object being constructed

  RULE 3: EXPLICIT binding
     fn.call(obj)     → this = obj   (args passed individually)
     fn.apply(obj)    → this = obj   (args passed as an array)
     fn.bind(obj)     → returns a COPY of fn with this locked to obj

  RULE 2: IMPLICIT binding
     obj.fn()         → this = obj   (the thing left of the dot)

  RULE 1 (default): standalone call
     fn()             → this = undefined in strict mode,
                        globalThis (window) in sloppy mode

  ⭐ THE ARROW EXCEPTION: arrow functions IGNORE all 4 rules. They have
  NO `this` of their own — they inherit it from the scope where they
  were WRITTEN (lexical this), and call/apply/bind can't change it.
*/

"use strict";
console.log("===== TOPIC 05: THE `this` KEYWORD =====\n");

/* ──────────────────────────────────────────────────────────────────
   STEP 1: Implicit binding — left of the dot
   ────────────────────────────────────────────────────────────────── */

const user = {
  name: "Asha",
  greet() {
    console.log("STEP 1 → hi, I am", this.name);
  },
};
user.greet(); // "Asha"  → left of dot = user → this = user

const nested = { name: "outer", child: { name: "inner", who() { return this.name; } } };
console.log("STEP 1 → nested:", nested.child.who()); // "inner" — only the NEAREST dot matters

/* ──────────────────────────────────────────────────────────────────
   STEP 2: ⭐ LOSING `this` — the #1 trap in interviews and real code
   ────────────────────────────────────────────────────────────────── */

const greetRef = user.greet;   // we detached the function from its object
try {
  greetRef();                  // plain call → rule 1 → this = undefined (strict)
} catch (err) {
  console.log("STEP 2 → detached call crashed:", err.constructor.name);
}

/*
  The SAME loss happens with callbacks — you pass obj.method somewhere
  and it gets called as a plain function:

     setTimeout(user.greet, 0);          // ❌ this is lost
     button.addEventListener('click', user.greet); // ❌ same problem

  FIXES (know all three):
     setTimeout(() => user.greet(), 0);  // ✅ wrapper keeps the dot
     setTimeout(user.greet.bind(user), 0); // ✅ bind locks this
     // ✅ or define greet as an arrow that closes over what you need
*/
setTimeout(user.greet.bind(user), 20); // prints "hi, I am Asha" shortly

/* ──────────────────────────────────────────────────────────────────
   STEP 3: Explicit binding — call, apply, bind
   ────────────────────────────────────────────────────────────────── */

function introduce(city, country) {
  console.log(`   I'm ${this.name} from ${city}, ${country}`);
}
const p1 = { name: "Ravi" };
const p2 = { name: "Meera" };

console.log("\nSTEP 3 → call/apply/bind:");
introduce.call(p1, "Pune", "India");          // args one by one  (C = commas)
introduce.apply(p2, ["Delhi", "India"]);      // args as Array    (A = array)

const boundIntro = introduce.bind(p1, "Goa"); // bind = returns new fn, runs LATER
boundIntro("India");                          // remaining args at call time

/*
  MEMORY HOOK:  call → Commas,  apply → Array,  bind → Bring it later.
  bind also enables PARTIAL APPLICATION (pre-filling args) — note "Goa"
  was locked in above. We hand-build bind ourselves in file 13.
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 4: `new` binding (rule 4 — beats everything except arrows)
   ────────────────────────────────────────────────────────────────── */

function Person(name) {
  // `new` does 4 things:
  // 1. creates an empty object {}
  // 2. links it to Person.prototype          (file 06)
  // 3. runs Person with this = that object
  // 4. returns the object (unless you return another object explicitly)
  this.name = name;
}
const ria = new Person("Ria");
console.log("\nSTEP 4 → new binding:", ria.name); // "Ria"

/* ──────────────────────────────────────────────────────────────────
   STEP 5: ⭐ Arrow functions and `this` — the most-asked output pair
   ────────────────────────────────────────────────────────────────── */

const team = {
  name: "Falcons",
  regular() { return this.name; },
  arrow: () => { 
    // written at the TOP level of this file → inherits top-level `this`
    // (module scope in Node, where this.name is undefined)
    return this?.name;
  },
};
console.log("\nSTEP 5 → regular():", team.regular()); // "Falcons" (left of dot)
console.log("STEP 5 → arrow():  ", team.arrow());     // undefined ⚠️

/*
  RULE OF THUMB:
  ❌ Don't use arrows as OBJECT METHODS (they ignore the object).
  ✅ DO use arrows for CALLBACKS INSIDE methods (to inherit the method's this):
*/
const stopwatch = {
  ticks: 0,
  start() {
    const id = setInterval(() => {     // arrow inherits `this` from start()
      this.ticks++;
      if (this.ticks === 2) {
        console.log("STEP 5 → arrow callback kept this.ticks =", this.ticks);
        clearInterval(id);
      }
    }, 30);
  },
};
stopwatch.start();

/* ──────────────────────────────────────────────────────────────────
   STEP 6: Output questions — practice the pattern-match
   ────────────────────────────────────────────────────────────────── */

// Q1: borrowed method
const a = { name: "A", say() { return this.name; } };
const b = { name: "B" };
b.say = a.say;
console.log("\nSTEP 6 → Q1:", b.say()); // "B" — this is decided AT CALL TIME, left of dot is b

// Q2: bind beats later dots
const c = { name: "C" };
const boundSay = a.say.bind(c);
const d = { name: "D", say: boundSay };
console.log("STEP 6 → Q2:", d.say()); // "C" — a bound function can't be re-bound by a dot

// Q3: double bind?
const rebound = boundSay.bind({ name: "Z" });
console.log("STEP 6 → Q3:", rebound()); // "C" — first bind wins, forever

// Q4: this inside a regular callback inside a method
const gym = {
  name: "IronHouse",
  members: ["Tia", "Raj"],
  // ✅ classic fix shown: arrow callback inherits this from printAll
  printAll() {
    this.members.forEach((m) => console.log(`STEP 6 → Q4: ${m} @ ${this.name}`));
  },
};
gym.printAll(); // works. With function(m){...} instead, this.name would crash/undefined.

/*
  ───────────────────────────────────────────────────────────────────
  30-SECOND INTERVIEW SUMMARY
  "`this` is set at CALL time by four rules, in priority: new binding,
  explicit binding with call/apply/bind, implicit binding (object left
  of the dot), and default binding (undefined in strict mode). Arrow
  functions are the exception — they have no own `this` and inherit it
  lexically, which is why they're perfect for callbacks inside methods
  but wrong as object methods. The classic bug is losing `this` when a
  method is passed as a callback; I fix it with bind or an arrow wrapper."
  ───────────────────────────────────────────────────────────────────
  NEXT FILE → 06-objects-and-prototypes.js
*/
