function maxNumber(arr){
 let result = 0
 for(i=0 ; i < arr.length ; i++){
    if(result < arr[i]){
        result = arr[i]
    }
 }

 return result

}


console.log(maxNumber([10,4,8,9]));