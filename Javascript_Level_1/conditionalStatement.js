// if else condition
if (condition) {
  statement;
} else if (condition2) {
} else {
  statement;
}

const userPassword = "secret123";
if (userPassword.length >= 8 && userPassword.length <= 128) {
  console.log("proceed further");
} else {
  console.log("password length is to short (8-12)");
}

// str count

function strCount(str, char) {
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === char) {
      result += 1;
    }
  }
  return result;
}

console.log(strCount("hello", "o")); // 1

function oddEven(arr) {
  arr1 = [];
  arr2 = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] % 2 === 0) {
      arr1.push(arr[i]);
    } else {
      arr2.push(arr[i]);
    }
  }
  return [arr1, arr2];
}

console.log(oddEven([1, 2, 3, 4, 5, 6]));

function swapCase(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] === str[i].toUpperCase()) {
      result += str[i].tolowerCase();
    } else {
      result += str[i].toUpperCase();
    }
  }
  return result;
}

console.log(swapCase("KRIshna")); //kriSHNA

//ternary operator
condition ? true : false;
const billAmount = 1000;
let discount = billAmount > 500 ? 10 : 0;
console.log(discount); // 10
