import joi from "joi";

export = {
  login: joi.object({
    email: joi.string().email().lowercase().required(),
    password: joi
      .string()
      .min(5)
      // .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  }),

  email: joi.object({
    email: joi.string().email().required(),
  }),

  userDetails: joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    companyName: joi.string().min(3).required(),
    jobTitle : joi.string(),
    id : joi.string(),
    applicantTrackingSystemId : joi.string(),
    employeeRange : joi.string(),
    planToHire : joi.string(),
    emailUpdate :  joi.boolean(),
    phoneNumber: joi
      .string()
      .min(10)
      .max(13)
      .message("Invalid mobile number")
      .required(),
  }),

  set_password: joi.object({
    password: joi
      .string()
      .min(12)
      .pattern(
        new RegExp(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{12,})/
        )
      )
      .required(),
  }),
  
  invite_user: joi.object({
    email: joi.string().email().required(),
    id : joi.string().required(),
    role: joi
      .string()
      .valid("ADMIN", "NONE", "RECRUITER", "HIRING_MANAGER", "OWNER")
  }),
  change_password: joi.object({
    id : joi.string(),
    oldPassword: joi.string().required(),
    newPassword: joi
      .string()
      .min(12)
      .pattern(
        new RegExp(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{12,})/
        )
      )
      .required(),
  }),
  notification: joi.object({
    candidateAlert: joi.boolean().required(),
    candidateSummary: joi.boolean().required(),
  }),
  profile: joi.object({
    id : joi.string().required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    phoneNumber: joi.string().min(10).max(12).required(),
    language: joi
      .string()
      .valid(
        "Dutch",
        "English",
        "French",
        "Gernman",
        "Italian",
        "Japanse",
        "Portuguese"
      )
  }),
  change_email: joi.object({
    id : joi.string(),
    email: joi.string().email().required(),
    password: joi.string().min(12).required(),
  }),
  my_company: joi.object({
    name: joi.string().required(),
    color: joi.string().required(),
    country: joi.string().required(),
    //logo required
  }),
  accept_invitation: joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    phoneNumber: joi
      .string()
      .min(10)
      .max(13)
      .message("Invalid mobile number")
      .required(),
    id : joi.string(),
    emailUpdate: joi.boolean().required(),
  }),
  assessment_setting: joi.object({
    demographic_details: joi.boolean().required(),
    redirect_candidate: joi.boolean().required(),
    feedback: joi.boolean().required(),
  }),
  plan: joi.object({
    name :  joi.string().required(),
    candidate_count :  joi.number().min(5).required(),
    addition_candidate :  joi.number().required(),
    assessment_count :  joi.number().required(),
    addition_assessment :  joi.number().required(), 
    test_count :  joi.number().required(),
    custom_question_count:  joi.number().required(),
    member_count:  joi.number().required(),
    duration :joi.number().required(),
    price : joi.number().required(),
  }),
  
};
