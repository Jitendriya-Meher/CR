import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets';
import Loader from '../components/Loader';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const CarDetails = () => {

    const {id} = useParams();
    const navigate = useNavigate();

    const {cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate, currency} = useAppContext();

    const [car, setCar] = useState(null);

    const getCar = async () => {

        const car = cars.find(car => car._id === id);

        setCar(car);

    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        try{

            console.log('booking', id);

            const {data} = await axios.post("/api/bookings/create",{
                car: id,
                pickupDate,
                returnDate
            });

            console.log('booking', data);

            if( data.success){
                toast.success(data.message);
                navigate("/my-bookings");
            }
            else{
                toast.error(data.message);
            }
            
        }
        catch(err){
            toast.error(err.message);
        }

    }

    useEffect(() => {

        getCar();

    },[id, cars]);

  return car ? (
    <div className=' px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>

        <button className=' flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'
        onClick={() => {
            navigate(-1);
        }}
        >

            <img src={assets.arrow_icon} className=' rotate-180 opacity-65' alt="" />

            Back to all Cars

        </button>

        <div className=" grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

            <div className=" lg:col-span-2">

                <img src={car.image} className=' w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md' alt="" />

                <div className=" space-y-6">

                    <div className="">

                        <h1 className=' text-3xl font-bold'>
                            {car.brand} {car.model}
                        </h1>

                        <p className=' text-gray-500 text-lg'>
                            {car.category} •  {car.year}
                        </p>

                    </div>

                    <hr className=' border-borderColor my-6' />

                    <div className=" grid grid-cols-2 sm:grid-cols-4 gap-4">

                    {
                        [
                            {icon: assets.users_icon, text: `${car.seating_capacity} Seats`},
                            {icon: assets.fuel_icon, text: `${car.fuel_type}`},
                            {icon: assets.car_icon, text: `${car.transmission}`},
                            {icon: assets.location_icon, text: `${car.location}`},
                            
                        ].map(({icon,text}) => (
                            <div className=" flex flex-col items-center bg-light p-4 rounded-lg" key={text}>

                            <img src={icon} className=' h-5 mb-2' alt="" />

                            {text}

                            </div>
                        ))
                    }

                    </div>

                    <div className="">

                        <h1 className=' text-xl font-medium mb-3'>
                            Description
                        </h1>
                        <p className=' text-gray-500'>
                            {car.description}
                        </p>
                    </div>

                    <div className="">

                        <h1 className=' text-xl font-medium mb-3'>
                            Features
                        </h1>
                        <ul className=' grid grid-cols-1 sm:grid-cols-2 gap-2'>

                        {
                            [
                                "360 Camera",
                                "GPS",
                                "Rear View Mirror,",
                                "Bluetooth",
                                "Heated Seats"
                            ].map((text) => (
                                <li key={text} className='flex items-center text-gray-500'>

                                <img src={assets.check_icon} alt="" className=' h-4 mr-2' />

                                {text}

                                </li>
                            ))
                        }

                        </ul>
                    </div>

                </div>

            </div>

            <form className=" shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500"
            onSubmit={handleSubmit}
            >

                <p className=' flex items-center justify-between text-2xl text-gray-800 font-semibold'>
                    {currency} {car.pricePerDay} <span className=' text-base text-gray-400 font-normal'> per day</span>
                </p>

                <hr className=' border-borderColor my-6'/>

                <div className=" flex flex-col gap-2">
                
                    <label htmlFor="pickup-date">
                        Pickup Date
                    </label>
                    <input type="date" 
                        className=' border border-borderColor px-3 py-2 rounded-lg'
                        required
                        id='pickup-date'
                        min={new Date().toISOString().split("T")[0]}
                        value={pickupDate}
                        onChange={(e) => {
                            setPickupDate(e.target.value);
                        }}
                    />
                    
                </div>

                <div className=" flex flex-col gap-2">
                
                    <label htmlFor="return-date">
                        Return Date
                    </label>
                    <input type="date" 
                        className=' border border-borderColor px-3 py-2 rounded-lg'
                        required
                        id='return-date'
                        min={new Date().toISOString().split("T")[0]}
                        value={returnDate}
                        onChange={(e) => {
                            setReturnDate(e.target.value);
                        }}
                    />
                    
                </div>

                <button className=' w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer'
                >
                    Book Now
                </button>

                <p className=' text-center text-sm'>
                    No credit card required to reserve
                </p>

            </form>

        </div>

    </div>
  ):(
   <Loader/>
  )
}

export default CarDetails