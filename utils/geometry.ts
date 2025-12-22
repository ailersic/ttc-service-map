/** Utility functions for handling 2D geometry */
namespace geometry {

    export type Point = [number, number];

    export function squareDistance(a: Point, b: Point): number {
        const [ax, ay] = a;
        const [bx, by] = b;
        return Math.pow(ax - bx, 2) + Math.pow(ay - by, 2);
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
        const [ax, ay] = a;
        const [bx, by] = b;
        const [px, py] = p;
        const vx = bx - ax;
        const vy = by - ay;
        const ux = ax - px;
        const uy = ay - py;
        let t = -(vx * ux + vy * uy) / (vx * vx + vy * vy);
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
        const result = pl.slice(i0+1,i1+1).map((p): Point => [...p]);
        // Insert first
        result.unshift(f0 === 0 ? [...pl[i0]] : lerp(pl[i0], pl[i0+1], f0));
        // Insert last
        if (f1 > 0 && t0 !== t1) {
            result.push(lerp(pl[i1], pl[i1+1], f1));
        }
        return result;
    }
};

export default geometry;