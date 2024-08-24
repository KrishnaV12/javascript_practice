function firstElement(arr, n) {
  let result;
  if (n === undefined) {
    result = arr[0];
  } else if (n < 0) {
    result = arr.slice(0);
  } else {
    result = arr.slice(0, n);
  }
  return result;
}

console.log(firstElement([2, 4, 6, 7], 3));
