import jwt from "jsonwebtoken"

const isAuthenticated = async (req, res, next) =>{
    try {
        // const token = req.header('x-auth-token')
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json(
                {
                     msg: "Access denied. Not Authenticated",
                     success:false
                });
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if(!decode) {
            return res.status(401).json({
                msg: "invalid",
                success:false
            })
        }
        req.id = decode.userId;
        next();
        } catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }
}

export default isAuthenticated;