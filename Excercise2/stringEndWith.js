function stringEndWith(str1 , str2){
   let result = false
   let parseValue = str1.toLowerCase()
   let word = parseValue.split(' ')
   const lastIndex = word.length -1
   if(word[lastIndex] === str2){
    result = true
   }
   return result
}
console.log(stringEndWith("I Write Javascript" , "javascript"));