import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {

    try{

        const token = req.headers.authorization;

        if( !token){
            return res.json({
                success: false,
                message: "Not authorized"
            });
        }

        const userId = jwt.decode( 
            token,
            process.env.JWT_SECRET
        );

        if( !userId){
             return res.json({
                success: false,
                message: "Not authorized"
            });
        }

        const user = await User.findById(userId).select("-password");

        req.user = user;

        next();

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }

}

export default protect;