import "dotenv/config"; // load dotenv first to use it every file not get undefined error, declare only once. 
import express from "express";
import connectDB from "./config/database.js";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import communityRouter from "./routes/community.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/community",communityRouter);




app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

connectDB().then(() => {
    console.log("connection is established");
    app.listen(PORT,"0.0.0.0", () => console.log(`App is live on ${PORT}`)
    )
}).catch((err) => {
    console.log("DB is not connected");

})

