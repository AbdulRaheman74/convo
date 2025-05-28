import sharp from "sharp";
import cloudinary from "../db/cloudinary.js";
import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import { Comment } from "../models/commentModel.js";
import { getRecieverSocketId,io } from "../socket/socketio.js";
export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Image Is Required" });
    }

    // Optimize image
    const optimizeImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // Convert buffer to Data URI
    const fileUri = `data:image/jpeg;base64,${optimizeImageBuffer.toString(
      "base64"
    )}`;
    const cloudeResponse = await cloudinary.uploader.upload(fileUri);

    // Create post and await it
    const post = await Post.create({
      caption,
      image: cloudeResponse.secure_url,
      author: authorId,
    });

    // Add post ID to user's posts
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res
      .status(200)
      .json({ message: "Post Created Successfully", post, success: true });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};


export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Fix: should be `createdAt`, not `createAt`
      .populate({ path: "author", select: "username profilePicture" }) // ✅ No comma between fields
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    return res.status(200).json({ success: true, posts });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Failed to fetch posts." });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const autherId = req.id;
    const posts = await Post.find({ auther: autherId })
      .sort({ createdAt: -1 })
      .populate({ path: "auther", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });
    return res.status(200).json({ success: true, posts });
  } catch (error) {
    console.log(error.message);
  }
};

export const likePosts = async (req, res) => {
  try {
    const likeKarneWaleUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(401)
        .json({ success: false, message: "Post Not Found" });
    }

    //like logic

    await post.updateOne({ $addToSet: { likes: likeKarneWaleUserKiId } });
    await post.save();

    //implimentin socit io for realtime notification

    const user = await User.findById(likeKarneWaleUserKiId).select('username profilePicture')
    const postOwnerId=post.author.toString();

    if(postOwnerId !== likeKarneWaleUserKiId){
      //emit notification
      const notification={
        type:'like',
        userId:likeKarneWaleUserKiId,
        userDetails:user,
        postId,
        message:"Your post liked"
      }
      const postOwnerSocketId=getRecieverSocketId(postOwnerId)
      io.to(postOwnerSocketId).emit('notification',notification)

    }

    return res.status(200).json({ message: "Post Like", success: true });
  } catch (error) {
    console.log(error.message);
  }
};
export const disLikePosts = async (req, res) => {
  try {
    const likeKarneWaleUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(401)
        .json({ success: false, message: "Post Not Found" });
    }

    //like logic
     await post.updateOne({ $pull: { likes: likeKarneWaleUserKiId } });
        await post.save();

    //implimentin socit io for realtime notification

    const user = await User.findById(likeKarneWaleUserKiId).select('username profilePicture')
    const postOwnerId=post.author.toString();

    if(postOwnerId !== likeKarneWaleUserKiId){
      //emit notification
      const notification={
        type:'dislike',
        userId:likeKarneWaleUserKiId,
        userDetails:user,
        postId,
        message:"Your post dislike"
      }
      const postOwnerSocketId=getRecieverSocketId(postOwnerId)
      io.to(postOwnerSocketId).emit('notification',notification)

    }

    // await post.updateOne({ $pull: { disLikes: likeKarneWaleUserKiId } });
    // await post.save();

    //implimentin socit io for realtime notification

    return res.status(200).json({ message: "Post dislike", success: true });
  } catch (error) {
    console.log(error.message);
  }
};

export const addComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id; // assuming auth middleware sets this
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please add some comment text",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = await Comment.create({
      text,
      author: authorId,
      post: postId,
    });

    // ✅ This will now work if your schema defines `author` with `ref: 'User'`
    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error("Error adding comment:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getCommentsOfPosts=async(req,res)=>{
  try {
    const postId = req.params.id;

    const comments=await Comment.find({post:postId}).populate({path:'author',select:'username,profilePicture'});

    if(!comments){
      return res.status(400).json({message:"No Comments Found" , success:false})
    }

    return res.status(200).json({success:true,comments})
    
  } catch (error) {
    console.log(error.message)
  }
};


export const deletepost = async (req, res) => {
  try {
    const postId = req.params.id;
    const autherId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "post not found", success: false });
    }

    if (post.author.toString() !== autherId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    await Post.findByIdAndDelete(postId);

    const user = await User.findById(autherId);
    user.posts = user.posts.filter(id => id.toString() !== postId);
    await user.save();

    await Comment.deleteMany({ post: postId });

    return res.status(200).json({ message: "Post Deleted", success: true });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
}


export const bookmarkPost=async(req,res)=>{
  try {
    const postId=req.params.id;
    const authorId=req.id;

    const post = await Post.findById(postId);

    if(!post){
      return res.status(400).json({success:false,message:"Post Not Found"})
    }

    const user = await User.findById(authorId);
    if(user.bookmarks.includes(post._id)){
      //already bookmark then it we have to remove it
      await user.updateOne({$pull:{bookmarks:post._id}});
      await user.save();
      return res.status(200).json({success : true ,type:'unsaved',message:"Post Remove from Bookmark"});

    }else{
      //add a bookmark
      await user.updateOne({$addToSet:{bookmarks:post._id}});
      await user.save();
      return res.status(200).json({success : true ,type:'saved',message:"Post Bookmark"});
    }
  } catch (error) {
    console.log(error.message)
  }
}
