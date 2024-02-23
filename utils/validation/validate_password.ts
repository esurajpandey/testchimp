const isValidPassword = (password : string) =>{
    if(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{12,})/.test(password)) 
        return true;
    return false;
}

export {
    isValidPassword
}