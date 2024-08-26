// iifi

(function () {
  const name = "krishna";
  console.log("hello" + name);
})();

// pure function
//consistency , predictability
//characteristics
/*
1. reurn the same result given the same arguments
2. execution dosent depend on the state of the application
3. doesnt't modify the variable outside of their scope
4. predictability
5. make function testable
 */

const fruits = ["apple", "banana", "lamborgini"];
console.log(fruits.slice(0, 1));

//Callback Function
//a callback function is a function passes into another functionas an argument which is invoke inside the outer function to complete some kind of action
function even() {
  console.log("even");
}
function odd() {
  console.log("odd");
}

function calculate(num, odd, even) {
  if (num % 2 === 0) {
    even();
  } else {
    odd();
  }
}

calculate(2, even, odd);

// HOF higher order functions
const numbers = [10, 15, 20, 25, 30];
number.forEach(function (ele) {
  console.log(ele);
});

//let create our callback function

function myForEach(arr, callback) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i]);
  }
}

myForEach(numbers, function (n) {
  console.log(n);
});

//myFilter
function evenOnly(arr, callback) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const bool = callback(arr[i]);
    if (bool) {
      result.push(arr[i]);
    }
  }
  return result;
}

const result = evenOnly(numbers, function (n) {
  return n % 2 === 0;
});

console.log(result);

//constructor Function

const user1 = {
  name: "krishna",
};
const user2 = {
  name: "krishna",
};

// using constructor functions and the "new" operator to create many object of same type
//conventions: function mane shoud be CAPITAL latters & use new keyword to execute

function User(fName, lName) {
  this.firstName = fName;
  this.lastName = lName;
  this.details = function () {
    return this.firstName + " " + this.lastName;
  };
}

const data1 = new User("krishna", "vishwakarma");
console.log(data1);
console.log(data1.details());
