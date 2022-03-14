import Route from './routes/route';
import ProcessTestRoute from './routes/processTest.route';
// import AuthRoute from './routes/auth.route';
// import CustomerRoute from './routes/customer.route';

export const router: Array<Route> = [
    new ProcessTestRoute(),
    // new AuthRoute(),
    // new CustomerRoute(),
];