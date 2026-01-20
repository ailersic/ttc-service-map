export default class Logger {
    static info(...data: any[]) {
        console.log(`[${new Date().toISOString()}] -`, ...data);
    }
};