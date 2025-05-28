import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
    username:{type:String,require:true},
    email:{type:String,require:true,unique: true},
    password:{type:String,require:true},
    profilePicture:{type:String , default:" "},
    bio:{type:String , default:" "},
    gender:{type:String , enum:["male","femail"]},
    follower:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    following:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    posts:[{type:mongoose.Schema.Types.ObjectId,ref:"post"}],
    bookmarks:[{type:mongoose.Schema.Types.ObjectId,ref:"post"}],
})


export const User=mongoose.model("User",userSchema)