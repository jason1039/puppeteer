import ExcelJS from 'exceljs';
import fs from 'fs';
export namespace Report {
    export class Excel {
        private workbook: ExcelJS.Workbook = new ExcelJS.Workbook();
        private data: RequestInfomation[];
        constructor(data: RequestInfomation[]) {
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
        private GetOrtherData(): { ItemName: string, ItemValue: string }[] {
            let result: { ItemName: string, ItemValue: string }[] = [];
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
        private GetEfficientValue(data: RequestInfomation[]): RequestInfomation[] {
            return data.filter(i => i.ReactionTime < 150000);
        }
        private GetInvalidValue(data: RequestInfomation[]): RequestInfomation[] {
            return data.filter(i => i.ReactionTime >= 150000);
        }
        private GetStartCrashNumber(data: RequestInfomation[]): number {
            let temp: number = Math.floor(data.length * 0.04);
            let tempCount: number = 0;
            data.forEach((item, index) => {
                if (item.ReactionTime >= 150000) tempCount++;
                else tempCount = 0;
                if (tempCount == temp) return index;
            });
            return 0;
        }
        //刪除可能誤差值
        private RemoveDifferenceValue(data: RequestInfomation[]): RequestInfomation[] {
            let temp: number = Math.floor(data.length * 0.015);
            for (let i = 0; i < temp; i++) {
                data.shift();
                data.pop();
            }
            return data;
        }

        private ComputeDistribution(data: RequestInfomation[]): { Segment: string, Time: number }[] {
            let count: number = Math.min(25, data.length);
            let temp: number = data.length / count;
            data.sort((a, b) => a.ReactionTime - b.ReactionTime);
            let result: { Segment: string, Time: number }[] = [];
            for (let i = 0; i < count; i++) {
                result.push({
                    Segment: `第${i + 1}區段`,
                    Time: data.splice(0, Math.round(temp * i) - Math.round(temp * (Math.max(0, i - 1)))).reduce((prev, curr) => prev + curr.ReactionTime, 0) / 1000
                });
            }
            return result;
        }
        private CreateWorkSheet(WorkSheetName: string, TabColor: string): ExcelJS.Worksheet {
            return this.workbook.addWorksheet(WorkSheetName, { properties: { tabColor: { argb: TabColor } } })
        }
        private WriteData(data: Array<any>, WorkSheet: ExcelJS.Worksheet, TableName: string): void {
            let columns: ExcelJS.TableColumnProperties[] = [];
            let values: Array<any> = [];
            Object.keys(data[0]).forEach(i => { columns.push({ name: i, filterButton: false }); });
            data.forEach(i => values.push(Object.values(i)));
            WorkSheet.addTable({ name: TableName, ref: "A1", headerRow: true, totalsRow: false, columns: columns, rows: values });
        }
        public async GetExcelBuffer(): Promise<Buffer> {
            this.ComputeDistribution(this.data);
            return Buffer.from(await this.workbook.xlsx.writeBuffer());
        }
    }
    interface RequestInfomation {
        StartTime: string;
        EndTime: string;
        ReactionTime: number;
    }
}