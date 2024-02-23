import express from "express";
import update from "../../controllers/userControllers/update";
import validator from "../../middleware/validator";
import verify_token from "../../middleware/verify_token";
import validation_schema from "../../utils/validation/validation_schema";




const route = express.Router();

//update settings
route.patch('/profile',verify_token,validator(validation_schema.profile),update.profile);
route.patch('/change_password',verify_token,validator(validation_schema.change_password),update.changePassword);
route.patch('/change_email',verify_token,validator(validation_schema.change_email),update.changeEmail);
route.patch('/notification',verify_token,validator(validation_schema.notification),update.notification);
route.patch('/my_company',verify_token,validator(validation_schema.my_company),update.company);
route.patch('/assessment_setting',verify_token,validator(validation_schema.assessment_setting),update.assessmentSetting);

export default route;
