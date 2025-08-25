function mergeSort(array) {
    
    if (array.length <= 1) return array;
    
    const middleOfArrayIndex = Math.floor(array.length / 2);
    const slicedArrayOne = array.slice(0,middleOfArrayIndex);
    const slicedArrayTwo = array.slice(middleOfArrayIndex);
    
    const arrayOne = mergeSort(slicedArrayOne); 
    const arrayTwo = mergeSort(slicedArrayTwo);
    
    return mergeSorted(arrayOne, arrayTwo);


    function mergeSorted(arrayOne, arrayTwo ) {
        
        let arrayOneIndex = 0;
        let arrayTwoIndex = 0;
        let sortedArray = [];

        while (arrayOneIndex < arrayOne.length && arrayTwoIndex < arrayTwo.length) {
            if (arrayOne[arrayOneIndex] < arrayTwo[arrayTwoIndex]) {
                sortedArray.push(arrayOne[arrayOneIndex++]);
            } else {
                sortedArray.push(arrayTwo[arrayTwoIndex++]);
            }
        }

        for (;arrayOneIndex < arrayOne.length; arrayOneIndex++) {
            sortedArray.push(arrayOne[arrayOneIndex]);
        };
        
        for (;arrayTwoIndex < arrayTwo.length; arrayTwoIndex++) {
            sortedArray.push(arrayTwo[arrayTwoIndex]);
        };
        
        return sortedArray;
    }
}

export default mergeSort