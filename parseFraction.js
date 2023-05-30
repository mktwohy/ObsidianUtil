/**
 * @param {string} str 
 * @returns {Fraction | null}
 */
export function parseFraction(str) {
    let numbers = str
        .trim()
        .replace('/', ' ')
        .split(' ')
        .map(n => parseInt(n))
    
    switch(numbers.length) {
        case 1: return new Fraction(numbers[0])    
        case 2: return new Fraction(numbers[0], numbers[1])
        case 3: return new Fraction(numbers[0]).plus(new Fraction(numbers[1], numbers[2]))
        default: return null
    }
}
module.exports = parseFraction

export class Fraction {
    constructor(numerator, denominator = 1) {
        if (denominator == 0) {
            throw new Error("denominator cannot be zero!")
        }
        this.n = numerator
        this.d = denominator
    }

    valueOf() {
        return this.n / this.d
    }
    
    toString() { 
        if (this.isWhole()) {
            return `${this.n}`
        }
        if (this.isImproper()) {
            let [whole, fraction] = this.toMixed()
            return `${whole} ${fraction.n}/${fraction.d}`
        }
        return `${this.n} / ${this.d}`
    }

    toMixed() {
        if (!this.isImproper()) {
            Error("Fraction is not improper")
        }
        let whole = Math.floor(this.n / this.d)
        return [new Fraction(whole), new Fraction(this.n - (this.d * whole), this.d)]
    }

    reduce() {
        // if both n and d are integers
        if (Number.isInteger(this.n) && Number.isInteger(this.d)) { 
            // find the GCD
            const gcd = findGcd(this.n, this.d);
            // reduced fraction is (n/GCD)/(d/GCD)
            return new Fraction(this.n / gcd, this.d / gcd);
        } else {
            // multiply n and d by 10 and try reducing again
            return new Fraction(this.n * 10, this.d * 10).reduce();
        }
    }
    
    plus(other) {
        if (other instanceof Fraction) {
            let gcd = findGcd(this.d, other.d)
            return new Fraction(
                this.n * other.d / gcd + other.n * this.d / gcd,
                this.d * other.d / gcd
            ).reduce()
        }
        return this.plus(new Fraction(other))
    }

    minus(other) {
        if (other instanceof Fraction) {
            return this.plus(other.mult(-1))
        }
        return this.plus(-other)
    }
    
    mult(other) {
        if (other instanceof Fraction) {
            return new Fraction(this.n * other.n, this.d * other.d).reduce()
        }
        return this.mult(new Fraction(other))
    }

    div(other) {
        if (other instanceof Fraction) {
            return this.mult(other.reci())
        }
        return this.mult(new Fraction(1, other))
    } 

    isImproper() {
        return this.valueOf() > 1
    }

    isWhole() {
        return this.d === 1
    }

    tex() {
        let isNeg = this.valueOf() < 0;      // fraction is negative
        let isInt = this.n % this.d == 0; // fraction is a whole number
        
        if (isImproper()) {
         
            
        }

        if (isInt) {
            return `${this.n / this.d}`;
        }
        return (isNeg ? "-" : "+") + `\\dfrac\{${Math.abs(this.n)}\}\{${Math.abs(this.d)}\}`;
        
    }
}

function findGcd(a, b) { 
    return b ? findGcd(b, a % b) : a 
}

console.log(parseFraction("3/4"));