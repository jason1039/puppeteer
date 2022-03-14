"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../ProcessTest/index");
class ProcessTestController {
    echo(req, res) {
        index_1.Example();
        res.send("echo");
    }
}
exports.default = ProcessTestController;
