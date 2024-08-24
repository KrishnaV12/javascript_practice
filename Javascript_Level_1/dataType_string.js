 // Note = Primitive Data type is immutable

 const firstName = 'krishna'
 const msg1 = "hello"  , msg2 = "world"
 console.log(msg1 + " " + msg2);
 console.log(firstName[0]); // k
 console.log(firstName[10]); // undefine
 console.log(firstName.charAt(0)); //k
 console.log(firstName.charAt(10)); // ' ' empty string
 console.log(firstName.indexOf("r")); // 1
 console.log(firstName.lastIndexOf("r")); // 2
 console.log(firstName.indexOf("x")); // -1 not present
 console.log(firstName.indexOf("hna")); // 4
 
 
 const password ="secret123"
 //properties -values
 console.log(password.length); // 9
 console.log(password.length > 8 && password.length < 128); // true

 const user ='Krishna'
 // methods - behaviour
console.log(user.toUpperCase()); // KRISHNA original string will not affect
console.log(user.toLowerCase()); // krishna original string will not affect
console.log(user.includes("r")); // true 

// j a v a s c r i p t
// 0 1 2 3 4 5 6 7 8 9

const val = "javascript"
console.log(val.slice(2, 5)); // vas
console.log(val.slice(5)); // cript
console.log(val.subStr(2, 5)); // vascr second argument is length 

//string to array
const str = "js, react ,mongo"
console.log(str.split(',')); //["js" , "react , "mongo"]
console.log(str.split('*')); //["js , react , mongo"]
console.log(str.split('*').length); // 1
 