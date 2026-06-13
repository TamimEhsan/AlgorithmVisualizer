// insertion-sort.js — Insertion sort algorithm with visualization step tracking
// Extracted from sortingAlgorithms.js for single-responsibility.

/**
 * Insertion sort — builds sorted array one element at a time.
 * Returns an array of step objects for animation.
 * @param {Array} arr - Array of {width, ...} objects to sort
 * @returns {Array} Array of {xx, yy, changed} step objects
 */
export function insertionSort(arr){
    const pairs = [];
    let n = arr.length;
    const prevRect = arr.slice();
    for (let i = 1; i < n; ++i) {
        let key = prevRect[i].width;
        let j = i - 1;

        while (j >= 0 && prevRect[j].width > key) {
            const recti = {...prevRect[j]};
            const rectj = {...prevRect[j+1]};
            prevRect[j+1] = recti;
            prevRect[j] = rectj;
            pairs.push( {
                xx:j,
                yy:j+1,
                changed:true
            } );
            j = j - 1;
        }
    }
    for(let i=0;i<n;i++){
        pairs.push({
            xx:i,
            yy:i,
            changed:true
        })
    }
    return pairs;
}
