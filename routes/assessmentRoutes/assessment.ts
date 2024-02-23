import verify_token from '../../middleware/verify_token';
import express  from 'express';
import assessment from '../../controllers/assessmentControllers/assessments/index';
import assesssmentChecker from '../../middleware/assesssmentChecker';
import roleVerifier from '../../middleware/roleVerifier';
import teamFinder from '../../middleware/teamFinder';

const route  = express.Router();
route.post('/assessment',verify_token,teamFinder,assessment.create);

route.get('/assessment/:assessmentId',verify_token,assesssmentChecker,assessment.assessment)//to get
route.get('/assessments/:limit/:offset',verify_token,teamFinder,assessment.userAssessments);

route.put('/add-test/:testId/:assessmentId',verify_token,assesssmentChecker,roleVerifier,assessment.addTest);
route.put('/add-question/:questionId/:assessmentId',verify_token,assesssmentChecker,assessment.addQuestion);
route.put('/clone-assessment/:assessmentId',verify_token,assesssmentChecker,assessment.cloneAssessment);

route.patch('/assessment/:assessmentId',verify_token,roleVerifier,assesssmentChecker,assessment.editAssessments);
route.patch('/recover-assessment/:assessmentId',verify_token,roleVerifier,assesssmentChecker,assessment.recoverAssessments);
route.delete('/assessment/:assessmentId/:testId',verify_token,roleVerifier,assesssmentChecker,assessment.removeTest);

export default route;