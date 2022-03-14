import ExcelJS from 'exceljs';
export namespace Report {
    export class Excel {
        private workbook: ExcelJS.Workbook = new ExcelJS.Workbook();
        private data: { StartTime: string, EndTime: string, ReactionTime: number }[];
        constructor(data: { StartTime: string, EndTime: string, ReactionTime: number }[]) {
            this.workbook.creator = 'CBI';
            this.workbook.lastModifiedBy = 'CBI';
            this.workbook.created = new Date();
            this.workbook.modified = new Date();
            this.workbook.lastPrinted = new Date();
            this.data = data;
            let ws = this.CreateWorkSheet("Infomation", "FF0000");
            this.WriteData(this.data, ws, "Infomation");
        }
        private CreateWorkSheet(WorkSheetName: string, TabColor: string): ExcelJS.Worksheet {
            return this.workbook.addWorksheet(WorkSheetName, { properties: { tabColor: { argb: TabColor } } })
        }
        private WriteData(data: Array<any>, WorkSheet: ExcelJS.Worksheet, TableName: string): void {
            let columns: ExcelJS.TableColumnProperties[] = [];
            let values: Array<any> = [];
            Object.keys(data[0]).forEach(i => {
                columns.push({
                    name: i,
                    filterButton: false
                });
                values.push(Object.values(data[0]));
            });
            WorkSheet.addTable({
                name: TableName,
                ref: "A1",
                headerRow: true,
                totalsRow: false,
                columns: columns,
                rows: values
            });
        }
        public async GetExcelBuffer(): Promise<ExcelJS.Buffer> {
            return this.workbook.xlsx.writeBuffer();
        }
    }
}