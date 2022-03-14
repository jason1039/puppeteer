import express from 'express';
import { router } from './router';

const app: express.Application = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//load router
for (const route of router) {
    app.use(route.getRouter());
}

export { app };