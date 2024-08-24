// this keyword

const person = {
  name: "rita",
  city: "mumbai",
  greet: function () {
    return `${this.name} is  living in ${this.city}`;
  },
  code: function () {
    return this.name + "currently coding";
  },
};

console.log(person.name); // "robin"
console.log(person.greet()); // 'hi there'
console.log(person.code());

// another example
// increment the value of count by 1
const counter = {
  count: 0,
  up: function () {
    this.count = this.count + 1;
    return this.count;
  },
  down: function () {
    this.count = this.count - 1;
    return this.count;
  },
};

console.log(counter.up());
console.log(counter.down());

const calculator = {
  result: 0,
  add: function (n = 0) {
    this.result = this.result + n;
    return this.result;
  },
  sub: function (n = 0) {
    this.result = this.result - n;
    return this.result;
  },
};

console.log(calculator.add(3));
console.log(calculator.sub(2));

//object exercises

// convert an array of string into object
function buildObject(arr) {
  let result = {};
  //   for (let i = 0; i < arr.length; i++) {
  //     result[arr[i]] = arr[i].length;
  //   }
  arr.forEach((ele) => {
    result[ele] = ele.length;
  });

  return result;
}

console.log(buildObj(["yamaha", "honda", "suzuki"]));

// write a code to count the occourance of the vowel in the given string

function vowelCount(str) {
  const result = { a: 0, e: 0, i: 0, o: 0, u: 0 };
  str = str.toLowerCase();
  for (const char of str) {
    if (result.hasOwnProperty(car)) {
      result[char] = result[char] + 1;
    }
  }
  return result;
}

console.log(vowelCount("vishwakarma"));

function frequency(str) {
  result = {};
  for (const char in str) {
    if (result.hasOwnProperty(char)) {
      result[char] += 1;
    } else {
      result[char] = 1;
    }
  }
  return result;
}

console.log(frequency("vishwakarma"));
