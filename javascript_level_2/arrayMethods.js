// array methods

// 1. forEach()  iterate over an Array same as for loops
const cars = ["bmw", "thar", "regera", "regera"];

// can not call on string
cars.forEach((ele, i, arr) => {
  console.log(ele.toUpperCase(), i);
});

//2. find()  find an element based on condition otherwise it will retun undefine

const number = [10, 123, 4, 335, 5, 62, 4];
const result = number.find((ele) => {
  return ele > 25;
});

console.log(result);

const users = [
  { id: 1, name: "japan" },
  { id: 2, name: "america" },
];

const data = users.find((ele) => {
  return ele.id === 2;
});
console.log(data);

// 3. filter()  get all the element based on the condition

const resultfilter = number.filter((ele) => {
  return ele % 2 == 0;
});

console.log(resultfilter); // it will return empty array if nothing is found

// filter Excercise

const menu = [
  { id: 1, name: "roti dahi", price: 10, isAvilable: true },
  { id: 2, name: "paratha", price: 40, isAvilable: false },
  { id: 3, name: "sabji", price: 50, isAvilable: true },
  { id: 4, name: "dahi roti", price: 20, isAvilable: true },
];

// find all the items which is avilabe

const avilableItems = menu.filter((ele) => {
  return ele.isAvilable === true;
});

console.log(avilableItems);

// find all the items whose price is between 20 - 50
const priceRange = menu.filter((ele) => {
  return ele.price >= 20 && ele.price <= 50;
});

console.log(priceRange);

// find an item whose id is 3

const finditem = menu.find((ele) => {
  return ele.id === 3;
});
console.log(finditem);

// find all the items which have dahi in it

const findDahi = menu.filter((ele) => {
  return ele.name.includes("dahi");
});
console.log(findDahi);

// 3. map()  method return new array and let you perform operation on every element
const carBrands = ["bmw", "thar", "regera", "mcLaren"];

const upperCaseVal = carBrands.map((ele, i) => {
  return ele.toUpperCase();
});
console.log(carBrands);

let numberExp1 = [32.4, 232, 34, 32, 423, 4, 325, 6, 4];
const result2 = numberExp1.map((ele) => {
  if (ele % 2 === 0) {
    return ele + 3;
  } else {
    return ele;
  }
});
console.log(result2); // return undefine if does not found the elemnt or condition match

// return array of object based on array of string
const fruits = ["apple", "mango", "kiwi"];

const result3 = fruits.map((ele, i) => {
  return {
    [ele]: ele.length,
  };
});
console.log(fruits);

// 4. every() retun true if all the element of array pass the condition
const price = [234, 32, 424, 543, 65, 7, 65, 678];
const result4 = price.every((ele) => {
  return ele > 100;
});

console.log(result4); // false

// 5. some return true if at least one condition matched
const result5 = price.some((ele) => {
  return ele > 100;
});

console.log(result5); // true


