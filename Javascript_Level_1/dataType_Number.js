const speed = 90,
  temp = 28.7;
// integer & float treated as number
// number is premitive we can not directly invoke methods on them
console.log(typeof speed); // number
console.log(typeof temp); // number

// Math Object
console.log(Math.round(12.3)); //12
console.log(Math.round(19.8)); //20
console.log(Math.round(temp)); //29

console.log(Math.ceil(12.3)); //13
console.log(Math.ceil(20.8)); //21

console.log(Math.floor(12.3)); //12
console.log(Math.floor(20.8)); //20

console.log(Math.abs(-123)); //123
console.log(Math.pow(2, 4)); //16
console.log(Math.sqrt(64)); //8
console.log(Math.min(12, 21, 53, 6)); //6
console.log(Math.max(12, 21, 53, 6)); //53

// + operator
console.log("hello" + "world");
console.log(10 + 15); //25
console.log("10" + 15); //"1025"
console.log(15 + "10"); // "1510"
console.log(10 + 5 + "1"); // "151"
console.log("2" + 5 + 10); // '215'
console.log('2' + (10 + 5)); // '215' give priority to brackets



// type conversion & coversion
// str -> num

console.log(typeof '14'); // string
console.log(parseInt('14')); //14
console.log(typeof parseInt('14')); // Number
console.log(parseInt(25.8)); //25 its trancate loss of information happen
console.log(parsefloat('25.8')); // 25.8

// what is input is given by user & i dont now if its float or number
console.log(parseFloat('14')); //14
console.log(Number('25.8')); //25.8 // Number constructor function
console.log(parseInt("10") + 15); // 25


// num -> string
const n =10
console.log(n.toString()); // '10'
console.log(String(10)); // '10'
console.log(String(22.5)); // '22.5'
console.log('' + 10); // '10' hack











