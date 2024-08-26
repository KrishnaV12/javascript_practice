// call()
// invoke function immediately
// aurgument pass one by one

// SYNTAX : function.call(thisValue , arg1 , arg2)

person = {
  firstName: "krishna",
  lastName: "vishwakarma",
};

function greet(msg) {
  console.log(msg + " " + this.firstName);
}
greet("hi");

greet.call(person, "hi");

//apply()
// invoke the function immediately
// pass aurgument as array//
//SYNTAX : function.apply(thisValue , [arg1 , arg2])

function greet2(msg) {
  console.log(msg + " " + sign + this.firstName);
}
greet2("hi");

greet2.apply(person, ["hi", "mr"]);

//bind()
// return a new function to be invoke seprately
// pass aurguments one by one
// SYNTAX : newFunction = function.bind(thisValue , "h1")
// newFunction()

function greet3(msg) {
    console.log(msg + " " + sign + this.firstName);
  }
  greet3("hi");
  
 const newGreet =  greet3.apply(person, "hi", "mr");
 newGreet()
