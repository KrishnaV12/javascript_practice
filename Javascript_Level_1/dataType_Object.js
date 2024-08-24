// collection of data with names properties
// value store with a key associated with
// can aslo hold function of the value

// objects are unorderd , string index , collection of values

// when order matters == array
// when label matters == object

const person = {
  name: "krishna",
  lastName: "vish",
  age: 26,
};

//calling the values
console.log(person.name); // krishna
console.log(person["name"]); // krishna
console.log(person.city); // undefined
console.log(typeof person); //object
console.log(Array.isArray(person)); // false

// different type of operation on objects CURD
// read operation
console.log(person.name); // krishna

// add properties
person.gender = "male";
person["height"] = "5.8ft";

//update the value
person.age = 25;

//delete the value
delete person.height;

// object inbuit methods
console.log(Object.keys(person)); //["name" , "lastName" , "age"]
console.log(Object.values(person)); // ["krishna" , "vish" , "25"]

console.log(Object.keys(person).includes("name")); // true
console.log(Object.keys(person).includes("car")); // false

// object methods
const person2 = {
  name: "krishna",
  lastName: "vish",
  age: 26,
};
Object.freeze(person2); // prevent modification , delete & add
Object.isFrozen(person2); // true
Object.seal(person2); // only update allow
Object.assign(); // use to copy the value from one object to another

const item = {};
Object.assign(item, person2); // same key values will overwrite
console.log(item);

Object.entries(); // return nested array of key value pair
const entry = Object.entries(person2);
console.log(entry); // [['name':"krishna"] , ['lastName':"vish"] ,['age':25] ]

// object destructuring
const man = {
  name: "krishna",
  lastName: "vish",
  age: 26,
};

var firstName = man.name;
var lastName = man.lastName;
console.log(firstName, lastName);

//ES6 approch
const { name, lastName } = man;

// Object Loops
//for in
for (const key in man) {
  console.log(key, man[key]);
}
