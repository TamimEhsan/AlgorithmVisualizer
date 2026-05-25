"use client";

import Navbar from "@/components/navbar";
import Footer from "../components/footer";
import { Code2, GitFork, Lightbulb, Layers } from "lucide-react";

const algorithms = [
    {
        category: "Graph Search",
        items: ["DFS", "BFS", "Dijkstra", "A*", "Recursive Maze Generation"],
    },
    {
        category: "Sorting",
        items: [
            "Bubble Sort",
            "Selection Sort",
            "Insertion Sort",
            "Heap Sort",
            "Merge Sort",
            "Quick Sort",
        ],
    },
    {
        category: "Number Theory",
        items: ["Sieve of Eratosthenes", "Ulam Spiral"],
    },
    {
        category: "Backtracking",
        items: ["N-Queen"],
    },
    {
        category: "Geometry",
        items: ["Graham Scan (Convex Hull)"],
    },
    {
        category: "Search",
        items: ["Binary Search"],
    },
    {
        category: "Recursion",
        items: [
            "Fibonacci",
            "Binomial Coefficient",
            "Derangement",
            "Fast Exponentiation",
            "Stirling Number (2nd Kind)",
        ],
    },
    {
        category: "Automata",
        items: ["Turing Machine — Bitwise NOT, Increment, 2's Complement"],
    },
    {
        category: "Simulation",
        items: ["Conway's Game of Life"],
    },
];

const inspirations = [
    {
        title: "Pathfinder",
        description: "The Projects That Got Me Into Google",
        url: "https://youtu.be/n4t_-NjY_Sg",
    },
    {
        title: "Prime Spirals",
        description: "Why do prime numbers make these spirals?",
        url: "https://youtu.be/EK32jo7i5LQ",
    },
    {
        title: "Recursion Tree",
        description: "Recursion Tree Visualizer by brpapa",
        url: "https://github.com/brpapa/recursion-tree-visualizer",
    },
    {
        title: "Turing Machine",
        description: "Tursi by schaetzc",
        url: "https://github.com/schaetzc/tursi",
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto py-12 px-4 max-w-4xl">
                <h1 className="text-4xl font-bold mb-2">About</h1>
                <p className="text-lg text-muted-foreground mb-10">
                    A better way to understand algorithms — visually, step by step.
                </p>

                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-semibold">What is this?</h2>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                        Algorithm Visualizer is an interactive tool that brings algorithms
                        to life. Instead of reading pseudocode or tracing through dry runs,
                        you can watch algorithms execute in real time — see how a pathfinding
                        algorithm explores a maze, how sorting algorithms compare and swap
                        elements, or how backtracking systematically places queens on a
                        chessboard. The goal is to make the learning process more engaging
                        and intuitive.
                    </p>
                </section>

                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-4">
                        <Layers className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-semibold">
                            Algorithms ({algorithms.reduce((sum, c) => sum + c.items.length, 0)}+)
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {algorithms.map((group) => (
                            <div
                                key={group.category}
                                className="rounded-lg border bg-card p-4"
                            >
                                <h3 className="font-medium mb-2">{group.category}</h3>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    {group.items.map((item) => (
                                        <li key={item} className="flex items-center gap-2">
                                            <span className="text-primary text-[6px]">●</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-4">
                        <Code2 className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-semibold">Tech Stack</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {["Next.js", "React", "Tailwind CSS", "Radix UI", "Lucide Icons"].map(
                            (tech) => (
                                <span
                                    key={tech}
                                    className="rounded-full border bg-secondary px-3 py-1 text-sm"
                                >
                                    {tech}
                                </span>
                            )
                        )}
                    </div>
                </section>

                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-4">
                        <GitFork className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-semibold">Inspirations</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {inspirations.map((item) => (
                            <a
                                key={item.title}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg border p-4 hover:bg-accent transition-colors"
                            >
                                <h3 className="font-medium">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {item.description}
                                </p>
                            </a>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
