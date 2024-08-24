function countVowels(str) {
  let count = 0;
  str = str.toLowerCase();
  for (let i = 0; i < str.length; i++) {
    if (
      str[i] === "a" ||
      str[i] === "i" ||
      str[i] === "o" ||
      str[i] === "e" ||
      str[i] === "u"
    ) {
      count = count + 1;
    }
  }
  return count;
}

console.log(countVowels("The Quice Brown Fox Lavda Lehsun"));
