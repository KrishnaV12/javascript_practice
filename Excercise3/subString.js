function count(str1, str2) {
  let count = 0;
  str1 = str1.toLowerCase();
  let word = str1.split(" ");
  for (let i = 0; i < word.length; i++) {
    if (word[i] === str2.toLowerCase()) {
      count = count + 1;
    }
  }
  return count;
}

console.log(count(" The quick Brown fox Jump" , "fox"));
// console.log(count(" The quick Brown fox Jump"));
