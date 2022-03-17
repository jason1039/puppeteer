"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const app_1 = require("../app");
const debug_1 = __importDefault(require("debug"));
const debug = (0, debug_1.default)('maabackend:server');
const http = __importStar(require("http"));
var Server;
(function (Server) {
    class Api {
        constructor() {
            this.port = process.env.PORT || "8080";
            app_1.app.set('port', this.port);
            this.server = http.createServer(app_1.app);
            this.ServerSetting();
        }
        ShowRunningHref() {
            console.log(`Api is running on :http://localhost:${this.port}`);
        }
        ServerSetting() {
            this.server.listen(this.port.toString(), () => {
                this.ShowRunningHref();
            });
            this.server.on("error", this.onError);
            this.server.on("listening", () => {
                this.onListening(this.server);
            });
        }
        onError(error) {
            if (error.syscall !== 'listen')
                throw error;
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
        onListening(server) {
            let addr = server.address();
            let bind = typeof addr === `string` ? `pipe ${addr}` : `port ${addr === null || addr === void 0 ? void 0 : addr.port}`;
            debug(`Listening on ${bind}`);
        }
    }
    Server.Api = Api;
})(Server = exports.Server || (exports.Server = {}));
