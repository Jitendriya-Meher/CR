import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext';

const CarCard = ({car}) => {

    const navigate = useNavigate();

    const {currency} = useAppContext();

  return (
    <div className=' group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer'
    onClick={() => {
        navigate(`/car/${car._id}`);
        window.scrollTo(0,0);
    }}
    >

        <div className=" relative h-48 overflow-hidden">

            <img src={car.image} className=' w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' alt="" />

            {
                car.isAvaliable && <p className=' absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full z-50'>
                    Available Now
                </p>
            }

            <div className=" absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg z-50">

                <span className=' font-semibold'>
                    {currency}{car.pricePerDay}
                </span>
                <span className=' text-sm text-white/80'>
                    / day
                </span>

            </div>

        </div>

        <div className=" p-4 sm:p-5">

            <div className=" flex justify-between items-start mb-2">

                <div className="">
                    <h3 className=' text-lg font-medium'>
                        {car.brand} {car.model}
                    </h3>
                    <p className=' text-sm text-muted-foreground'>
                        {car.category} • {car.year}
                    </p>
                </div>

            </div>

            <div className=" mt-4 grid grid-cols-2 gap-y-2 text-gray-600">

                <div className=" flex items-center text-sm text-muted-foreground">

                    <img src={assets.users_icon} className=' h-4 mr-2' alt="" />

                    <span>
                        {car.seating_capacity} Seats
                    </span>

                </div>

                <div className=" flex items-center text-sm text-muted-foreground">

                    <img src={assets.fuel_icon} className=' h-4 mr-2' alt="" />

                    <span>
                        {car.fuel_type}
                    </span>
                    
                </div>

                <div className=" flex items-center text-sm text-muted-foreground">

                    <img src={assets.car_icon} className=' h-4 mr-2' alt="" />

                    <span>
                        {car.transmission}
                    </span>
                    
                </div>

                <div className=" flex items-center text-sm text-muted-foreground">

                    <img src={assets.location_icon} className=' h-4 mr-2' alt="" />

                    <span>
                        {car.location}
                    </span>
                    
                </div>

            </div>

        </div>

    </div>
  )
}

export default CarCard