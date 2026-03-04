import express from "express";
import Entry from "../models/post.model.js";
import userAuth from "../middleware/userAuth.js";
import User from "../models/user.model.js";

const router = express.Router();


router.post("/entry",userAuth,async(req,res)=>{
    try{
        const {content} = req.body;

        if(!content || !content.trim()){
            return res.status(400).json({ message: "Content is required!"});
        }
        
        const entry = new Entry({
            content,
            author: req.user._id,
        })

        await entry.save();

        res.status(201).json(entry);

    } catch(err){
        res.status(500).json({message: "Server error"});
    }
});

router.patch("/entry/edit/:id",userAuth, async(req,res)=>{
    try{
            /**
             * user to edit their content only 
             * so validate user must edit content only
             * 
             */

            const loggedInUser = req.user;
            const {content} = req.body;
            const {id} = req.params;

            // console.log(id);
            

            if(!content ||!content.trim()){
                return res.status(400).json({ message: "Content is required" });
            }

            if(content.length>500){
            return res.status(400).json({message:"Content must not exceed 500 characters!"});
            }

        const entry = await Entry.findById(id);

        if(!entry){
            return res.status(404).json({message: "Post not found!"});
        }

        if(entry.author.toString() !== loggedInUser._id.toString()){
                return res.status(403).json({message: "unathorized access!"});
        }

        entry.content = content;

        await entry.save();

    
        res.status(200).json({
            success:true,
            data: entry
        });
            

        }catch(err){
            res.status(400).json({message: "server error"});
        }
});



router.delete("/entry/delete/:id",userAuth, async(req,res)=>{
    try{
        /**
         * post id if id available then we delete it 
         * 
         */

        const {id} = req.params;
        const loggedInUser = req.user;

        const entry = await Entry.findById(id);
        
        if(!entry || entry.author.toString() !== loggedInUser._id.toString()){
            return res.status(404).json({message: "Post not found!" })
        }

        const deletedEntry = await entry.deleteOne();

        if(!deletedEntry){
            return res.status(404).json({message: "something went wrong!"});
        }

        res.status(200).json({success: true, message:"entry deleted successfully!"});




        }catch(err){
            res.status(400).json({message: "server error"});
        }
});



router.get("/feed",userAuth,async(req, res)=>{
    try{
        const loggedInUser = req.user;

        if(!loggedInUser){
            return res.status(400).json({message: "Invalid Credentials!"});
        }

        //  rate limiting

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit)||15;

        limit = limit > 30 ? 30 : limit;

        const skip = (page -1)* limit;

        const userFeed = await Entry.find({})
        .select("content  author createdAt")
        .populate("author" ,"userName photoUrl")
        .skip(skip)
        .limit(limit);
       
  

        res.status(200).json({data: userFeed, success: true});


    } catch(err){
        console.error(err)
        res.status(400).json({message: "Server error"});
    }
});

router.get("/feed/author", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const entries = await Entry.find({ author: loggedInUser._id })
      .select("content createdAt")
      .sort({ createdAt: -1 })
      .populate("author", "name"); // optional

    return res.status(200).json({
      success: true,
      data: entries
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});


export default router