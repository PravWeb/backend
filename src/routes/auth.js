import express from "express";
import { validateSignupData , validateLoginData} from "../utils/validation.js";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";


const router = express.Router();
router.use(express.json())

router.post("/signup", async (req, res) => {
  try {
    validateSignupData(req.body);

    /** take email username password 
        
            validate the data 
        
            // encryption of data 
        
            //save the data by creating a new instance in user model
            
            */

    const { userName, emailId, password } = req.body;

    

    const existingUser = await User.findOne({ emailId });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "EMAIL_ALREADY_EXISTS",
      });
    }

    // encrypt the password

    const hashPassword = await bcrypt.hash(password, 10);

    // console.log(hashPassword);

    const user = new User({
      userName,
      emailId,
      password: hashPassword,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "user created successfully!",
    });
  } catch (err) {
    //   console.error(err); // always log internally

    if (
      err.message === "INVALID_USERNAME" ||
      err.message === "INVALID_EMAIL" ||
      err.message === "WEAK_PASSWORD"
    ) {
      return res.status(400).json({
        success: false,
        error: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: "INTERNAL_SERVER_ERROR",
    });
  }
});

// router.post("/login", async(req, res) => {
//   try {
//     /**
//      * take email and password from req.body
//      * validate that is lowercase and is that
//      * if that email is not in correct format we throw error
//      *
//      *
//     */

//     console.log(req.body.emailId);
    
    

//     const { emailId, password } = req.body;
//          validateLoginData(req.body);
         
//         const user = await User.findOne({emailId});

//         if(!user){
//             throw new Error("Invalid Credential!");
//         }
//     // console.log(user);

//         const isValidPassword = await user.validatePassword(password);

//         // console.log(isValidPassword);
        

//         if(isValidPassword){
//             const token = await user.getJWT();
//             res.status(200).json({message:"user successfully logged" , data : token});
//         } else {
//            throw new Error("Invalid credentials");
//         }


//   } catch (err) {
//     res.status(400).send("something went wrong");
//   }
// });




router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    validateLoginData(req.body); // your custom validation

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "USER_NOT_FOUND",
      });
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        error: "INVALID_CREDENTIALS",
      });
    }

    const token = await user.getJWT();

    res.status(200).json({
      success: true,
      message: "User successfully logged in",
      token,      
    });
  } catch (err) {
    console.error(err); // log internally
    res.status(500).json({
      success: false,
      error: "INTERNAL_SERVER_ERROR",
    });
  }
});

export default router;
