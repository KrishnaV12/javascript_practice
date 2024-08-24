function checkObj(obj , str){
    let result = false
    for (const key in obj){
        if (key === str){
            result = true
            break
        }
    }
    return result
}

    console.log(checkObj({'name':'vefir', 'city':"mumbai"} , "name"));