import ProcessTestController from '../controllers/ProcessTest';
import Route from './route';

class AuthRoute extends Route {
    private processTestController = new ProcessTestController();

    constructor() {
        super();
        this.setRoutes();
    }

    protected setRoutes() {
        this.router.get('/', this.processTestController.echo);
    }
}

export default AuthRoute;