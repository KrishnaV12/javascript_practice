// array are order , integer indexed , collection of values
// non-premitive
const cars = [];
const bike = new Array();
const car = ["madza", "honda", "suzuki", "thar"];
const bikes = new Array("honda", "suzuki", "bmw", "yamaha");

console.log(car[0]); // madza
console.log(car[10]); // undefine
console.log(typeof car); // object

//methods

// it will actually change the value
car.push("toyota"); // it will return new length of the array as well
console.log(car);

// remove from the end of the array
console.log(car.pop()); // it will return removed element

console.log(car);

// add new element in the begining of the array
car.unshift("ford"); // it will return new length of the array
console.log(car);

// remove from the beginig of the array
car.shift();

// splice
car.splice(2, 1, "ninja"); //["madza", "honda", "thar" , "ninja"]

const number = [10, 20];
number.push(20, 48, 78); // you can push multiple value

number.pop(); //  remove last one value only

number.unshift(1, 3, 2); // add multiple value to the begening of the array

// reverse the array
console.log(number.reverse()); // effect the original array

// sort an array
console.log(number.sort()); // change the original order of the array

const racers = ["max", "niki", "alonso"];
console.log(racers.indexOf("max")); //1
console.log(racers.indexOf("mark")); // -1
console.log(racers.lastIndexOf("max")); //2
console.log(racers.includes("max")); //true
console.log(racers.includes("rossi")); //false

//arr -> str

console.log(racers.join(".")); // "max.niki.alonso"

const set1 = [10, 20];
const set2 = [30, 60];
console.log(set1 + set2); // '10203036'

const result = set1.concat(set2); //
console.log(result); // return new array with new value [10 ,20 ,30 ,60]

// loop to return large values
for (let i = 0; i < racers.length; i++) {
  console.log(racers[i]);
}

// mixed array operations
const mix = [10, "ford", true, [10], { name: "yamaha" }, undefined];
console.log(mix.length); // 6

// array destructering

var num = [10, 20, 43, 34, 45, 23, 54];
var v1 = number[0];
var v2 = number[2];
console.log(v1, v2); // 10 20

// es-6 way
const bikers = ["honda", "suzuki", "bmw", "yamaha"];
const [b1, b2] = bikers;
console.log(b1, b2); // honda suzuki

const [, , , u1] = bikers; // yamaha

