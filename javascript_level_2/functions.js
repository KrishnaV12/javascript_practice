// Scope = scope is the accessibility of variables ,functions ,and object in some particular part of your code during runtime.
const str1 = "outside function";
function greet() {
  const str2 = "inside function";
  if (true) {
    const str3 = "inside block";
  }
  console.log(str3); // reference error
}
greet();
console.log(str1); // 'outside function'
console.log(str2); // reference error

//lexical scope

// lexical scope is when function have access to its parent function scope variable and so on
function lexical() {
  const str3 = "inside lexical";
  console.log(str3); // "inside lexical"
  console.log(str1); // "outside function"

  function lexical2() {
    console.log(str3); // "inside lexical"
    console.log(str1); // "outside function"
  }
  lexical2();
}

lexical();

//pass by value

const number = 2;
function changeNumber(number) {
  number += 5;
  console.log(number); //7
}
changeNumber(number);
console.log(number); // 2

// pass by reference ==> the original value also get affected
const city = { name: "krishna", city: "noida" };
function changeCity(person) {
  person.city = "mysore";
  console.log(person); //  { name: "krishna", city: "mysore" };
}
changeCity(person);
console.log(person); // { name: "krishna", city: "mysore" };
