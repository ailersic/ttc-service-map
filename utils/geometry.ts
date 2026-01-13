/** Utility functions for handling 2D geometry */
namespace geometry {

    // useful: https://paulbourke.net/geometry/pointlineplane/    

    export type Point<T extends any[] = []> = [number, number, ...T];
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

    export function midpoint(...pl: Point[]): Point {
        return pl.reduce(([mx, my], [px, py]) => [mx + px / pl.length, my + py / pl.length], [0, 0]);
    }

    export function distanceToLine(p: Point, a: Point, b: Point, clampA: boolean = true, clampB: boolean = true) {
        return distance(p, snapToLine(p, a, b, clampA, clampB).point);
    }

    export function intersection(
        a: Point, b: Point, c: Point, d: Point,
        clampA?: boolean, clampB?: boolean, clampC?: boolean, clampD?: boolean,
    ): Point | undefined {
        const [ax, ay] = a;
        const [bx, by] = b;
        const [cx, cy] = c;
        const [dx, dy] = d;
        const denom = (ax - bx) * (cy - dy) - (cx - dx) * (ay - by);
        if (denom === 0) {
            return undefined;
        }

        const ab = ((dx - cx) * (ay - cy) - (dy - cy) * (ax - cx)) / denom;
        const cd = ((bx - ax) * (ay - cy) - (by - ay) * (ax - cx)) / denom;

        if (
            (ab < 0 && clampA) ||
            (ab > 1 && clampB) ||
            (cd < 0 && clampC) ||
            (cd > 1 && clampD)
        ) {
            return undefined
        }

        return [
            ax + ab * (bx - ax),
            ay + ab * (by - ay),
        ];
    }

    export function lerp(a: Point, b: Point, t: number): Point {
        const [ax, ay] = a;
        const [bx, by] = b;
        const vx = bx - ax;
        const vy = by - ay;
        return [
            ax + vx * t,
            ay + vy * t,
        ];
    }

    export function bezier(points: Point[], t: number): Point {
        if (points.length === 1) {
            return points[0];
        }
        // B_n([P0, ..., Pn], t) = B_n-1([Q0, ..., Qn-1], t) where Qi = lerp(Pi, Pi+1, t)
        return bezier(points.reduce(({ result, prev }, p) => {
            if (prev === undefined) {
                return { result, prev: p };
            }
            result.push(lerp(prev, p, t));
            return { result, prev: p };
        }, { result: [] as Point[], prev: undefined as Point | undefined }).result, t);
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

    // <0 counterclockwise
    // =0 collinear
    // >0 clockwise
    export function turn(a: Point, b: Point, c: Point) {
        const [ax, ay] = a;
        const [bx, by] = b;
        const [cx, cy] = c;
        return ((by - ay) * (cx - bx)) - ((bx - ax) * (cy - by));
    }

    // =1     straight
    // (1,0)  obtuse
    // =0     right
    // (0,-1) acute
    // =-1    anti-straight
    export function cosTurnAngle(a: Point, b: Point, c: Point) {
        const [ax, ay] = a;
        const [bx, by] = b;
        const [cx, cy] = c;
        const vx = bx - ax;
        const vy = by - ay;
        const ux = cx - bx;
        const uy = cy - by;
        const dotuv = vx * ux + vy * uy;
        return dotuv / (distance(a, b) * distance(b, c));
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

    export function smoothenPolyLine(points: Point[], density?: number) {
        density = Math.abs(density || 1);
        const smoothened = [];
        for (let i = 0; i < points.length - 1; i++) {
            smoothened.push(points[i]);

            const [ax, ay] = i > 0 ? points[i - 1] : points[i];
            const [bx, by] = points[i];
            const [cx, cy] = points[i + 1];
            const [dx, dy] = (i < points.length - 2) ? (points[i + 2]) : (points[i + 1]);

            const abx = bx - ax;
            const aby = by - ay;
            const ablen = Math.sqrt(abx * abx + aby * aby);
            const bcx = cx - bx;
            const bcy = cy - by;
            const bclen = Math.sqrt(bcx * bcx + bcy * bcy);
            const cdx = dx - cx;
            const cdy = dy - cy;
            const cdlen = Math.sqrt(cdx * cdx + cdy * cdy);

            const bdirx = (ablen ? (abx / ablen) : 0) + bcx / bclen;
            const bdiry = (ablen ? (aby / ablen) : 0) + bcy / bclen;
            const bdirlen = Math.sqrt(bdirx * bdirx + bdiry * bdiry);
            const cdirx = bcx / bclen + (cdlen ? (cdx / cdlen) : 0);
            const cdiry = bcy / bclen + (cdlen ? (cdy / cdlen) : 0);
            const cdirlen = Math.sqrt(cdirx * cdirx + cdiry * cdiry);

            const cpOff = bclen / 5;

            const cp1: Point = [
                bx + bdirx / bdirlen * cpOff,
                by + bdiry / bdirlen * cpOff,
            ];
            const cp2: Point = [
                cx - cdirx / cdirlen * cpOff,
                cy - cdiry / cdirlen * cpOff,
            ];

            const n = Math.round(bclen / density);
            for (let ti = 1; ti < n; ti++) {
                const p = bezier([[bx, by], cp1, cp2, [cx, cy]], ti / n);
                // const [px, py] = p;
                smoothened.push(p);
            }
        }
        smoothened.push(points[points.length - 1]);
        return smoothened;
    }
};

export default geometry;