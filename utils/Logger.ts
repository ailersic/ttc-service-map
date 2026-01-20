export default class Logger {
    static info(...data: any[]) {
        console.info([`[${new Date().toISOString()}] -`, ...data].map(item => ''+item).join(' '));
    }
};