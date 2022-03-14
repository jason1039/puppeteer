import { Request, Response } from 'express';
import { Example } from '../../ProcessTest/index';
class ProcessTestController {
    async echo(req: Request, res: Response) {
        let buffer = await Example();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Report.xlsx');
        res.send(buffer);
        res.end();
    }
}

export default ProcessTestController;