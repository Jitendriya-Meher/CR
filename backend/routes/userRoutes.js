import express from "express";
import { changePassword, getCars, getUserData, loginUser, registerUser, resetPassword, sendResetOtp, updateProfile } from "../controllers/userController.js";
import protect from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/data", protect, getUserData);

userRouter.get("/cars", getCars);

userRouter.post("/send-reset-otp", sendResetOtp);
userRouter.post("/reset-password", resetPassword);

userRouter.post("/update", protect, updateProfile);
userRouter.post("/change-password", protect ,changePassword);

export default userRouter;