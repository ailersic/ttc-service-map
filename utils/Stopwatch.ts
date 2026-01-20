export default class Stopwatch {
    private start: number;
    private lapStart: number;

    constructor() {
        this.start = Date.now();
        this.lapStart = this.start;
    }

    elapsed() {
        return Date.now() - this.lapStart;
    }

    totalElapsed() {
        return Date.now() - this.start;
    }

    lap() {
        const now = Date.now();
        const dt = now - this.lapStart;
        this.lapStart = now;
        return dt;
    }

    reset() {
        const now = Date.now();
        const dt = now - this.start;
        this.lapStart = this.start = now;
        return dt;
    }
}