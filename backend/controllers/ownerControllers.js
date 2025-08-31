import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";

export const changeRoleToOwner = async (req, res) => {

    try{

        const {_id} = req.user;

        await User.findByIdAndUpdate( _id , {
            role: "owner"
        });

        return res.json({
            seccess: true,
            message: "Now you can list cars"
        });

    }

    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }

}


export const addCar = async (req, res) => {

    try{

        const {_id} = req.user;

        let car = JSON.parse( req.body.carData);

        const imageFile = req.file;

        const fileBuffer = fs.readFileSync(imageFile.path);

        const uploadResponse = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/cars",
        });

        const imageURL = imagekit.url({
            src: uploadResponse.url,
            transformation: [
                { quality: "auto" },
                { format: "webp" },
                { width: 1280 }
            ]
        });

        const image = imageURL;

        await Car.create({
            ...car,
            owner: _id,
            image
        });

        return res.json({
            success: true,
            message: "Car added successully"
        });

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }

}

export const getCar = async (req, res) => {

    try{

        const {id} = req.body;

        const car = await Car.findById(id);

        return res.json({
            success: true,
            car
        });

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }

}


export const updateCar = async (req, res) => {

    try{

        const {id} = req.params;

        let car = JSON.parse( req.body.carData);

        await Car.findByIdAndUpdate(id,{
            ...car
        });

        return res.json({
            success: true,
            message: "Car Updated successully"
        });

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }

}

export const getOwnerCars = async (req, res) => {

    try{

        const {_id} = req.user;

        const cars = await Car.find({
            owner: _id
        });

        return res.json({
            success: true,
            cars
        });

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }

}

export const toggleCarAvailability = async (req, res) => {

    try{

        const {_id} = req.user;
        const {carId} = req.body;

        const car = await Car.findById(carId);

        if( car.owner.toString() != _id.toString()){
            return res.json({
                message: "Unauthorized",
                success: false
            });
        }

        car.isAvaliable = !car.isAvaliable;

        await car.save();

        return res.json({
            success: true,
            message : "Avilability Toggled"
        });

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }

}

export const deleteCar = async (req, res) => {

    try{

        const {_id} = req.user;
        const {carId} = req.body;

        const car = await Car.findById(carId);

        if( car.owner.toString() != _id.toString()){
            return res.json({
                message: "Unauthorized",
                success: false
            });
        }

        car.owner = null;
        car.isAvaliable = false;

        await car.save();

        return res.json({
            success: true,
            message : "Car Removed Successfully"
        });

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }

}

export const getDashboardData = async (req, res) => {

    try{

        const {_id, role} = req.user;

        if( role != "owner"){
            return res.json({
                message: "Unauthorized",
                success: false
            }); 
        }

        const cars = await Car.find({
            owner: _id
        });

        const bookings = await Booking.find({
            owner: _id
        }).populate("car").sort({
            createdAt: -1
        });

        const pendingBooking = await Booking.find({
            owner: _id,
            status: "pending"
        });

        const completedBookings = await Booking.find({
            owner: _id,
            status: "confirmed"
        });

        const monthlyRevenue = bookings.slice().filter( booking => booking.status === "confirmed").reduce((acc, booking) => acc + booking.price, 0);

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBooking.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0,5),
            monthlyRevenue
        }

        return res.json({
            success: true,
            dashboardData
        });

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }

}