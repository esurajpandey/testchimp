import express from "express";
import team from "../../controllers/userControllers/team";
import user from "../../controllers/userControllers/user";
import validator from "../../middleware/validator";
import verify_token from "../../middleware/verify_token";
import validation_schema from "../../utils/validation/validation_schema";

const route = express.Router();

route.post('/register',validator(validation_schema.email),user.register);
route.post('/login',validator(validation_schema.login),user.login);
route.post('/save-user-details',verify_token,validator(validation_schema.userDetails),user.saveUserDetails);

route.patch('/password',validator(validation_schema.set_password),user.setPassword);

route.get('/user-info',verify_token,user.getUser);
route.post('/forgot-password',user.forgetPassword);
route.get('/validate-link/:token',user.validateResetToken);

route.post('/team-member',verify_token,validator(validation_schema.invite_user),team.inviteMember);
route.post('/accept-invitation',verify_token,validator(validation_schema.accept_invitation),team.acceptinvitation);

route.get("/country_code/:query",user.countryCode);
route.get('/ats',user.applicantTracking);


export default route;
