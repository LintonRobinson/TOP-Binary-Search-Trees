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
            
            // If a left recursuve call, end will be one before the middle item. Eventually end will shrink to be less than start. 
            // If a right recursuve call, start will be one after the middle item. Eventually start will grow to be more than end.
            if (start > end) return null
            
            // Get middle of passed array 
            const middleOfArray = start + Math.floor((end - start) / 2);
            
            // Root is middle of array
            const root = new Node(array[middleOfArray])

            // Each left recursive call passes the end value that is one less than the middle point, start remains the same.
            root.leftChild = buildTreeRecursive(array, start, (middleOfArray - 1));
            
            // Each right recursive call passes the start value that is one more than the middle point, end stays the same.
            root.rightChild = buildTreeRecursive(array, (middleOfArray + 1),  end);
            
            // Return root with their children (if applies)
            return root;
        };

        this.root = buildTreeRecursive(sortedAndsanitizedArray,0,sortedAndsanitizedArray.length - 1);

    };

    insert(value) {
        // change root to node
        function insertRecursive(root, value) {
            // If a leaf node is reached (no greater or lesser node), assign the new node to either left or right child
            if (root === null) {
                return new Node(value);
            }

            // If there is a duplicate, return the root and bubble back up
            if (value === root.data) return root;

            // If the value is less that the current root, recurse into left subtree 
            if (value < root.data) {
                root.leftChild = insertRecursive(root.leftChild,value);
            } else if (value > root.data) {
                root.rightChild = insertRecursive(root.rightChild,value); // If the value is less that the current root, recurse into right subtree 
            }
            // Reassigns returned root.leftChild & root.rightChild
            return root;
        }
        insertRecursive(this.root,value);
    };

    deleteItem(value) { 
        function getSuccessor(currentNode) {
            // Reassign root to roots right child 
            currentNode = currentNode.rightChild;
            
            // Iterate until you reach the left most node (if there is no left node the node if the left most)
            while (currentNode.leftChild !== null && currentNode.rightChild !== null) {
                currentNode = currentNode.leftChild;
            };

            // Refurn left most node
            return currentNode;
        };

        

        function deleteItemRecursive(root,value) {
            // If the passed root is null, return null
            if (root === null) return root;
            
             
            // Search subtrees for node with value to delete 
            if (value < root.data) { // If the root to be deleted' value is less than the current roots left child, search left subtree for value and assign the returned root to left child
                root.leftChild = deleteItemRecursive(root.leftChild,value);
            } else if (value > root.data) { // If the root to be deleted' value is greated than the current roots left child, this roots left child is equal to the result of recursive right calls
                root.rightChild = deleteItemRecursive(root.rightChild,value);
            } else {
                // Value match 

                // If only right child return the right child, otherwise null
                if (root.leftChild === null) {
                    return root.rightChild;
                };
                
                // If only left child return the left child, otherwise null
                if (root.rightChild === null) { 
                    return root.leftChild;
                };
                
                // Get the left most node, after the going into right node
                const successorNode = getSuccessor(root);
                
                // Assign 'deleted' nodes data to successorNode data
                root.data = successorNode.data;
                
                // Deleting duplicate node

                // The roots 'deleted/replaced' right child is equal to the result of recursively finding left most node staring at right node (delete the duplicate replaced node from the tree). 
                root.rightChild = deleteItemRecursive(root.rightChild, successorNode.data);
            };
            
            // Recursively return reconstructed root
            return root;
        };
        
        // The root is a result of the returned call
        this.root = deleteItemRecursive(this.root,value);
    };


    find(value) {
        let node = this.root; 
        // While the nodes data is not equal to the value you are searching for 
        while (node.data !== value) {
            // If the value is less than the nodes data make the node equal to the nodes left child (go left). 
            if (value < node.data) {
                node = node.leftChild;
                if (!node) return null; // If the node is null, nothing was found and return null
            } else if (value > node.data) { // If the value is more than the nodes data make the node equal to the nodes right child (go right). 
                root = node.rightChild;
                if (!node) return null;
            };
        };  
        return root;
    }



    iterationLevelOrderForEach(callback) {
        // If the callback is not a function throw an error
        if (typeof callback !== 'function') {
            throw new Error("A callback function is required");
        };

        // If there is no root, stop the function
        if (!this.root) return;

        // Initialize the queue and index
        const queue = [this.root];
        let head = 0;

        // While there are items in the queue to call (iterating head)
        while (head < queue.length) {
            const node = queue[head++];
            // Pass node to callback
            callback(node);
            // Push left and right child to queue
            if (node.leftChild) queue.push(node.leftChild);
            // Recursively go right and call callback
            if (node.rightChild) queue.push(node.rightChild);
        };
    }

    levelOrderForEach(callback) {
        // If the callback is not a function throw an error
        if (typeof callback !== 'function') {
            throw new Error("A callback function is required");
        };

        // If there is no root, stop the function
        if (!this.root) return;
       
        // Initialize the queue and index
        const queue = [this.root];
        let head = 0;

        function traverse() {
            
            // If there are no items in the queue to call (iterating head), return
            if (head >= queue.length) return;
        
            // The node is equal to the queues iterated index
            const node = queue[head++];
            // Pass the node to the funtion
            callback(node);
            // Push the left and right child to the queue
            if (node.leftChild) queue.push(node.leftChild);
            // Recursively go right and call callback
            if (node.rightChild) queue.push(node.rightChild);
            
            traverse();

        }
        traverse(); 
    };
    
    preOrderForEach(callback) {
            
        // If the callback is not a function throw an error   
        if (typeof callback !== 'function') {
            throw new Error("A callback function is required");
        }; 
        
        // If there is no root, stop the function
        if (!this.root) return;
    
    
        function traverse(root,callback) {
            // If the root is null stop recursion
            if (!root) return;
            // Pass root to callback
            callback(root)
            // Recursively go left and call callback
            traverse(root.leftChild,callback)
            // Recursively go right and call callback
            traverse(root.rightChild,callback)

        }
        
        traverse(this.root,callback)
            
    } 

    postOrderForEach(callback) {
            
        // If the callback is not a function throw an error      
        if (typeof callback !== 'function') {
            throw new Error("A callback function is required");
        };
        
        // If there is no root, stop the function
        if (!this.root) return;
    
    
        function traverse(root,callback) {
            if (!root) return 
            // Recursively go left and call callback
            traverse(root.leftChild,callback)
            // Recursively go right and call callback
            traverse(root.rightChild,callback)
            // Pass root to callback
            callback(root)

        }
        
        traverse(this.root,callback)
            
    } 

    inOrderForEach(callback) {
            
        // If the callback is not a function throw an error      
        if (typeof callback !== 'function') {
            throw new Error("A callback function is required");
        };
        
        // If there is no root, stop the function
        if (!this.root) return;
    
    
        function traverse(root,callback) {
            if (!root) return;
            // Recursively go left and call callback
            traverse(root.leftChild,callback);
            // Pass root to callback
            callback(root);
            // Recursively go right and call callback
            traverse(root.rightChild,callback);
        }
        
        traverse(this.root,callback);
            
    } 

    height(value) {
        // When you hit a leaf that points to null, on the return base reset the value and iterate. if when the roots value matches 
        
        //If the value is not found, return null
        const start = this.find(value);
        if (!start) return null;
        
        // Set initial height to 0
        let heightTotal = 0;
        

        function heightRecursive(root,heightCount) {
            
            // If there is a left child recurse left and add to the height count in this call
            if (root.leftChild) {
                heightRecursive(root.leftChild,heightCount + 1);
            };

            // If there is a right child recurse left and add to the height count in this call
            if (root.rightChild) {
                heightRecursive(root.rightChild,heightCount + 1);
            };
            
            // Once there is no children if the height count is more than the current global height total, update the height total to be ethe height countand return
            if (!root.leftChild && !root.rightChild) {
                if (heightCount > heightTotal) heightTotal = heightCount;
                return;
            };
            
        };

        heightRecursive(this.find(value),0);
        return heightTotal;
        
    } 

    depth(value) {
        // If the value is not found, return null
        const start = this.find(value);
        if (!start) return null;

        // Initialize root and depth
        let node = this.root; 
        let depth = 0;

        // While the current node is not equal to the value
        while (node.data !== value) {
            // If the value is less than the node the current node is equal to its left child
            if (value < node.data) {
                node = node.leftChild;
                // Iterate depth
                depth++;
            } else if (value > node.data) { // If the value is greater than the node the current node is equal to its right child
                node = node.rightChild;
                // Iterate depth
                depth++;
            };
        };  
        return depth;
    }


    isBalancedRecursion() {
        // If there is no tree, its balanced
        if (!this.root) return true;
        

        const checkNodeBalance = (node) => {
            
            // If there is no node, return 0, start the height count for node
            if(!node) return 0;

            // The returned left child height is equal to 1 plus highest sub tree previous height (left or right)
            const leftChildHeight = checkNodeBalance(node.leftChild)
            // There was an imbalance: trigger short circut
            if (leftChildHeight === -1) return -1;
            
            // The returned right child height is equal to 1 plus highest sub tree previous height (left or right)
            const rightChildHeight = checkNodeBalance(node.rightChild)
            // There was an imbalance: trigger short circut
            if (rightChildHeight === -1) return -1;

    
            // Check gap. If greater than one, return -1 and trigger short circut
            if (Math.abs(leftChildHeight - rightChildHeight) > 1) return -1;
            
            // Return 1 plus highest sub tree
            return 1 + Math.max(leftChildHeight,rightChildHeight);
            
        }
        // If there was no imbalance and short circut was not triggred, return true. If not return false
        return checkNodeBalance(this.root) !== -1;
        
    }

    rebalance() {
        // Array to pass to build tree 
        const newTreeArray = [];
        // Pass each node in order to anon funtion to push each node to array
        this.inOrderForEach(node => newTreeArray.push(node.data))
        // Build tree with array
        this.buildTree(newTreeArray)
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
exampleTree.buildTree([1,2,3,4,5,6,7,8,9]);

//exampleTree.insert(47)
//exampleTree.insert(0)

//prettyPrint(exampleTree.root)

//console.log('Is this tree balanced',exampleTree.isBalancedRecursion())
//exampleTree.deleteItem(2);
//exampleTree.rebalance();

//prettyPrint(exampleTree.root);


//exampleTree.iterationLevelOrderForEach(logEachItem)

//exampleTree.inOrderForEach(logEachItem)

//console.log('This should be height',exampleTree.height(5));

//console.log('Depth',exampleTree.depth(0));


function logEachItem(node) {
    console.log(node.data);
}