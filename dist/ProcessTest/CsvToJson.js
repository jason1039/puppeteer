"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Csv = void 0;
const csvToJson = require("convert-csv-to-json");
var Csv;
(function (Csv) {
    class csv2Json {
        static Convert(CsvString) {
            return csvToJson.csvStringToJson(CsvString);
        }
    }
    Csv.csv2Json = csv2Json;
})(Csv = exports.Csv || (exports.Csv = {}));
