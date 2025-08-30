import mergeSort from "./mergeSort.js";
import Node from "./Node.js";

class Tree {
    
    constructor(sortedArray) {
        this.sortedArray = sortedArray;
        this.root = null;
    };

   
   
    

    buildTree(array) {
        // Converting to set, back to array removes duplicate elements
        const arrayToSet = new Set(array);
        const sanitizedArray = Array.from(arrayToSet);
        const sortedAndsanitizedArray = mergeSort(sanitizedArray); 
        
        
        
        
        function buildTreeRecursive(array,start,end) {
            // console.log('This is the passed array',array)
            
            // console.log('This is the start',start)
            // console.log('This is the end',end)

            if (start > end) return null
            
            const middleOfArray = start + Math.floor((end - start) / 2);
            //console.log('This is the middle',middleOfArray)
            
            const root = new Node(array[middleOfArray])
            //console.log('This is the root',array[middleOfArray])

            //console.log('Running left')
            root.leftChild = buildTreeRecursive(array, start, (middleOfArray - 1));
            //console.log('Running right')
            //console.log('Root of right',array[middleOfArray])
            root.rightChild = buildTreeRecursive(array, (middleOfArray + 1),  end);
            
            // console.log('This is the root', root)
            return root


        };

        this.root = buildTreeRecursive(sortedAndsanitizedArray,0,sortedAndsanitizedArray.length - 1);

    };

    insert(value) {
        function insertRecursive(root, value) {
            if (root === null) {
                console.log('Base case', value)
                return new Node(value);
            }

            if (value === root.data) return root;

            if (value < root.data) {
                root.leftChild = insertRecursive(root.leftChild,value);
            } else if (value > root.data) {
                root.rightChild = insertRecursive(root.rightChild,value);
            }

            return root;
        }

        console.log('Running');
        insertRecursive(this.root,value);


    }

    deleteItem(value) {
        
        function getSuccessor(currentNode) {
            // Reassight root to roots right child 
            currentNode = currentNode.rightChild
            // Iterate until you reach the left most node
            while (currentNode.leftChild !== null && currentNode.rightChild !== null) {
                currentNode = currentNode.leftChild;
            };

            return currentNode;
        };

        

        function deleteItemRecursive(root,value) {
            // If the passed root is null, return null
            if (root === null) return root;
            // Search subtrees for node with value to delete 
            if (value < root.data) { // If the root to be deleted' value is less than the current roots left child, search left subtree for value and assign the returned root to left child
                root.leftChild = deleteItemRecursive(root.leftChild,value);
            } else if (value > root.data) { // If the root to be deleted' value is greated than the current roots left child, this roots left child is equal to the result of recursive right calls
                root.leftChild = deleteItemRecursive(root.rightChild,value);
            } else {
                if (root.leftChild === null) {
                    return root.rightChild;
                };
                
                if (root.rightChild === null) {
                    return root.leftChild;
                };
                    
                const successorNode = getSuccessor(root);
                root.data = successorNode.data;
                root.rightChild = deleteItemRecursive(root.rightChild, successorNode.data);
            };

            return root;

        };
        
        this.root = deleteItemRecursive(this.root,value);

        
        
    };

    find(value) {
        let root = this.root; 

        while (root.data !== value) {
            if (value < root.leftChild.data) {
                root = root.leftChild;
            } else if (value > root.leftChild.data) {
                root = root.rightChild;
            };
        
        };  
        
        return root;
    }

    iterationLevelOrderForEach(callback) {
        if (typeof callback !== 'function') {
            throw new Error("A callback function is required");
        }
        if (!this.root) return;

        const queue = [this.root];
        let head = 0;

        while (head < queue.length) {
            const node = queue[head++];
            callback(node);

            if (node.leftChild) queue.push(node.leftChild);
            if (node.rightChild) queue.push(node.rightChild);
        }
    }
};

const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.rightChild !== null) {
    prettyPrint(node.rightChild, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  if (node.leftChild !== null) {
    prettyPrint(node.leftChild, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }

  

};



const exampleTree = new Tree();
exampleTree.buildTree([1,2,3,4,5]);
//console.log('Should be the root', exampleTree.root);
exampleTree.insert(37)
exampleTree.insert(0)

//console.log('Added 37');
// Need to log the root after inserted number




prettyPrint(exampleTree.root)

exampleTree.deleteItem(3);
//console.log('This is what was found',exampleTree.find(5))


//console.log('Deleted 3');
prettyPrint(exampleTree.root);

exampleTree.iterationLevelOrderForEach(logEachItem)






function logEachItem(item) {
    console.log(item.data);
}