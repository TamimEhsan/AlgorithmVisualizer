import React from 'react';

const Spiral = ({ primes, maxPrime }) => {
    const Maxwidth = window.innerWidth;
    const MaxHeight = window.innerHeight;

    let width, height;
    if (Maxwidth > MaxHeight) {
        let ratio = Maxwidth / MaxHeight;
        height = maxPrime;
        width = ratio * height;
    } else {
        let ratio = MaxHeight / Maxwidth;
        width = maxPrime;
        height = ratio * width;
    }

    const radius = (Math.min(width, height)) / 300;

    return (
        <svg viewBox={`0 0 ${2 * width} ${2 * height}`} xmlns="http://www.w3.org/2000/svg">
            {primes.map((cell, cellidx) => (
                <circle
                    key={cellidx}
                    id={cellidx}
                    cx={cell * Math.cos(cell) + width}
                    cy={cell * Math.sin(cell) + height}
                    r={radius}
                    stroke="black"
                    strokeWidth="0.5"
                    fill='#51c4b5'
                />
            ))}
        </svg>
    );
};

export default Spiral;
