import chalk from "chalk";

export class ColoredLogger {
    error(...data: any) {
        console.error(chalk.red("[-] " + data.toString()));
    }

    success(...data: any) {
        console.error(chalk.green("[+] " + data.toString()));
    }

    warn(...data: any) {
        console.warn(chalk.yellow("[!] " + data.toString()));
    }

    info(...data: any) {
        console.info("[i] " + data.toString());
    }

    debug(...data: any) {
        console.debug(chalk.blue("[*] " + data.toString()));
    }
}
