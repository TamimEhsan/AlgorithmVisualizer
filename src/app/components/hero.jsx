import Image from 'next/image'

export default function Hero() {
    return (
        <section className="container mx-auto px-6 py-12 w-full flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-3/4 space-y-4">
                <h1 className="text-7xl font-bold">Algorithm Visualizer</h1>
                <p className="text-3xl text-muted-foreground">
                    Explore algorithms with step-by-step visualizations,
                    simplifying the learning process and making it more engaging
                    for a better understanding

                </p>
            </div>
            <div className="md:w-1/4">
                <Image
                    src="/AlgorithmVisualizer/images/algorithm.png?height=400&width=600"
                    alt="Hero image"
                    width={300}
                    height={200}
                    // className="rounded-lg shadow-lg"
                />
            </div>
        </section>
    )
}

