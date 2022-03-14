import { Router, IRouter } from 'express';

abstract class Route {
    protected router = Router();
    protected abstract setRoutes(): void;

    public getRouter(): IRouter {
        return this.router;
    }
}

export default Route;