import joi from "joi";

export = {
    createAssessment : joi.object({
        name :  joi.string().required(),
        jobRoleId : joi.string().required(),
        languageId : joi.string().required(),
        id : joi.string()
    })
}