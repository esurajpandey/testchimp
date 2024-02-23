import { json } from "stream/consumers";

require('dotenv').config();

const isValidEmailPattern =  (email : string) => {

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        return true
    return false
}

const isOrganizationMail = (email : string) => {
    let filterEmail = ['gmail', 'yahoo', 'hotmail', 'outlook'];
    let mailService = email.split("@")[1].split('.');
    if (filterEmail.includes(mailService[0])){
        return false;
    }else{
        return true;
    }
}

const isValidEmail = async (email : string) => {
    const str =  `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${process.env.HUNTER_KEY}`;

    let jsonObj = await fetch(str)
    let res = await jsonObj.json();

    if(res?.data?.result === "deliverable"){
        return true
    }else{
        return false;
    }
}

const validateEmail = async (email : string) => {
    if(isOrganizationMail(email) === false)
        throw {msg : "Personal mails are not accepted",errorCode: 400};
    if(isValidEmailPattern(email) === false)
        throw {msg : "Inavlid email pattern",errorCode : 400};
    if(!await isValidEmail(email))
        throw {msg :"Email does not exists",errorCode : 400}; 

    return true;
}



export {
    isValidEmailPattern,
    isOrganizationMail,
    isValidEmail,
    validateEmail
}

