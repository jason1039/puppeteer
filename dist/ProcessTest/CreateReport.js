"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
var Report;
(function (Report) {
    class Excel {
        constructor(data) {
            this.workbook = new exceljs_1.default.Workbook();
            this.workbook.creator = 'CBI';
            this.workbook.lastModifiedBy = 'CBI';
            this.workbook.created = new Date();
            this.workbook.modified = new Date();
            this.workbook.lastPrinted = new Date();
            this.data = data;
            this.WriteData(this.ComputeDistribution(this.RemoveDifferenceValue(this.GetEfficientValue(this.data))), this.CreateWorkSheet("RequestSpeed", "6666FF"), "RequestSpeed");
            this.WriteData(this.GetOrtherData(), this.CreateWorkSheet("OrtherInfomation", "66FF66"), "OrtherInfomation");
            this.WriteData(this.data, this.CreateWorkSheet("Detail", "FF0000"), "Detail");
        }
        GetOrtherData() {
            let result = [];
            result.push({
                ItemName: "請求失敗總數",
                ItemValue: this.GetInvalidValue(this.RemoveDifferenceValue(this.data)).length.toString()
            });
            result.push({
                ItemName: "伺服器崩潰人數",
                ItemValue: this.GetStartCrashNumber(this.RemoveDifferenceValue(this.data)).toString()
            });
            return result;
        }
        GetEfficientValue(data) {
            return data.filter(i => i.ReactionTime < 150000);
        }
        GetInvalidValue(data) {
            return data.filter(i => i.ReactionTime >= 150000);
        }
        GetStartCrashNumber(data) {
            let temp = Math.floor(data.length * 0.04);
            let tempCount = 0;
            data.forEach((item, index) => {
                if (item.ReactionTime >= 150000)
                    tempCount++;
                else
                    tempCount = 0;
                if (tempCount == temp)
                    return index;
            });
            return 0;
        }
        //刪除可能誤差值
        RemoveDifferenceValue(data) {
            let temp = Math.floor(data.length * 0.015);
            for (let i = 0; i < temp; i++) {
                data.shift();
                data.pop();
            }
            return data;
        }
        ComputeDistribution(data) {
            let count = Math.min(25, data.length);
            let temp = data.length / count;
            data.sort((a, b) => a.ReactionTime - b.ReactionTime);
            let result = [];
            for (let i = 0; i < count; i++) {
                result.push({
                    Segment: `第${i + 1}區段`,
                    Time: data.splice(0, Math.round(temp * i) - Math.round(temp * (Math.max(0, i - 1)))).reduce((prev, curr) => prev + curr.ReactionTime, 0) / 1000
                });
            }
            return result;
        }
        CreateWorkSheet(WorkSheetName, TabColor) {
            return this.workbook.addWorksheet(WorkSheetName, { properties: { tabColor: { argb: TabColor } } });
        }
        WriteData(data, WorkSheet, TableName) {
            let columns = [];
            let values = [];
            Object.keys(data[0]).forEach(i => { columns.push({ name: i, filterButton: false }); });
            data.forEach(i => values.push(Object.values(i)));
            WorkSheet.addTable({ name: TableName, ref: "A1", headerRow: true, totalsRow: false, columns: columns, rows: values });
        }
        GetExcelBuffer() {
            return __awaiter(this, void 0, void 0, function* () {
                this.ComputeDistribution(this.data);
                return Buffer.from(yield this.workbook.xlsx.writeBuffer());
            });
        }
    }
    Report.Excel = Excel;
})(Report = exports.Report || (exports.Report = {}));
