import React, {Component} from 'react';

class Details extends Component {

    Switcherr = () => {
        switch (this.props.algo) {
            case 0:
                return <div className='row bg-info m-0 p-2'>
                    <div className='col-3  card me-1 bg-light '>
                        The Fibonacci sequence, in which each number is the sum of the two preceding ones. The sequence
                        commonly starts from 0 and 1
                    </div>
                    <div className='col-3  card me-1 bg-light '>
                        N = Nth fibonacchi Number
                    </div>
                    <div className='col-3  bg-light '>
                        function = nCr(n,r)
                    </div>
                    <div className='col-3  card me-1 bg-light'>
                        Fib(0) = 0 <br/>
                        Fib(1) = 1 <br/>
                        Fib(n) = Fib(n-1) + Fib(n-2)
                    </div>
                </div>;

            case 1:
                return <div className='row bg-info m-0 p-2 '>
                    <div className='col-3  card me-1 bg-light'>
                        In mathematics, the binomial coefficients are the positive integers that occur as coefficients
                        in the binomial theorem. It is the coefficient of
                        the x^k term in the polynomial expansion of the binomial power (1+x)^n
                    </div>
                    <div className='col-3  card me-1 bg-light'>
                        nCr = n! / ( k! * (n-k)! )
                    </div>
                    <div className='col-3  card me-1 bg-light'>
                        function = nCr(n,r)
                    </div>
                    <div className='col-3  card me-1 bg-light'>
                        nCr(a,a) = 1 <br/>
                        nCr(a,0) = 1 <br/>
                        nCr(n,r) = nCr(n-1,r-1)+nCr(n-1,r)
                    </div>
                </div>;
            case 2:
                return <div className='row bg-info m-0 p-2 '>
                    <div className='col-3  card me-1 bg-light '>
                        In combinatorial mathematics, a derangement is a permutation of the elements of a set, such that
                        no element appears in its original position.
                    </div>
                    <div className='col-3  card me-1 bg-light '>
                        N = Nth Derangement
                    </div>
                    <div className='col-3  card me-1 bg-light '>
                        function = der(n)
                    </div>
                    <div className='col-3  card me-1 bg-light '>
                        der(0) = 1 <br/>
                        der(1) = 0 <br/>
                        der(n) = (n-1) * ( der(n-1) + der(n-2) )
                    </div>
                </div>;
            case 3:
                return <div className='row bg-info m-0 p-2 '>
                    <div className='col-3  card me-1 bg-light '>
                        N = Number
                        P = Power
                    </div>
                    <div className='col-3  card me-1 bg-light '>
                        function = bigmod(n,p)
                    </div>
                    <div className='col-3  card me-1 bg-light '>
                        bigmod(a,0) = 1 <br/>
                        bigmod(a,1) = a <br/>
                        bigmod(n,p) = bigmod(n,p/2)^2; p is even <br/>
                        bigmod(n,p) = bigmod(n,(p-1)/2)^2 * n ; p is odd
                    </div>
                </div>;
            case 4:
                return <div className='row bg-info m-0 p-2 '>
                    <div className='col-3  card me-1 bg-light '>
                        a Stirling number of the second kind (or Stirling partition number) is the number of ways to
                        partition a set of n objects into k non-empty subsets
                    </div>
                    <div className='col-3  card me-1 bg-light '>
                        N = Row
                        R = Column
                    </div>
                    <div className='col-3  card me-1 bg-light '>
                        function = stir2(n,r)
                    </div>
                    <div className='col-3  card me-1 bg-light '>
                        stir2(a,a) = 1 <br/>
                        stir2(0,a) = 0 <br/>
                        stir2(n,r) = stir2(n-1,r) * r + stir2(n-1,r-1)

                    </div>
                </div>;

            default:
                return <b>Henlo</b>;

        }
    }

    render() {
        return (
            <div>
                {this.Switcherr()}
            </div>
        );
    }
}

export default Details;