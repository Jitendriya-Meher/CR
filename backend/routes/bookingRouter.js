import express from "express";
import { changeBooingStatus, checkAvailabilityOfCar, createBooking, deleteUserBookings, getOwnerBookings, getUserBookings } from "../controllers/bookingController.js";
import protect from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post("/check-availabilty", checkAvailabilityOfCar);
bookingRouter.post("/create", protect, createBooking);
bookingRouter.get("/user", protect, getUserBookings);
bookingRouter.post("/user/delete", protect, deleteUserBookings);
bookingRouter.get("/owner", protect, getOwnerBookings);
bookingRouter.post("/change-status", protect, changeBooingStatus);

export default bookingRouter;