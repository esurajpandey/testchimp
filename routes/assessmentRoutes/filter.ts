import express from "express";
import jobRole from "../../controllers/assessmentControllers/filters/jobRole/index";
import languages from "../../controllers/assessmentControllers/filters/languages/index";
import questionsFilter from '../../controllers/assessmentControllers/filters/questionFilter/index';

const route = express.Router();

route.post('/job-role',jobRole.createJobRole);
route.get('/job-role',jobRole.jobRole);
route.get('/job-roles',jobRole.jobRoles);

route.get('/language',languages.getLanguages);
route.post('/language',languages.create);

route.post('/category',questionsFilter.createCategory);
route.post('/question-type',questionsFilter.createQuestionType);

route.get('/question-categories',questionsFilter.getCategory);
route.get('/question-types',questionsFilter.getType);

export default route;