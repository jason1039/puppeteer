"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProcessTest_1 = __importDefault(require("../controllers/ProcessTest"));
const route_1 = __importDefault(require("./route"));
class AuthRoute extends route_1.default {
    constructor() {
        super();
        this.processTestController = new ProcessTest_1.default();
        this.setRoutes();
    }
    setRoutes() {
        this.router.get('/', this.processTestController.echo);
    }
}
exports.default = AuthRoute;
