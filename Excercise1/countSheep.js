function countSheep(n){
    let result = ""
    for(let i = 1 ; i <= n ; i++){
        result += `${i} sheep...`
    }
    return result
}

console.log(countSheep(3));