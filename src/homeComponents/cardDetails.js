import graph from "./images/graph.png";
import primes from "./images/primes.jpg";
import sort from "./sort.png";
import queen from "./images/queen.PNG";
import binSearch from "./images/binaryTree.png";
import convex from './images/convexHull.png'
import puzzle from './images/15puzzle.PNG'
export function getDetails(){
   return [
       {
           id:1,
           title:"Pathfinder",
           description:"Visualize graph algorithms like dijkstra, BFS, DFS",
           route:"/Pathfinder-2.0/pathfinder",
           img:graph
       },
       {
           id:2,
           title:"Prime Numbers",
           description:"Visualize how Seive is better than brute force",
           route:"/Pathfinder-2.0/prime",
           img:primes
       },
       {
           id:3,
           title:"Sorting Algorithm",
           description:"Compare different sorting algorithms",
           route:"/Pathfinder-2.0/sort",
           img:sort
       },
       {
           id:3,
           title:"N Queen",
           description:"The N queens puzzle is the problem of placing N chess queens on an N*N chessboard so that no two queens threaten each other",
           route:"/Pathfinder-2.0/nqueen",
           img:queen
       },
       {
           id:4,
           title:"Backtracking",
           description:"Coming soon...",
           route:"/Pathfinder-2.0/",
           img:graph
       },
       {
           id:5,
           title:"Binary Search",
           description:"Coming soon...",
           route:"/Pathfinder-2.0/",
           img:binSearch
       },
       {
           id:5,
           title:"Convex Hull",
           description:"Coming soon...",
           route:"/Pathfinder-2.0/",
           img:convex
       },
       {
           id:5,
           title:"15 Puzzle",
           description:"Coming soon...",
           route:"/Pathfinder-2.0/",
           img:puzzle
       }
   ]
}