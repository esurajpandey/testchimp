import express from 'express';
import teamFinder from '../../middleware/teamFinder';
import verify_token from '../../middleware/verify_token';
import filterAttributes from '../../controllers/candidateController/candidate/filterAttributes';
const route = express.Router();

route.get('/test-lists',verify_token,teamFinder,filterAttributes.tests);
route.get('/assessment-lists',verify_token,teamFinder,filterAttributes.assessments)
export default route;