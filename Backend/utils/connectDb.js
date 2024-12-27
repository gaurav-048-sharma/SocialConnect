import mongoose from "mongoose"


const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("connected to mongoose")
    }catch(error) {
        console.log("not connected")
    }
}

export default connectDb;

