import candidate from "./candidate";
import express from 'express';
import filter from './filterCandidate';

const route  = express.Router();

route.use('/candidate-service',candidate);
route.use('/candidate-service',filter);
export default route;