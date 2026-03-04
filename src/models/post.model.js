import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
    content:{
        type:String,
        required: true,
        trim:true,
        maxlength:500,
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    }

},{timestamps:true});

const Entry = mongoose.model("Entry", entrySchema);

export default Entry;