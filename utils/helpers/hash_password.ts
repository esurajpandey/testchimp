
const bcrypt = require('bcrypt');

export default async(password : string) =>{
    try{
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password,salt);
        return hashPassword;
    }catch(err){
        return new Error("Something went wrong!");
    }
}