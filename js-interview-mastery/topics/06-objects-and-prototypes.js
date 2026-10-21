/*
═══════════════════════════════════════════════════════════════════
  TOPIC 06: OBJECTS, PROTOTYPES & INHERITANCE
  Run this file:  node topics/06-objects-and-prototypes.js
═══════════════════════════════════════════════════════════════════

WHY THIS MATTERS IN INTERVIEWS
  "Explain prototypal inheritance" is a guaranteed senior-round
  question. ES6 `class` is just nicer syntax over the prototype system,
  so understanding prototypes means you understand classes for free.

THE BIG IDEA — THE PROTOTYPE CHAIN
  Every object has a hidden internal link to another object called its
  PROTOTYPE. When you read obj.someProp:

    1. Does obj ITSELF have someProp?            → use it
    2. No? Look at obj's prototype.              → use it if found
    3. No? Look at the prototype's prototype...  → keep climbing
    4. Reached null (top of chain)?              → undefined

  ANALOGY: asking your family for a stapler. You check your desk, then
  your parent's desk, then grandparent's… The first desk that has one
  wins. If nobody has it → you get nothing (undefined).

TWO WORDS PEOPLE CONFUSE (clear this up and you'll shine):

  • `prototype`  → a property that exists ONLY on FUNCTIONS.
                   It's the object that will become the prototype of
                   instances created with `new ThatFunction()`.
                   "The blueprint shelf for future children."

  • `__proto__`  → the actual hidden link on EVERY object pointing to
                   its prototype. (Modern access: Object.getPrototypeOf)
                   "The wire from a child up to its parent."

  Relationship:   const r = new Person();
                  r.__proto__ === Person.prototype   // true
*/

"use strict";
console.log("===== TOPIC 06: OBJECTS & PROTOTYPES =====\n");

/* ──────────────────────────────────────────────────────────────────
   STEP 1: See the chain with a plain object
   ────────────────────────────────────────────────────────────────── */

const animal = { eats: true, sleep() { return "zzz"; } };
const rabbit = Object.create(animal);   // rabbit's prototype = animal
rabbit.hops = true;

console.log("STEP 1 → rabbit.hops :", rabbit.hops);  // own property
console.log("STEP 1 → rabbit.eats :", rabbit.eats);  // found on animal (1 hop up)
console.log("STEP 1 → rabbit.sleep():", rabbit.sleep()); // inherited method
console.log("STEP 1 → chain check:", Object.getPrototypeOf(rabbit) === animal); // true

// Distinguish OWN vs INHERITED — interviewers ask this:
console.log("STEP 1 → own 'hops'?", Object.hasOwn(rabbit, "hops")); // true
console.log("STEP 1 → own 'eats'?", Object.hasOwn(rabbit, "eats")); // false (inherited)
// note: `'eats' in rabbit` → true, because `in` checks the WHOLE chain.

/* ──────────────────────────────────────────────────────────────────
   STEP 2: Constructor functions + new (the pre-2015 way — still asked)
   ────────────────────────────────────────────────────────────────── */

function Person(name) {
  this.name = name;                       // OWN property: unique per instance
}
Person.prototype.greet = function () {    // SHARED: one copy for all instances
  return `Hi, I'm ${this.name}`;
};

const asha = new Person("Asha");
const ravi = new Person("Ravi");
console.log("\nSTEP 2 →", asha.greet(), "|", ravi.greet());
console.log("STEP 2 → methods shared?", asha.greet === ravi.greet); // true ✅ memory-efficient

/*
  WHY put methods on the prototype instead of inside the constructor?
  Inside the constructor → EVERY instance gets its OWN copy of the
  function (wasteful for 10,000 objects). On the prototype → ONE copy,
  found via the chain. This is the textbook "why prototypes" answer.
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 3: ES6 class — same engine, friendlier syntax
   ────────────────────────────────────────────────────────────────── */

