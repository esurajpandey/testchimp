import express from 'express';
import userRoutes from './user';
import updateRoutes from './update';
import teamRoutes from './team';
import subscriptionRoute from './plan';
const route  = express.Router();

route.use('/user-service/users',userRoutes);

//update
route.use('/user-service/update',updateRoutes);

//team
route.use('/user-service/team',teamRoutes);

//subscription

route.use('/user-service',subscriptionRoute);
export default route;
