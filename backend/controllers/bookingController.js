import Booking from "../models/Booking.js"
import Car from "../models/Car.js";

const checkAvailability = async (car, pickupDate, returnDate) => {

    const bookings = await Booking.find({
        car,
        pickupDate:{
            $lte: returnDate
        },
        returnDate: {
            $gte: pickupDate
        }
    });

    return bookings.length === 0;

}

export const checkAvailabilityOfCar = async (req, res) => {

    try{

        const {location, pickupDate, returnDate} = req.body;

        const cars = await Car.find({
            isAvaliable: true,
            location
        });

        const availableCarPromises = cars.map( async (car) => {

            const isAvailable = await checkAvailability(car._id, pickupDate, returnDate);

            return {...car._doc, isAvailable: isAvailable};
        });

        let availableCars = await Promise.all( availableCarPromises);

        availableCars = availableCars.filter( car => car.isAvailable == true);

        return res.json({
            success: true,
            availableCars
        });

    }
    catch(err){
         return res.json({
            success: false,
            message: err.message
        });
    }

}


export const createBooking = async (req, res) => {

    try{

        const {_id} = req.user;

        const {car, pickupDate, returnDate} = req.body;

        const isAvailable = await checkAvailability( car, pickupDate, returnDate);

        if( !isAvailable){
            return res.json({
                success: false,
                message: "Car is not Available"
            });
        }

        const carData = await Car.findById(car);

        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);

        const noOfDays = Math.ceil((returned - picked)/ (1000*60*60*24));

        const price = carData.pricePerDay * noOfDays;

        await Booking.create({
            car,
            owner: carData.owner,
            user: _id,
            pickupDate,
            returnDate,
            price
        });
        
        return res.json({
            success: true,
            message: "Booking created successfully"
        });

    }
    catch(err){
         return res.json({
            success: false,
            message: err.message
        });
    }

}

export const getUserBookings = async (req, res) => {

    try{

        const {_id} = req.user;


        const bookings = await Booking.find({
            user: _id
        }).populate("car").sort({
            createdAt: -1
        });
        
        return res.json({
            success: true,
            bookings: bookings
        });

    }
    catch(err){
         return res.json({
            success: false,
            message: err.message
        });
    }

}

export const deleteUserBookings = async (req, res) => {

    try{

        const {id} = req.body;

        const bookings = await Booking.findByIdAndDelete(id);
        
        return res.json({
            success: true,
            message : "Booking Deleted Successfully"
        });

    }
    catch(err){
         return res.json({
            success: false,
            message: err.message
        });
    }

}

export const getOwnerBookings = async (req, res) => {

    try{

        if( req.user.role !== 'owner'){
            return({
                success: false,
                message: "Unauthorized"
            });
        }

        const {_id} = req.user;

        const bookings = await Booking.find({
            owner: _id
        }).populate("car user").select("-user.password").sort({
            createdAt: -1
        });
        
        return res.json({
            success: true,
            bookings
        });

    }
    catch(err){
         return res.json({
            success: false,
            message: err.message
        });
    }

}

export const changeBooingStatus = async (req, res) => {

    try{

        const {bookingId, status} = req.body;

        const {_id} = req.user;

        const booking = await Booking.findById( bookingId );

        if( booking.owner.toString() != _id.toString()){
            return res.json({
                success: false,
                message: "Unauthorized"
            });
        }

        booking.status = status;
        await booking.save();
        
        return res.json({
            success: true,
            message: "Status Updated"
        });

    }
    catch(err){
        return res.json({
            success: false,
            message: err.message
        });
    }

}