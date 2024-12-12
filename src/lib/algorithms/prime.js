export function seive(n){
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