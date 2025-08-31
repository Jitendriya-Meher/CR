import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Car from "../models/Car.js";
import transporter from "../configs/nodemailer.js";

// generate token
const generateToken = (userId) => {

    const payload = userId;

    return jwt.sign(
        payload,
        process.env.JWT_SECRET, 
    );

}

export const registerUser = async (req, res) => {

    try{

        const {name, email, password} = req.body;

        if( !name || !email || !password){
            return res.json({
                success: false,
                message: "fill all the fileds"
            });
        }

        if( password.length < 8){
            return res.json({
                success: false,
                message: "Pasword should be atleast 8 characters"
            });
        }

        const userExists = await User.findOne({
            email
        });

        if( userExists){
            return res.json({
                success: false,
                message: "User already exists"
            });
        }

        const hasedPassword = await bcrypt.hash( password, 10);

        const user = await User.create({
            name,
            email,
            password: hasedPassword 
        });

        const token = generateToken(user._id.toString());

        return res.json({
            success: true,
            message: "User Registed Successfully",
            token
        });

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }

}

export const loginUser = async (req, res) => {

    try{

        const { email, password} = req.body;

        if( !email || !password){
            return res.json({
                success: false,
                message: "fill all the fileds"
            });
        }

        const user = await User.findOne({
            email
        });

        if( !user){
            return res.json({
                success: false,
                message: "User doesn't exists"
            });
        }

        const isMatch = await bcrypt.compare( password, user.password);

        if( !isMatch){
            return res.json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const token = generateToken(user._id.toString());

        return res.json({
            success: true,
            message: "User Login Successfully",
            token
        });

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }

}

export const getUserData = async(req, res) => {

    try{

        const {user} = req;

        return res.json({
            success: true,
            user,
            "message": "User fetch successfully"
        });

    }
    catch(err){

        return res.json({
            success: false,
            message: err.message
        });

    }
}

export const updateProfile = async(req, res) => {

    try{

        const {_id} = req.user;
        const {name, email} = req.body;

        await User.findByIdAndUpdate(_id, {
            name,
            email
        });

        return res.json({
            success: true,
            "message": "User Updated successfully"
        });

    }
    catch(err){

        return res.json({
            success: false,
            message: err.message
        });

    }
}

export const changePassword = async (req, res) => {
    try {

        const {oldPassword, newPassword} = req.body;
        const id = req.user._id;

        if( !oldPassword || !newPassword ){
            return res.json({
                message: "Please fill in all fields", 
                success: false
            });
        }

        const user = await User.findById( id );

        // console.log('user',user);

        const isMatch = await bcrypt.compare( oldPassword ,user.password);

        if( !isMatch){
            return res.json({
                message: "Please enter your correct old password", 
                success: false
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.save();

        return res.json({
            success: true,
            message: "Password Updated Successfully"
        });

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }
}

export const getCars = async(req, res) => {

    try{

        const cars = await Car.find({
            isAvaliable: true
        });

        return res.json({
            success: true,
            cars,
            "message": "Cars fetch successfully"
        });

    }
    catch(err){

        return res.json({
            success: false,
            message: err.message
        });

    }
}

export const sendResetOtp = async ( req, res) => {

    try{

        const {email} = req.body;

        if( !email ){
            return res.json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findOne({
            email: email
        });

        if( !user){
            return res.json({
                success: false,
                message: "User not Found",
            })
        }

        const otp = Math.floor( 100000 + Math.random()*90000);

        user.resetOtp = otp;
        user.resetOtpExpiredAt = Date.now() + 15  * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP for resetting your password is ${otp}. Use this OTP to reset your password within 15 minutes.`,
        }

        await transporter.sendMail( mailOptions);

        return res.json({
            success: true,
            message: "Reset OTP Send on Email"
        });

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }

}

export const resetPassword = async ( req, res) => {

    try{

        const {email, otp, newPassword} = req.body;

        if( !email || !otp || !newPassword ){
            return res.json({
                success: false,
                message: "Missing Details"
            })
        }

        const user = await User.findOne({
            email: email
        });

        if( !user ){
            return res.json({
                success: false,
                message: "User Not Found"
            });
        }

        if( user.resetOtp === "" || user.resetOtp != otp ){
            return res.json({
                success: false,
                message: "Invaild OTP",
            })
        }

        if( user.resetOtpExpiredAt < Date.now() ){
            return res.json({
                success: false,
                message: "OTP Expired",
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpiredAt = 0;

        await user.save();

        return res.json({
            success: true,
            message: "Password Reset Successfully",
        });
        
    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }

}