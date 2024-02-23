import express  from 'express';
import assessmentRoute from './assessment';
import filterRoute from './filter';
import testRoutes from './test';
import questionRoutes from './question';


const route  = express.Router();
route.use('/assessment-service',assessmentRoute);
route.use('/assessment-service',filterRoute);
route.use('/assessment-service',testRoutes);
route.use('/assessment-service',questionRoutes);

export default route;


