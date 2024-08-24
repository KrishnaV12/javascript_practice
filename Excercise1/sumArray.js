function sumArray(arr){
    let sum = 0
    for (let i = 0 ; i < arr.length ; i++){
        sum = sum + arr[i]
    }
    return sum
}

console.log(sumArray([10,20,30]));