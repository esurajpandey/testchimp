import express from 'express';
import team from '../../controllers/userControllers/team';
import verify_token from '../../middleware/verify_token';
import plan from '../../controllers/userControllers/planAndSubscription/index';

const route = express.Router();

route.patch('/update-team-member/:updateMemberId',verify_token,team.updateMember);
route.patch('/trasnfer-ownership',verify_token,team.transferOwnership);
route.delete('/remove-user/:requestedUserId',verify_token,team.removeFromTeam);
route.get('/members',verify_token,team.members);


export default route;