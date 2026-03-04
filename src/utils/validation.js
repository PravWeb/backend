import validator from "validator";

const validateSignupData = (data)=>{
    const {userName, emailId , password} = data;

    if(!data){
        throw new Error("Invalid Request Body")
    }

  if (!userName || !validator.isLength(userName.trim(), { min: 3, max: 30 })) {
    throw new Error("INVALID_USERNAME");
  }

  if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("INVALID_EMAIL");
  }

  if (!password || !validator.isStrongPassword(password)) {
    throw new Error("WEAK_PASSWORD");
  }
    

}

const validateLoginData = (data)=>{
  const {emailId, password} = data;

 if(!emailId || !validator.isEmail(emailId)){
    throw new Error(!emailId ? "EMAIL_REQUIRED":"INVALID_EMAIL")
 } else if(!password || !validator.isStrongPassword(password)){
  throw new Error(!password? "PASSWORD_REQUIRED":"INVALID_PASSWORD");
 }
  
}

export {validateSignupData, validateLoginData} ;