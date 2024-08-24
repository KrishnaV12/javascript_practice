function swap(obj , str){
let result = {}

for(const key in obj ){
    if(key === str){
        result[obj[key]] = key
    }else{
        result[key] = obj[key]
    }
}
return result 


}

const developer = {name:"krishna" , job:"developer"}

console.log(swap(developer , "name"))