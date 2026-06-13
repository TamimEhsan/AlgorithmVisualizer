// sortingAlgorithms.js — Re-exports from split modules for backward compatibility
// Previously contained all sorting algorithms in one file (god object).
// Each algorithm now lives in its own file for single-responsibility.

export { bubbleSort } from './bubble-sort.js'
export { selectionSort } from './selection-sort.js'
export { insertionSort } from './insertion-sort.js'
