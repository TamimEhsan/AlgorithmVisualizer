import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Github, Home } from 'lucide-react'

export default function Navbar(props) {
  return (
    <nav className="bg-background shadow-sm py-1 px-6 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">{props.title}</Link>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="lg" asChild>
          <Link href="/">
            <Home className="h-4 w-4" />
            Home
          </Link>
        </Button>
        <Button variant="ghost" size="lg" asChild>
          <Link href="/about">About</Link>
        </Button>
        <Button size="icon" variant="ghost">
          <Link href="https://github.com/TamimEhsan/AlgorithmVisualizer">
            <Github className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </nav>
  )
}

