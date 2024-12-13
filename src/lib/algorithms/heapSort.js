let values = [];
export default function HeapSort(rects2){
    let rects = rects2.slice();
    values = [];
    let sz = rects2.length;
   // sz = sz-1;
    heapSort(rects,sz);
    return values;
}
function heapify(rects,n,i){
    let largest = i; // Initialize largest as root
    let l = 2 * i + 1; // left = 2*i + 1
    let r = 2 * i + 2; // right = 2*i + 2

    // If left child is larger than root
    if (l < n && rects[l].width > rects[largest].width)
        largest = l;

    // If right child is larger than largest so far
    if (r < n && rects[r].width > rects[largest].width)
        largest = r;

    // If largest is not root
    if (largest != i) {
        let temp = rects[i];
        rects[i] = rects[largest];
        rects[largest] = temp;
        let value = {
            left:i,
            right:largest,
            sorted: false
        }
        values.push(value);
        // Recursively heapify the affected sub-tree
        heapify(rects, n, largest);
    }
}
function heapSort(rects,n){
    for(let i = Math.floor(n/2)-1;i>=0;i--){
      //  console.log("heap ",n," ",i);
        heapify(rects,n,i);
    }
    for (let i = n-1 ; i > 0; i--) {
        // Move current root to end
        let temp = rects[i];
        rects[i] = rects[0];
        rects[0] = temp;
        let value = {
            left:i,
            right:0,
            sorted:true
        }
        values.push(value);
        // call max heapify on the reduced heap
        heapify(rects, i, 0);
    }
}
