import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/dataUri.js"
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        if(!username || !email || !password) {
            return res.status(401).json({
                message: "Please fill in all fields.",
                success:false
            });
        }
        const user = await User.findOne({email});
        if(user) {
            return res.status(401).json({
                message: "Email already exists. Try different",
                success:false
            });
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password:hashedPassword
        });
        return res.status(201).json({
            message: "Account Created Successfully",
            success:false
        });
    }catch(error) {
        console.log(error);
    }
};

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(401).json({
                message: "Please fill in all fields.",
                success:false
            });
        }
        let user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({
                message: "Incorrect Username or Password",
                success:false
            });
        };
        const isPasswordMatch = await bcrypt.compare(password,
             user.password);
        if(!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect Username or Password",
                success:false
            });
        };
        const token =await jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: "1d"});

        //populate each post 
        const populatePosts = await Promise.all(
            user.posts.map(async(postId) =>{
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)) {
                    return post;
                }
                return null;
            })

        )
        
        user = {
            _id:user._id,
            username:user.username,
            email:user.email,
            profilePicture:user.profilePicture,
            bio:user.bio,
            followers:user.followers,
            following:user.following,
            posts:populatePosts
        }

        
        return res.cookie('token', token, {
            httpOnly:true,
            sameSite: "strict",
            maxAge:10*24*60*60*1000
        }).json({
            message: `Logged In Successfully: Welcome ${user.username}`,
            success:true,
            user
        })


    }catch (error) {
        console.log(error);
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly:true,
            sameSite: "strict",
            maxAge: 0
        }).json({
            message: "Logged Out Successfully",
        })
    }catch(error) {
        console.log(error);
    }
}

export const getProfile   = async(req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).select("-password");
        if(!user) {
            return res.status(404).json({message: "User Not Found"})
        }
        return res.status(200).json({
            user,
            success:false
        });
    }catch(error) {
        console.log(error);
    }
}


// export const editProfile = async (req, res) =>{
//     try {
//         const userId = req.id;
//         const {bio, gender} = req.body;
//         const profilePicture = req.file;
//         let cloudResponse;
//         if(profilePicture) {
//             const fileUri = getDataUri(profilePicture);
//             const cloudResponse = await cloudinary.uploader.upload(fileUri);
//             // return res.status(400).json({message: "Please upload a profile picture"})
//         }
//         const user = await User.findById(userId);
//         if(!user) {
//             return res.status(404).json({
//                 message: "User Not Found",
//                 success: true
//             })
//         }
//         if(bio) user.bio = bio;
//         if(gender) user.gender = gender;
//         if(profilePicture) user.profilePicture = cloudResponse.secure_url;

//         await user.save();

//         return res.status(200).json({
//             message: "User Profile Updated",
//             success: true,
//             user
//         })
//     }catch(error) {
//         console.log(error);
//     }
// }

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        };
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({_id: {$ne:req.id}}).select("-password");
        if(!suggestedUsers) {
            return res.status(400).json({
                message: "Currently do not have any users",
                success: true
            })
        };
        return res.status(200).json({
            success: true,
            users:suggestedUsers
        })
    } catch (error) {
        console.log(error)
    }
}

export const followOrUnfollow = async(req,res) => {
    try {
        const followingPerson = req.id;  //meri id
        const goingTOFollow = req.params.id; //shivani  ki id

        if(followingPerson === goingTOFollow) {
            return res.status(400).json({
                message: "you cannot follow/unfollow",
                success:false
            })
        }

        const user = await User.findById(followingPerson);
        const targetUser = await User.findById(goingTOFollow);

        if(!user || !targetUser) {
            return res.status(400).json({
                message: "User not Found",
                success:false
            })
        }

        //now to check whether i have to follow or  unfollow
        const isFollowing = user.following.includes(goingTOFollow);
        if(isFollowing) {
            //unfollow logic
            await Promise.all([
                User.updateOne({_id:followingPerson}, {$pull:{following:goingTOFollow}}),
                User.updateOne({_id:goingTOFollow}, {$pull:{followers:followingPerson}})
            ]);
            return res.status(200).json({
                message: "unfollowed successfully",
                success:true
            })

        }else {
            //follow logic
            await Promise.all([
                User.updateOne({_id:followingPerson}, {$push:{following:goingTOFollow}}),
                User.updateOne({_id:goingTOFollow}, {$push:{followers:followingPerson}})
            ]);
            return res.status(200).json({
                message: "followed successfully",
                success:true
            })
        }
    } catch (error) {
        console.log(error)
    }
}