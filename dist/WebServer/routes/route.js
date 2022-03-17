"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class Route {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    getRouter() {
        return this.router;
    }
}
exports.default = Route;
