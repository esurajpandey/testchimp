import express from 'express';
const route = express.Router();
import subscription from '../../controllers/userControllers/planAndSubscription';

route.get('/plans',subscription.getPlans);
route.get('/plan/:planId',subscription.getPlan);
route.get('/subscription',subscription.subscription);
route.get('/checkout',subscription.checkout);
route.get('/verify-payment',subscription.verifyPayment);

export default route;
