"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const processTest_route_1 = __importDefault(require("./routes/processTest.route"));
// import AuthRoute from './routes/auth.route';
// import CustomerRoute from './routes/customer.route';
exports.router = [
    new processTest_route_1.default(),
    // new AuthRoute(),
    // new CustomerRoute(),
];
