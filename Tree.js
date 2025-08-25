import mergeSort from "./mergeSort.js";

class Tree {
    
    constructor(sortedArray) {
        this.sortedArray = sortedArray;
        this.root = null;
    };

    buildTree(array) {
        // Converting to set, back to array removes duplicate elements
        const arrayToSet = new Set(array);
        const sanitizedArray = Array.from(arrayToSet);
        const sortedArray = mergeSort(sanitizedArray);         
        return sortedArray


    };

    


};


const exampleTree = new Tree();
console.log(exampleTree.buildTree([1,7,4,23,8,9,4,3,5,7,9,67,6345,324,1,7]));

