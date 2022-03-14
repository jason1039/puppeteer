import { Request, Response } from 'express';
import { Example } from '../../ProcessTest/index';
class ProcessTestController {
    echo(req: Request, res: Response) {
        Example();
        res.send("echo");
    }
}

export default ProcessTestController;