function findKeys(obj){
    let result = []
    for(const key in obj){
        result.push(key)
    }
    return result


}

const data = {k:1 , r:2 , i:3}
console.log(findKeys(data));