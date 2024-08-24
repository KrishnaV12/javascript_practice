// Scope = scope is the accessibility of variables ,functions ,and object in some particular part of your code during runtime.
const str1 = "outside function";
function greet() {
  const str2 = "inside function";
  if (true) {
    const str3 = "inside block";
  }
  console.log(str3); // reference error
}
greet();
console.log(str1); // 'outside function'
console.log(str2); // reference error


//lexical scope
