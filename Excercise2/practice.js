const capitalization = (str) => {
  let strVal1 = "";
  let strVal2 = "";
  for (let i = 0; i < str.length; i++) {
    if (i % 2 === 0) {
      strVal1 += str[i].toLowerCase();
      strVal2 += str[i].toUpperCase();
    } else {
      strVal1 += str[i].toUpperCase();
      strVal2 += str[i].toLowerCase();
    }
  }
  return [strVal1, strVal2];
};

console.log(capitalization("krishna"));

const findKeys = (obj) => {
  let result = [];
  for (let keys in obj) {
    result.push(keys);
  }
  return result;
};

const data = { k: 1, r: 2, i: 3 };
console.log(findKeys(data));

const maxNumber = (arr) => {
  const result = arr[0];
  for (let num of arr) {
    if (arr[num] > result) {
      result = arr[char];
    }
  }
  return result;
};

const maxNumber2 = (arr) => {
  let result = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > result) {
      result = arr[i];
    }
  }
  return result;
};

console.log(maxNumber([10, 4, 8, 9]));
console.log(maxNumber2([10, 4, 8, 9]));

const palindrome = (str) => {
  let flag = false;
  let result = "";

  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  if (str === result) {
    flag = true;
  }
  return `${flag} , result = ${result}`;
};

console.log(palindrome("anna"));

const stringEndWith = (str, str2) => {
  let flag = false;
  const lowerStr = str.toLowerCase();
  word = lowerStr.split(" ");
  const lastIndexOf = word.length - 1;
  if (word[lastIndexOf] === word) {
    flag = true;
  }
  return flag;
};

console.log(stringEndWith("I Write Javascript", "javascript"));
