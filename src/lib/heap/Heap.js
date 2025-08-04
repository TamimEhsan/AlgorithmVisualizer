import { TreeNode, buchheim } from '@/lib/tree/Tree';

export class Heap {
    constructor(isMaxHeap = true) {
        this.heap = [];
        this.isMaxHeap = isMaxHeap;
        this.operations = [];
    }

    compare(a, b) {
        return this.isMaxHeap ? a > b : a < b;
    }

    parent(index) {
        return Math.floor((index - 1) / 2);
    }

    leftChild(index) {
        return 2 * index + 1;
    }

    rightChild(index) {
        return 2 * index + 2;
    }

    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    push(value) {
        this.heap.push(value);
        this.heapifyUp(this.heap.length - 1);
        this.operations.push({
            type: 'push',
            value: value,
            heap: [...this.heap]
        });
    }

    pop() {
        if (this.heap.length === 0) return null;
        
        const root = this.heap[0];
        const lastElement = this.heap.pop();
        
        if (this.heap.length > 0) {
            this.heap[0] = lastElement;
            this.heapifyDown(0);
        }
        
        this.operations.push({
            type: 'pop',
            value: root,
            heap: [...this.heap]
        });
        
        return root;
    }

    heapifyUp(index) {
        if (index === 0) return;
        
        const parentIndex = this.parent(index);
        if (this.compare(this.heap[index], this.heap[parentIndex])) {
            this.swap(index, parentIndex);
            this.heapifyUp(parentIndex);
        }
    }

    heapifyDown(index) {
        let targetIndex = index;
        const leftIndex = this.leftChild(index);
        const rightIndex = this.rightChild(index);

        if (leftIndex < this.heap.length && 
            this.compare(this.heap[leftIndex], this.heap[targetIndex])) {
            targetIndex = leftIndex;
        }

        if (rightIndex < this.heap.length && 
            this.compare(this.heap[rightIndex], this.heap[targetIndex])) {
            targetIndex = rightIndex;
        }

        if (targetIndex !== index) {
            this.swap(index, targetIndex);
            this.heapifyDown(targetIndex);
        }
    }

    toTreeNode() {
        if (this.heap.length === 0) return null;
        return this.buildTreeNode(0);
    }

    buildTreeNode(index) {
        if (index >= this.heap.length) return null;

        const children = [];
        const leftIndex = this.leftChild(index);
        const rightIndex = this.rightChild(index);

        if (leftIndex < this.heap.length) {
            children.push(this.buildTreeNode(leftIndex));
        }
        if (rightIndex < this.heap.length) {
            children.push(this.buildTreeNode(rightIndex));
        }

        return new TreeNode(
            this.heap[index],
            children.filter(child => child !== null),
            this.heap[index].toString()
        );
    }

    getVisualizationTree() {
        const treeNode = this.toTreeNode();
        return treeNode ? buchheim(treeNode) : null;
    }
}
