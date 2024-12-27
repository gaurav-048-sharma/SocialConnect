import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";


export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) {
            return res.status(400).json({
                message: "Image is required",
                success: false,
            });
        }

        // Image upload
        const optimizedImageBuffer = await sharp(image.buffer) // Fixed: use `image.buffer`
            .resize({ width: 800, height: 800, fit: "inside" })
            .toFormat("jpeg", { quality: 80 })
            .toBuffer();

        // Buffer to data URI
        const fileUrl = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;

        // Upload to Cloudinary
        const cloudResponse = await cloudinary.uploader.upload(fileUrl);

        if (!cloudResponse.secure_url) {
            return res.status(500).json({
                message: "Image upload failed",
                success: false,
            });
        }

        // Create new post
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId,
        });

        // Update user's post list
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save(); // Fixed: Save the user instance
        }

        // Populate author details (excluding password)
        await post.populate({paths:"author", select:"-password"}).execPopulate();

        return res.status(200).json({
            message: "New post added",
            post,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};


// export const addNewPost = async (req, res) => {
//     try {
//         const {caption} = req.body;
//         const image = req.file;
//         const authorId = req.id;

//         if(!image) {
//             return res.status(400).json({
//                 message: "Image required"
//             })
//         };
//         //image upload
//         const optimizedImageBuffer = await sharp(image.Buffer)
//         .resize({width:800,height:800, fit:"inside"})
//         .toFormat('jpeg', {quality:80})
//         .toBuffer();
//         // buffer to data uri
//         const fileUrl = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
//         const cloudResponse = await cloudinary.uploader.upload(fileUrl);
//         const post = await Post.create({
//             caption,
//             image:cloudResponse.secure_url,
//             author:authorId
//         });
//         const user = await User.findById(authorId);
//         if(user) {
//             user.posts.push(post._id);
//             await User.save();
//         }
//         await post.populate({path:'author',select:"-password"})

//         return res.status(200).json({
//             message: "New post added",
//             post,
//             success:true
//         })
//     } catch (error) {
//         console.log(error)
//     }
// }

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt:-1})
        .populate({path:'author', select:'username, profilePicture'})
        .populate({
            path:'comments', 
            sort:{createdAt:-1},
            populate: {
                path:'author',
                select:'username profilePicture',
            }
        })
        return res.status(200).json({
            posts,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
};

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({author:authorId}).sort({createdAt:-1}).populate({
            path:'author',
            select:'username, profilePicture'
        }).populate({
            path:'comments', 
            sort:{createdAt:-1},
            populate: {
                path:'author',
                select:'username profilePicture',
            }
        })
        return res.status(200).json({
            posts,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

export const likePost = async (req, res) => {
    try {
        const likeUserId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message: "Post not found", success:false});

        //like login started
        await post.updateOne({$addToSet:{likes: likeUserId}});
        await post.save();

        //implementing socket.io for real time notification

        return res.status(200).json({
            message:"Post Liked",
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

export const dislikePost = async (req, res) => {
    try {
        const dislikeUserId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message: "Post not found", success:false});

        //like login started
        await post.updateOne({$pull:{dislike: dislikeUserId}});
        await post.save();

        //implementing socket.io for real time notification

        return res.status(200).json({
            message:"Post disliked",
            success:true
        })
    } catch (error) {
        console.log(error)
    }
};

export const addComment = async (req,res) => {
    try {
        const postId = req.params.id;
        const commentUserId = req.id;

        const {text} = req.body;
        const post = await Post.findById(postId);
        if(!test) return res.status(400).json({message:"Text is required" , success:false});

        const comment = await Comment.create({
            text,
            author:commentUserId,
            post:postId
        }).populate({
            path:'author',
            select:"username, profilePicture"
        });
        post.comments.push(comment._id);
        await post.save();
        return res.status(20``).json({
            message:"Comment Added",
            comment,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

export const getCommentsOfPost = async (req,res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({post:postId}).populate('author', 'username, profilePicture');

        if(!comments) return res.status(404).json({
            message:"No comments found for this post",
            success:false
        })

        return res.status(200).json({
            success:true,
            comments
        })
    } catch (error) {
        console.log(error)
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message: "Post not found", success:false});

        //check if the logged-in user is the one to delete
        if(post.author.toString() !== authorId) return res.status(403).json({message:"Unauthorized"});

        //delete post
        await Post.findByIdAndDelete(postId);

        //remove the postId from user post
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        //delete associated comments
        await Comment.deletMany({post:postId});

        return res.status(200).json({
            success:true,
            message: 'Post deleted'
        })
    } catch (error) {
        console.log(error)
    }
}

export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId)
        if(!post) return res.status(404).json({message: "Page not found", success: false})

        const user = await User.findById(authorId);
        if(user.bookmarks.includes(post._id)) {
            //already bookmarked ---> rmove from bookmark
            await user.updateOne({$pull:{bookmarks:post._id}});
            user.save();
            return res.status(200).json({type:'unsaved', message:"Post removed from bookmark", success:true})
        }else {
            //need to bookmark
            await user.updateOne({$addToSet:{bookmarks:post._id}});
            user.save();
            return res.status(200).json({type:'saved', message:"Post bookmarked", success:true})
        }
    } catch (error) {
        console.log(error)
    }
}