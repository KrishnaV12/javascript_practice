//how variables work in jsvascript
// varible holding primitive value --how its work

let a = 10;
let b = 20;

console.log("a", a); //10
console.log("b", b); //20

// copy value of into c
let c = a;
console.log("a", a); // 10
console.log("c", c); // 10

a = 125;

console.log("a", a); // 125
console.log("c", c); // 10

// Note :  now anytime you changes the value of premetive varible it will not affect the second one.
// every variable is independent

/*How Objects Work */
//shallow copy exp.
let x = [10];
let y = ["yamaha"];
console.log("x", x); // [10]
console.log("y", y); // ['yamaha]

//copy values of x into z
let z = x;
console.log("x", x); // [10]
console.log("z", z); // [10]

x.push(20);
console.log("x", x); // [10 , 20]
console.log("z", z); // [10 , 20]

z.push(30);
console.log("x", x); // [10 , 20 ,30]
console.log("z", z); // [10 , 20 ,30]

/** two diffrent type of copy of object  */
//shallow copy = a shallow compy means the values are still connected to the original values
//deep copy = all the values of a variable is copy to new variable and dissconected from the original variable [changind in copy value does not effect the original values]

////deep copy methods Array**
// Array Slice Method
// Array Concat Method
// Spread Operator
// JSON.stringify() + JSON.parse() ==> for very complex array

// deep copy example Array ***
let i = [10];
let j = i;

console.log("i", i); // [10]
console.log("j", j); // [10]

//method 1
let k = i.slice(0); // return new array detached
i.push(20);
console.log("i", i); // [10 , 20]
console.log("k", k); // [10]

// method 2
let l = [].concat(i);

// method 3
let m = [...a]; // return new array

/**Deep copy method Object */
// Object.assign()
// Spread operator
// JSON.stringify() + JSON.parse() ==> for very complex array

const bikes = {
  name: "yamaha",
};

// method 1
const otherbikes = Object.assign({}, bikes); // return new deattached object
bikes.name = "honda";
console.log(bikes); // {name:honda}
console.log(otherbikes); // {name:yamaha}

// method 2
const newBikes = { ...bikes }; // return new objects

//*** Truthy & falsy Value */

// truthy Values ; any number except 0 , any string except "" , [] , {}
// Falsy Values : 0 , undefine , "" , null , NaN , false

//** where we used */
//Lopops & Condition statements

//falsey value
console.log(0, Boolean(0)); //false
console.log(undefined, Boolean(undefined)); // false
console.log(null, Boolean(null)); // false
console.log(NaN, Boolean(NaN)); // false
console.log("", Boolean("")); // false
console.log(false, Boolean(false)); // false

//truthy value
console.log(1, Boolean(1)); // true
console.log(-1, Boolean(-1)); // true
console.log("krishna", Boolean("krishna")); // true
console.log([], Boolean([])); // true
console.log({}, Boolean({})); // true
console.log(true, Boolean(true)); // true

//condition or loop
if (0) {
  console.log("truthy value");
} else {
  console.log("faly value");
}




