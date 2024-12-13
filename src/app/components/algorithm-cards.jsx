import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'



const algorithms = [
  {
    id: 'pathfinder',
    title: "Pathfinder",
    description: "Visualize graph algorithms like dijkstra, BFS, DFS",
    image: '/AlgorithmVisualizer/images/graph.png?height=200&width=300'
  },
  {
    id: 'recursion-tree',
    title: 'Recursion Tree',
    description: "The process in which a function calls itself directly or indirectly is called recursion",
    image: '/AlgorithmVisualizer/images/recursion.jpg?height=200&width=300'
  },
  {
    id: 'sorting',
    title: 'Sorting Algorithm',
    description: "Compare different sorting algorithms",
    image: '/AlgorithmVisualizer/images/sort.png?height=200&width=300'
  },
  {
    id: 'recursive-sorting',
    title: 'Recursive Sorting',
    description: "Compare different recursive sorting algorithms",
    image: '/AlgorithmVisualizer/images/sort.png?height=200&width=300'
  },
  {
    id: 'n-queen',
    title: 'N Queen',
    description: "The N queens puzzle is the problem of placing N chess queens on an N*N chessboard so that no two queens threaten each other",
    image: '/AlgorithmVisualizer/images/queen.PNG?height=200&width=300'
  },
  {
    id: 'turing-machine',
    title: 'Turing Machine',
    description: "A Turing machine is a mathematical model of computation that defines an abstract machine that manipulates symbols on a strip of tape according to a table of rules",
    image: '/AlgorithmVisualizer/images/turing.jpg?height=200&width=300'
  },
  {
    id: 'prime-numbers',
    title: 'Prime Numbers',
    description: "Visualize how Seive is better than brute force",
    image: '/AlgorithmVisualizer/images/primes.jpg?height=200&width=300'
  },
  {
    id: 'convex-hull',
    title: 'Convex Hull',
    description: "The convex hull of a set of points is the smallest convex polygon that contains all the points of it",
    image: '/AlgorithmVisualizer/images/convex-hull.png?height=200&width=300'
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    description: "Binary search is an efficient algorithm for finding an item from a sorted list of item",
    image: '/AlgorithmVisualizer/images/binary-search.png?height=200&width=300'
  },
  // {
  //   id: '15-puzzle',
  //   title: '15 Puzzle',
  //   description: "The 15-puzzle is a sliding puzzle that consists of a frame of numbered square tiles in random order with one tile missing",
  //   image: '/AlgorithmVisualizer/images/15puzzle.PNG?height=200&width=300'
  // }
]

export function AlgorithmCards() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {algorithms.map((algorithm) => (
        <Link key={algorithm.id} href={`/${algorithm.id}`} className="block group">
          <Card className="overflow-hidden transition-shadow hover:shadow-lg h-full flex flex-col">
            <div className="relative h-48">
              <Image
                src={algorithm.image}
                alt={algorithm.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <CardHeader className="flex-grow">
              <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">
                {algorithm.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <p className="text-lg text-muted-foreground">{algorithm.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

