//loops used for
//access element in array
//acess charaters in string
// acess properties in object

// 1. for Loop (array & string)
// 2. while loop (array & string)
// 3. for in (object)
// 4. for of (es6) (array & string)

const cars = ["bmw", "thar", "regera", "regera"];
for (let i = 0; i < cars.length; i++) {
  console.log(cars[i]);
}

//print hello 10 times
for (let i = 1; i <= 10; i++) {
  console.log("hello");
}

for (let i = 10; i >= 1; i--) {
  console.log(i);
}

for (i = cars.length - 1; i >= 0; i--) {
  console.log(cars[i]);
}

const man = {
  name: "krishna",
  lastName: "vish",
  age: 26,
};

//for in
for (const key in man) {
  console.log(man[key]);
}

//break
for (let i = 1; i <= 10; i++) {
  if (i === 5) {
    break;
  }
  console.log(i);
}

//continue
for (let i = 1; i <= 10; i++) {
    if (i === 5) {
      continue; // it will terminate on 5 and start again
    }
    console.log(i);
  }

