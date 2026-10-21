const chopString = (str, n) => {
  const result = [];
  for (let i = 0; i < str.length; i = i + n) {
    const value = str.slice(i, i + n);
    result.push(value);
  }
  return result;
};

console.log(chopString("vishwakarma", 2));

const countSheep = (n) => {
  let result = "";
  for (let i = 1; i <= n; i++) {
    result += `${i}sheep...`;
  }
  return result;
};

console.log(countSheep(3));

const countUpThenDown = (n) => {
  const result = [];
  for (let i = 1; i <= n; i++) {
    result.push(i);
  }

  for (let i = n - 1; i >= 1; i--) {
    result.push(i);
  }
  return result;
};

console.log(countUpThenDown(5));

const countVowels = (str) => {
  let count = 0;
  const minimulStr = str.toLowerCase();
  for (let i = 0; i < minimulStr.length; i++) {
    if (
      minimulStr[i] === "a" ||
      minimulStr[i] === "e" ||
      minimulStr[i] === "i" ||
      minimulStr[i] === "o" ||
      minimulStr[i] === "u"
    ) {
      count++;
    }
  }
  return count;
};

const countVowels2 = (str) => {
  let count = 0;
  const vowels = "aeiou";
  const lowerStr = str.toLowerCase();
  for (let char of lowerStr) {
    
    if (vowels.includes(char)) count++;
  }
  return count;
};

const str = "The";
console.log(str.length);
console.log(countVowels("The Quice Brown Fox Lavda Lehsun"));
console.log(countVowels2("The Quice Brown Fox Lavda Lehsun"));

const firstElement = (arr, n) => {
  let result;
  if (n === undefined) {
    result.push(arr);
  } else if (n <= 0) {
    result = arr.slice(0);
  } else {
    result = arr.slice(0, n);
  }
  return result;
};

console.log(firstElement([2, 4, 6, 7], 3));

const generateArray = (start, end) => {
  const result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
};
console.log(generateArray(1, 8));

const sumArray = (arr) => {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
};

console.log(sumArray([10, 20, 30]));
