import express from 'express';
import candidate from '../../controllers/candidateController/candidate/index';
import assesssmentChecker from '../../middleware/assesssmentChecker';
import verify_token from '../../middleware/verify_token';
const route = express.Router();

route.post('/invite-candidate',verify_token,assesssmentChecker,candidate.inviteCandidate);
route.get('/candidates/:offset',verify_token,candidate.candidates);
route.get('/send-result',candidate.sendResult);

export default route;