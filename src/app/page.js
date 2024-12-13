"use client";
import Navbar from "@/components/navbar";
import { AlgorithmCards } from "./components/algorithm-cards";
import Footer from "./components/footer";
import Hero from "./components/hero";

   
export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar title="Algorithm Visualizer"/>
      <Hero/>
    {/* <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Algorithm Visualizer
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl">
          Explore and visualize various algorithms to better understand their inner workings and efficiency.
        </p>
      </div>
    </header> */}
    <main className="container mx-auto py-12 px-4">
      <AlgorithmCards />
    </main>
    <Footer/>
  </div>
  
  )
}