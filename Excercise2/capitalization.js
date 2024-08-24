function capitalization(str) {
  let strVal1 = "",
    strVal2 = "";
  for (let i = 0; i < str.length; i++) {
    if (i % 2 === 0) {
      strVal1 = strVal1 + str[i].toUpperCase();
      strVal2 = strVal2 + str[i].toLowerCase();
    } else {
      strVal1 = strVal1 + str[i].toLowerCase();
      strVal2 = strVal2 + str[i].toUpperCase();
    }
  }
  return [strVal1, strVal2];
}
console.log(capitalization("KRISHNA"));
