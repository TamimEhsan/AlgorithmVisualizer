/**
 * Sieve of Eratosthenes — returns all prime numbers up to n.
 * Note: Previously named `seive` (typo). Alias kept for backward compatibility.
 * @param {number} n - Upper bound (inclusive)
 * @returns {number[]} Array of prime numbers
 */
export function sieve(n){
    let vis = new Array(n+5).fill(0);

    let primes = [];
    for(let p = 2;p<=n;p++){
        if( vis[p] === 0 ){
            primes.push(p);
            for(let q = p*p;q<=n;q+=p)
                vis[q] = 1;
        }
    }
    return primes;
}

// Backward-compatible alias (original had typo "seive")
export { sieve as seive };