function countUpThenDown(n) {
  let result = [];
  for (let i = 0; i <= n; i++) {
    result.push(i);
  }
  for (let i = n - 1; i >= 0; i--) {
    result.push(i);
  }
  return result
}

console.log(countUpThenDown(5));
