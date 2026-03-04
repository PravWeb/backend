import mongoose from "mongoose";
import validate from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({
  userName:{
    type: String,
    unique: true,
    minLength:3,
    maxLength:16,
    required:true,
    trim: true,
    lowercase:true,

  },
  emailId:{
    type:String,
    required: [true, "Email is required!"],
    lowercase:true,
    unique: true,
    trim: true,
    validate(value){
        if(!validate.isEmail(value)){
          throw new Error("email is not valid");  
        }
      }
    
  },
  password:{
    type: String,
    required: true,
    validate(value){
      if(!validate.isStrongPassword(value)){
        throw new Error("Password Must be strong")
      }
    }
  },
  photoUrl:{
    type:String,
    default: "https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fmilitaryhealthinstitute.org%2Fabout%2Fblank-profile-picture-png%2F&ved=0CBYQjRxqFwoTCIj8h56V25IDFQAAAAAdAAAAABAi&opi=89978449",


  },
  about:{
    type:String,
    minLength:20,
    maxLength:50,
    default: "This is default about of the user!",
  }



},{timestamps: true})


userSchema.methods.getJWT = async function(){
  const token = await jwt.sign({_id: this._id}, process.env.SECRET_JWT, {expiresIn:"7d"});
  return token
}


userSchema.methods.validatePassword = async function(passwordInputByUser){
  const hashedPassword = this.password;
  const isValidPassword = await bcrypt.compare(passwordInputByUser, hashedPassword)

  return isValidPassword;
}



const User = mongoose.model("User",userSchema);

export default User;