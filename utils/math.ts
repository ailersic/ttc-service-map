namespace math {
    export function gcd(a: number, b: number) {
        if (b === 0) {
          return a;
        }
        return gcd(b, a % b);
    }

    export function lcm(a: number, b: number) {
        return Math.abs(a * b) / gcd(a, b);
    }
}

export default math;