class Node{
    constructor(val) {
        this.val = val;
        this.left = undefined;
        this.right = undefined;
    }
}
export class BST{
    constructor() {
        this.root = undefined;
    }
    insert(x){
        this.root = this.insertX(x,this.root);
    }
    insertX(x,node){
        if( node === undefined ){
            return new Node(x);
            return;
        }
        if( node.value === x ) return node;
        else if( node.value > x ) node.left = this.insertX(x,node.left);
        else node.right = this.insertX(x,node.right);
    }

}