class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} makes a sound`; }     // goes on Animal.prototype
  static info() { return "Animals are living beings"; } // on the CLASS itself
}

class Dog extends Animal {                 // sets up the prototype chain for us
  constructor(name, breed) {
    super(name);                           // MUST call super before using `this`
    this.breed = breed;
  }
  speak() {                                // OVERRIDE (shadows parent's speak)
    return `${super.speak()} — specifically: Woof!`;   // super.* = parent version
  }
}

const bruno = new Dog("Bruno", "Labrador");
console.log("\nSTEP 3 →", bruno.speak());
console.log("STEP 3 → static:", Animal.info());        // called on class, not instance
console.log("STEP 3 → chain: bruno → Dog.prototype → Animal.prototype → Object.prototype → null");
console.log("STEP 3 → instanceof Dog:", bruno instanceof Dog,
            "| instanceof Animal:", bruno instanceof Animal); // true true

/*
  QUICK-FIRE CLASS FACTS:
  • `class` is mostly syntactic sugar over constructor functions + prototypes.
  • Real additions: class bodies run in strict mode, classes are NOT hoisted
    usable (TDZ), must be called with `new`, support #private fields.
  • `instanceof X` answers: "does X.prototype appear ANYWHERE in this
    object's prototype chain?"
  • static members live on the class itself: Dog.info ✅, bruno.info ❌.
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 4: Property SHADOWING (classic output question)
   ────────────────────────────────────────────────────────────────── */

const parent = { role: "parent" };
const child = Object.create(parent);
console.log("\nSTEP 4 → before:", child.role);  // "parent" (inherited)
child.role = "child";                            // WRITES create OWN property —
console.log("STEP 4 → after :", child.role);    // "child"  (own, shadows parent)
console.log("STEP 4 → parent untouched:", parent.role); // "parent" ✅
delete child.role;
console.log("STEP 4 → after delete:", child.role); // "parent" again — shadow removed!

/*
  RULE: READS climb the chain. WRITES go on the object itself.
*/

/* ──────────────────────────────────────────────────────────────────
   STEP 5: ⭐ Interview build — implement your own instanceof
   ────────────────────────────────────────────────────────────────── */

function myInstanceOf(obj, Constructor) {
  if (obj === null || typeof obj !== "object") return false;
  let proto = Object.getPrototypeOf(obj);
  while (proto !== null) {                       // walk the chain manually
    if (proto === Constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
console.log("\nSTEP 5 → myInstanceOf(bruno, Animal):", myInstanceOf(bruno, Animal)); // true
console.log("STEP 5 → myInstanceOf([], Person):    ", myInstanceOf([], Person));     // false

/* ──────────────────────────────────────────────────────────────────
   STEP 6: Useful object utilities (rapid-fire)
   ────────────────────────────────────────────────────────────────── */

const cfg = { theme: "dark", lang: "en" };
console.log("\nSTEP 6 → keys/values/entries:",
  Object.keys(cfg), Object.values(cfg), Object.entries(cfg));

const frozen = Object.freeze({ version: 1 });
// frozen.version = 2;            // silently ignored (TypeError in strict assignments)
console.log("STEP 6 → frozen stays:", frozen.version, "| isFrozen:", Object.isFrozen(frozen));
/*
  freeze   → can't add/remove/change properties (SHALLOW — nested objects still mutable)
  seal     → can't add/remove, CAN change existing values
  Object.create(null) → object with NO prototype at all (pure dictionary,
                        no inherited toString — interviewers like this detail)
*/

/*
  ───────────────────────────────────────────────────────────────────
  30-SECOND INTERVIEW SUMMARY
  "Every object has a hidden link to a prototype; property reads walk
  up this chain until found or null. A function's `prototype` property
  becomes the prototype of instances created with `new`, which is why
  shared methods go there — one copy for all instances. ES6 classes are
  syntax over this same mechanism: extends wires the chain, super calls
  the parent. Writes don't climb the chain — they create own properties
  that shadow inherited ones. instanceof just checks whether a
  constructor's prototype appears anywhere in the chain."
  ───────────────────────────────────────────────────────────────────
  NEXT FILE → 07-array-methods.js
*/
