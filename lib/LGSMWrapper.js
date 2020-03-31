const {spawn} = require('child_process');
const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const SCRIPT_SRC = 'https://linuxgsm.sh';

class LGSMWrapper extends EventEmitter {
    basePath = '';
    lgsmPath = '';
    log = '';

    constructor(options) {
        super();
        this.basePath = path.resolve(options.basePath);
        this.lgsmPath = path.join(this.basePath, 'linuxgsm.sh');
    }

    async runCmd(binary, args = [], stdin) {
        const child = spawn(binary, args, {
            cwd: this.basePath,
            shell: true,
            env: {}
        });

        if (stdin) {
            child.stdin.write(stdin, 'UTF-8');
        }

        child.stdout.on("data", (chunk) => {
            chunk = String(chunk);
            this.log += chunk;
            console.log("LGSM:", chunk.trim());
        });
        child.stderr.on("data", (chunk) => {
            console.error("LGSM:", String(chunk).trim());
        });

        return new Promise((resolve, reject) => {
            child.on('exit', resolve);
        });
    }

    async bootstrap() {
        if (!fs.existsSync(this.basePath)) {
            fs.mkdirSync(this.basePath, {recursive: true});
        }

        if (!fs.existsSync(this.lgsmPath)) {
            await this.runCmd('wget', [SCRIPT_SRC, '-O linuxgsm.sh']);
            await this.runCmd('chmod', ["+x", this.lgsmPath]);
            await this.runCmd(this.lgsmPath);
        }
    }

    async getServers() {
        const serverListCsv = fs.readFileSync(path.join(this.basePath, "lgsm", "data", "serverlist.csv"), "UTF-8");
        const gameServers = {};

        for (let line of serverListCsv.split("\n").filter(Boolean)) {
            const [short, long, label] = line.split(",");
            gameServers[long] = {
                label,
                short
            };
        }

        return gameServers;
    }

    async install(servername) {
        const serverExecutable = path.join(this.basePath, servername);
        if (!fs.existsSync(serverExecutable)) {
            await this.runCmd(this.lgsmPath, [servername]);
        }
        await this.runCmd(serverExecutable, ['auto-install']);
    }

    async start(servername) {
        const serverExecutable = path.join(this.basePath, servername);
        if (!fs.existsSync(serverExecutable)) {
            await this.runCmd(this.lgsmPath, [servername]);
        }
        await this.runCmd(serverExecutable, ['start']);
        await this.runCmd(serverExecutable, ['console'], 'Y\n');
    }
}


module.exports = LGSMWrapper;
