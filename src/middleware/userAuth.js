import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "please login!" });
    }

    const token = authHeader.split(" ")[1];

    if(!token){
      return res.status(404).send("please login!");
    }

    const decodedObj = jwt.verify(token, process.env.SECRET_JWT);

    const user = await User.findById(decodedObj._id).select("userName photoUrl about");

    if (!user) {
      return res.status(401).json({ message: "Invalid credential" });
    }

    req.user = user;
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid credential" });
  }
};

export default userAuth;