// arrow function()
const multuply = (a, b) => {
  return a * b;
};

console.log(multiply(10, 20));

//one line statement

const square = (n) => n * n;
console.log(square(5));

//this
// fat arrow function cannot be used in this while making a method
// in fat arrow fuction this always refer to global window

const arrowFun = () => {
  let name = "krishna";
  console.log(this.name); //  undefine because it will refer to outer scope value
};

function f3() {
  const person = {
    name: "krishna",
    age: 27,
    details: () => {
      return this.name;
    },
  };
  person.details(); // undefine
}

f3();
