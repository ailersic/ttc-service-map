/** Utility functions for handling 2D geometry */
namespace geometry {

    export type Point<T extends any[] = any[]> = [number, number, ...T];
    export type PointLike<T extends {}, X extends keyof T, Y extends keyof T> = T & {
        [k in X | Y]: number;
    };

    export function squareDistance(a: Point, b: Point): number {
        const [ax, ay] = a;
        const [bx, by] = b;
        return Math.pow(ax - bx, 2) + Math.pow(ay - by, 2);
    }

    export function distance(a: Point, b: Point): number {
        return Math.sqrt(squareDistance(a, b));
    }

    export function distanceToLine(p: Point, a: Point, b: Point, clampA: boolean = true, clampB: boolean = true) {
        return distance(p, snapToLine(p, a, b, clampA, clampB).point);
    }

    export function lerp(a: Point, b: Point, t: number): Point {
        const [ax, ay] = a;
        const [bx, by] = b;
        const dx = bx - ax;
        const dy = by - ay;
        return [
            ax + dx * t,
            ay + dy * t,
        ];
    }

    export function snapToLine(
        p: Point, a: Point, b: Point,
        clampA: boolean = true, clampB: boolean = true,
    ): { point: Point, t: number } {
        const [px, py] = p;
        const [ax, ay] = a;
        const [bx, by] = b;
        const vx = bx - ax;
        const vy = by - ay;
        const ux = px - ax;
        const uy = py - ay;
        const dotuv = ux * vx + uy * vy;
        let t = dotuv / squareDistance(a, b);
        if (clampA) t = Math.max(0, t);
        if (clampB) t = Math.min(t, 1);
        return { point: lerp(a, b, t), t };
    }

    export function snapToPolyLine(p: Point, pl: Point[]): { point: Point, t: number } | null {
        const nearest = {
            point: null as Point | null,
            t: NaN,
            sqrDist: Infinity,
        };
        for (let i = 0; i < pl.length - 1; i++) {
            const { point: snapPoint, t } = snapToLine(p, pl[i], pl[i + 1]);
            const snapSquareDistance = squareDistance(snapPoint, p);
            if (snapSquareDistance < nearest.sqrDist) {
                nearest.point = snapPoint;
                nearest.sqrDist = snapSquareDistance;
                nearest.t = t + i;
            }
        }
        return nearest.point && {
            point: nearest.point!,
            t: nearest.t,
        };
    }

    export function slicePolyLine(pl: Point[], t0: number, t1: number): Point[] {
        // Clamp into valid range
        const tMax = pl.length - 1;
        t0 = Math.max(0, Math.min(tMax, t0));
        t1 = Math.max(0, Math.min(tMax, t1));
        // Ensure valid order
        const tStart = Math.min(t0, t1);
        const tEnd = Math.max(t0, t1);
        t0 = tStart;
        t1 = tEnd;
        // Separate integer and fraction parts
        const i0 = Math.trunc(t0);
        const i1 = Math.trunc(t1);
        const f0 = t0 - i0;
        const f1 = t1 - i1;
        // Slice middle
        const result = pl.slice(i0 + 1, i1 + 1).map((p): Point => [...p]);
        // Insert first
        result.unshift(f0 === 0 ? [...pl[i0]] : lerp(pl[i0], pl[i0 + 1], f0));
        // Insert last
        if (f1 > 0 && t0 !== t1) {
            result.push(lerp(pl[i1], pl[i1 + 1], f1));
        }
        return result;
    }

    export function reducePolyLine<T extends any[] = []>(params: {
        points: Point<T>[],
        iterations?: number,
        tolerance?: number,
    }): Point<T>[];
    export function reducePolyLine<
        T extends {}, X extends keyof T, Y extends keyof T,
    >(params: {
        points: PointLike<T, X, Y>[],
        x: X,
        y: Y,
        iterations?: number,
        tolerance?: number,
    }): PointLike<T, X, Y>[];
    export function reducePolyLine<
        X extends keyof T, Y extends keyof T, T extends Point | {} = Point, U extends any[] = [],
    >(params: ({
        points: Point<U>[],
    } | {
        points: PointLike<T, X, Y>[],
        x: X,
        y: Y,
    }) & {
        iterations?: number,
        tolerance?: number,
    }) {
        const tolerance = typeof params.tolerance === 'number' ? params.tolerance : 1e-6;
        const iterations = typeof params.iterations === 'number' ? params.iterations : 1;
        let points = params.points;
        let reduction = Infinity;
        let x = 'x' in params ? params.x : 0;
        let y = 'y' in params ? params.y : 1;
        for (let it = 0; it < iterations && reduction > 0; it++) {
            const reduced = [points[0]];
            let a = points[0];
            for (let i = 1; i < points.length - 1; i++) {
                const b = points[i], c = points[i + 1];
                const ax = a[x as keyof typeof a] as number;
                const ay = a[y as keyof typeof a] as number;
                const bx = b[x as keyof typeof b] as number;
                const by = b[y as keyof typeof b] as number;
                const cx = c[x as keyof typeof c] as number;
                const cy = c[y as keyof typeof c] as number;
                if (distanceToLine([bx, by], [ax, ay], [cx, cy]) < tolerance) {
                    continue;
                }
                a = points[i];
                reduced.push(points[i]);
            }
            reduced.push(points[points.length - 1]);
            reduction = points.length - reduced.length;
            points = reduced as typeof points;
        }
        return points;
    }
};

export default geometry;