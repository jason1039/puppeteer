const csvToJson = require("convert-csv-to-json");
export namespace Csv {
    export class csv2Json {
        public static Convert(CsvString: string) {
            return csvToJson.csvStringToJson(CsvString);
        }
    }
}