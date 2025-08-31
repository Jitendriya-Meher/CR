import express from "express";
import protect from "../middleware/auth.js";
import { addCar, changeRoleToOwner, deleteCar, getCar, getDashboardData, getOwnerCars, toggleCarAvailability, updateCar } from "../controllers/ownerControllers.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeRoleToOwner);

ownerRouter.post("/car", protect, getCar);
ownerRouter.post("/add-car", upload.single("image"), protect, addCar);
ownerRouter.post("/update-car/:id", protect, updateCar);
ownerRouter.get("/cars", protect, getOwnerCars);
ownerRouter.post("/toggle-car", protect, toggleCarAvailability);
ownerRouter.post("/delete-cars", protect, deleteCar);

ownerRouter.get("/dashboard", protect, getDashboardData);


export default ownerRouter;