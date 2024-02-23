const questionSelectQuery = {
    select : {
        id : true,
        description : true,
        duration : true,
        lookingForAsnwer : true,
        source : true,
        type : {
            select :{
                id : true,
                title : true
            }
        },
        mcq : {
            select : {
                answer : true,
                options : true,
            }
        },
        coding : {
            select : {
                id : true,
                note : true,
            }
        }
    }
}

const feedbackSelectQuery = {
    select :{
        id :  true,
        details : true,
        rating : true,
    }
}

const testAnswerSelectQuery = {
    select : {
        feedback : feedbackSelectQuery,
        finishedAt : true,
        score : true,
        questionAnswer : {
            select : {
                id : true,
                answer : true,
                question : questionSelectQuery
            }
        }
    }
}

const customeQuestionSelector = {
    select : {
        id : true,
        answer : true,
        feedback : feedbackSelectQuery,
        question : questionSelectQuery
    }
}

const antiCheatingSelectQuery = {
    select : {
        id : true,
        deviceUsed : true,
        isAlwaysFullScreen : true,
        isMouseUser : true,
        isOnlyOneIP : true,
        isWebcamEnabled : true,
        location : true,
        snaps : true,
    }
}

const responseSelectQuery = {/*Assessment */
    select : {
        feedback :feedbackSelectQuery,
        testAnswer : testAnswerSelectQuery,
        customeQuestion : customeQuestionSelector
    }
}

const assessmentSelectQuery = {
    select : {
        id :  true,
        name : true,
        isAccomodationForNonFluent : true,
        isAccomodationForAbnormal : true,
        isAntiCheatingEnabled : true,
        extraTime : true,
    }
}


export {
    antiCheatingSelectQuery,
    assessmentSelectQuery,
    responseSelectQuery,
}