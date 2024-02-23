import express from 'express';
import test from '../../controllers/assessmentControllers/tests/index';

const route  = express.Router();

route.post('/test',test.create);
route.get('/test/:testId',test.getTest);
route.get('/tests/:limit/:offset',test.getTests);
route.get('/test-types',test.filterAttributes.testType);
route.get('/test-levels',test.filterAttributes.testLevel);
route.get('/search-tests',test.filter);

export default route;