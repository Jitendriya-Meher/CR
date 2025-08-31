import React, { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets, dummyCarData } from '../assets/assets'
import CarCard from '../components/CarCard';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Cars = () => {

    const [searchParams] = useSearchParams();

    const pickupLocation = searchParams.get('pickupLocation');
    const pickupDate = searchParams.get('pickupDate');
    const returnDate = searchParams.get('returnDate');

    const {cars, axios} = useAppContext();
    
    const isSearchData = pickupLocation && pickupDate && returnDate;

    const [input, setInput] = useState("");

    const [filteredCars, setFilteredCar] = useState([]);

    const applyFilter = async () => {

        try{

            if( input==""){
                setFilteredCar(cars);
                return null;
            }

            const filtered = cars.slice().filter((car) => (
                car.brand.toLowerCase().includes(input.toLowerCase()) || car.model.toLowerCase().includes(input.toLowerCase()) || car.category.toLowerCase().includes(input.toLowerCase()) || car.transmission.toLowerCase().includes(input.toLowerCase())
            ));

            setFilteredCar(filtered);
        }
        catch(err){
            toast.error(err.message);
        }
    }

    const searchCarAvailability = async () => {

        try{
            const {data} = await axios.post("/",{
                location: pickupLocation,
                pickupDate,
                returnDate
            });

            if( data.success){
                setFilteredCar(data.availableCars);

                if( data.availableCars.length == 0){
                    toast.error("No Cars available");
                }

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
        isSearchData && searchCarAvailability;
    },[]);

    useEffect(() => {
        cars.length>0 && !isSearchData && applyFilter();
    },[input, cars]);

  return (
    <div>

        <div className=" flex flex-col items-center py-20 bg-light max-md:px-4">

            <Title
                title={"Available Cars"}
                subTitle={"Browse our selection of premium vehicles available for your next adventure"}
            />

            <div className=" flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow">

                <img src={assets.search_icon} className=' w-4.5 h-4.5 mr-2' alt="" />

                <input type="text" 
                    placeholder='Search by make, model, or feature'
                    className=' w-full h-full outline-none text-gray-500'
                    onChange={(e) => {
                        setInput(e.target.value);
                    }}
                    value={input}
                />

                <img src={assets.filter_icon} className=' w-4.5 h-4.5 mr-2' alt="" />

            </div>

        </div>

        <div className=" px-6 md:px-16 lg:px-24 xl:px-32 mt-10">

            <p className=' text-gray-500 xl:px-20 max-w-7xl mx-auto pb-4'>
                Showing {filteredCars.length} Cars
            </p>

            <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">

            {
                filteredCars.map((car, index) => (
                    <div className="" key={index}>
                        <CarCard
                            car={car}
                        />
                    </div>
                ))
            }

            </div>

        </div>

    </div>
  )
}

export default Cars