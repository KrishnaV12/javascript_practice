//reusable code block when its call or invoke & call its as maany times its need
// allow to divide code into smaller parts
// reusable

function functionName(params) {
  functionBody;
  return value;
}

functionName(arguments); // invoking a fuction with a passing value or calling a function

function greet(msg) {
  return (msg = `hi ${msg}`);
}

console.log(greet("baby"));
console.log(greet("nigga"));

// passing default value as argument
function greet(msg = "wake up") {
  return (msg = `hi ${msg}`);
}

//function expression  - a fuction which can be store in an variable
function declaration() {
  //name is requred
  //loads before any code
  //get hoisted
}

function expression() {
  //name can be omitted
  //loads only when the interpreter reaches the line of code
  //doesnt't get hoisted
}

const greet = function (msg = "wake up") {
  return (msg = `hi ${msg}`);
};

greet("morning");

//arguments
function add() {
  console.log(arguments);
}

add(10, 20, 30);
