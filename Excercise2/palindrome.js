function palindrome(str) {
  let result = "";
  let flag = false;
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
    console.log(result, str[i]);
  }

  if (str === result) {
    console.log(str, result);
    flag = true;
  }

  return `${result} , ${flag}`;
}

console.log(palindrome("anna"));
