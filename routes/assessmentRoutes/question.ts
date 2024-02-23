import express from 'express';
import question from '../../controllers/assessmentControllers/questions/index';

const route = express.Router();

route.post('/question',question.createQuestion);
route.get('/question/:questionId',question.getQuestion);
route.get('/questions/:limit/:offset',question.getQuestions);
route.get('/search-questions/:limit/:offset',question.search);
export default route;