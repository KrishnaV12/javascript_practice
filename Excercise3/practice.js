const checkObj = (obj, str) => {
  let flag = false;
  for (let keys in obj) {
    if (keys === str) {
      flag = true;
      break;
    }
    return flag;
  }
};
console.log(checkObj({ name: "vefir", city: "mumbai" }, "name"));

function repeat(str, n) {
  let result = "";
  for (let i = 1; i <= n; i++) {
    result = result + str;
  }

  return result;
}

console.log(repeat("KRI", 4));

const count = (str1, str2) => {
  let count = 0;
  str1 = str1.toLowerCase();
  let sentence = str1.split(" ");
  let word = str2.toLowerCase();
  for (let char of sentence) {
    if (char === word) {
      count++;
    }
  }
  return count;
};

console.log(count(" The quick Brown fox Jump", "fox"));


const swap = (obj , str)=>{
  let result = {}
  for(let keys in obj){
    if(keys === str){
      result[obj[keys]]= keys
    }else{
      result[keys] = obj[keys]
    }
  }
  return result
}

const developer = {name:"krishna" , job:"developer"}

console.log(swap(developer , "name"))