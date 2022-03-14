import { app } from '../app';
import Debug from 'debug'
const debug = Debug('maabackend:server');
import * as http from 'http';

export namespace Server {
    export class Api {
        private port: string = process.env.PORT || "8080";
        private server: http.Server;
        constructor() {
            app.set('port', this.port);
            this.server = http.createServer(app);
            this.ServerSetting();
        }
        private ShowRunningHref(): void {
            console.log(`Api is running on :http://localhost:${this.port}`);
        }
        private ServerSetting(): void {
            this.server.listen(this.port.toString(), (): void => {
                this.ShowRunningHref();
            });
            this.server.on("error", this.onError);
            this.server.on("listening", () => {
                this.onListening(this.server);
            });
        }
        private onError(error: NodeJS.ErrnoException): void {
            if (error.syscall !== 'listen') throw error;

            let bind = typeof this.port === 'string' ? `Pipe ${this.port}` : `Port ${this.port}`;

            switch (error.code) {
                case "EACCES":
                    console.error(`${bind} requires elevated provoleges`);
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(bind + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        }
        private onListening(server: http.Server): void {
            let addr = server.address();
            let bind = typeof addr === `string` ? `pipe ${addr}` : `port ${addr?.port}`;
            debug(`Listening on ${bind}`);
        }
    }
}