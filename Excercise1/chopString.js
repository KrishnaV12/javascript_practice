function chopString(str, n) {
  let result = [];
  for (let i = 0; i < str.length; i = i + n) {
    const chopedString = str.slice(i, i + n);
    result.push(chopedString);
  }
  return result;
}

console.log(chopString("vishwakarma", 2));
