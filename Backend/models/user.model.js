import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        enum: [
            'male',
            'female',
            'other'
        ]
    },
    followers:[ {
        type: mongoose.Schema.Types.ObjectId, 
        default: [],
        ref: 'User',

    },],
    following:[ {
        type: mongoose.Schema.Types.ObjectId, 
        default: [],
        ref: 'User',
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: 'Post',
    }],
    bookmarks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            default: [],
            ref: 'Post',
        }
    ]
}, {timestamps:true});


export const User = mongoose.model("User", userSchema);
