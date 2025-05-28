import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getDataUri from "../db/dataUri.js";
import cloudinary from "../db/cloudinary.js";
import { Post } from "../models/postModel.js";


export const register=async(req,res)=>{
    try {
        const {username,email,password}=req.body;

        if(!username ||!email||!password){
            res.status(401).json({success:false,message:"Somthis went wrong ,Please fill all fields"})
        }
        const hashpassword= await bcrypt.hash(password,10)
        const user= await User({username,email,password:hashpassword});

        await user.save();
        res.status(200).json({message:"User created successfully",success:true,user});

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
              success: false,
              message: "Email already exists",
            });
          }
        console.log(error.message)
    }
}


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    // User not found
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Incorrect password
    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) {
      return res.status(401).json({ message: "Incorrect password", success: false });  // Changed to 401
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    // Populate posts
    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      follower: user.follower,
      following: user.following,
      posts: populatedPosts.filter(Boolean),  // Ensure no null posts are included
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

  

export const logout=(req,res)=>{
    try {
        res.cookie('token',"" ,{maxage:0}).json({message:"Logout Succefully",success:true})
    } catch (error) {
        console.log(error.message)
    }
}

export const getProfile=async(req,res)=>{
    try {
        const userId=req.params.id;

        const user= await User.findById(userId).populate({path:"posts",createdAt:-1}).populate('bookmarks')

        return res.status(200).json({success:true,user})
    } catch (error) {
        console.log(error.message)
    }
}

export const editProfile=async(req,res)=>{
    try {
        const userId=req.id;
        const {bio,gender}=req.body;
        const profilePicture=req.file;

        let cloudeResponse;

        if(profilePicture){
            const fileUri= getDataUri(profilePicture);
            cloudeResponse= await cloudinary.uploader.upload(fileUri)
        }
        const user= await User.findById(userId);
        if(!user){
            return res.status(401).json({message:"User not found" , success:false})
        };
        if(bio) user.bio=bio;
        if(gender) user.gender=gender;
        if(profilePicture) user.profilePicture=cloudeResponse.secure_url;

        await user.save();
        return res.status(200).json({message:"Profile updated" , success:true,user})


    } catch (error) {
        console.log(error.message)
    }
}

export const suggestedUsers=async(req,res)=>{
    try {
        const suggestedUsers= await User.find({_id:{$ne:req.id}}).select("-password");

        if(!suggestedUsers){
            return res.status(400).json({message:"Currently do not have any users",success:false})
        }

        return res.status(200).json({success:true,users:suggestedUsers})
    } catch (error) {
        console.log(error.message)
    }
}

export const followOrUnfollow=async(req,res)=>{
      
    try {
        const followKarneWala=req.id;
        const jiskoFollowKrunga=req.params.id;

        if(followKarneWala==jiskoFollowKrunga){
            return res.status(401).json({message:"You Cannot Follow/Unfollow Your Self",success:false})
        }

        const user= await User.findById(followKarneWala);
        const targetUser= await User.findById(jiskoFollowKrunga);

        if(!user || !targetUser){
            return res.status(401).json({message:"User Not Found" ,success:false})

        }

        const isFollowing=  user.following.includes(jiskoFollowKrunga);

        if (isFollowing) {
            //unfollow logic

            await Promise.all([                                         //for managing two users
                User.updateOne({_id:followKarneWala},{$pull:{following:jiskoFollowKrunga}}),
                User.updateOne({_id:jiskoFollowKrunga},{$pull:{followers:followKarneWala}}),
            ])
            return res.status(200).json({success:true,message:"Unfollow Successfully"})
        } else {
            //follow logic

            await Promise.all([                                         //for managing two users
                User.updateOne({_id:followKarneWala},{$push:{following:jiskoFollowKrunga}}),
                User.updateOne({_id:jiskoFollowKrunga},{$push:{followers:followKarneWala}}),
            ])
            return res.status(200).json({success:true,message:"Follow Successfully"})

        }

    } catch (error) {
        console.log(error.message)
    }
}

