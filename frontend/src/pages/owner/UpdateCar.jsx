import React, { useEffect, useState } from 'react'
import Title2 from '../../components/owner/Title2';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const UpdateCar = () => {

  const {axios, currency} = useAppContext();
  const {id} = useParams();

  const [image, setImage] = useState(null);

  const [car, SetCar] = useState({
    brand:"",
    model:"",
    year:0,
    pricePerDay:0,
    category:"",
    transmission:"",
    fuel_type: "",
    seating_capacity: 0,
    loaction: "",
    description:""
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit  = async (e) => {

    e.preventDefault();

    if( isLoading){
      return null;
    }

    setIsLoading(true);

    try{

      const {data} = await axios.post("/api/owner/update-car/"+id, {
        carData: JSON.stringify(car)
      });

      if( data.success){
        toast.success(data.message);
        getCar();
      }
      else{
        toast.error(data.message);
      }
    } 
    catch(err){
      toast.error(err.message);
    }

    setIsLoading(false);

  }

  const getCar = async () => {

    try {

        const {data} = await axios.post("/api/owner/car",{
            id
        });

        console.log('car', data);

        if( data.success){
            SetCar(data.car);
            setImage(data?.car?.image);
        }
        else{
            toast.error( data.message);
        }
        
    } catch (error) {
        toast.error(error.message);
    }

  }

  useEffect(() => {

    getCar();

  },[]);

  return (
    <div className=' px-4 py-10 md:px-10 flex-1'>

      <Title2
        title={"Update Car"}
        subTitle={""}
      />

      <form onSubmit={handleSubmit} className=' flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'>

        <div className=" flex items-center gap-2 w-full">

            <img src={image ? image : assets.upload_icon} className=' h-32 rounded cursor-pointer' alt="" />          

        </div>

        <div className=" grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className=" flex flex-col w-full">
              
              <label htmlFor="bnd">
                Brand
              </label>

              <input type="text" id="bnd" 
                placeholder='e.g. BMW, Mercedes, Audi ...'
                className=' px-3 py-2 mt-1 border border-borderColor rounded-md'
                required
                value={car.brand}
                onChange={(e) => {
                  SetCar({
                    ...car, brand:e.target.value
                  })
                }}
              />

          </div>

           <div className=" flex flex-col w-full">
              
              <label htmlFor="mdl">
                Model
              </label>

              <input type="text" id="mdl" 
                placeholder='e.g. XS, E-Class, m4 ...'
                className=' px-3 py-2 mt-1 border border-borderColor rounded-md'
                required
                value={car.model}
                onChange={(e) => {
                  SetCar({
                    ...car, model:e.target.value
                  })
                }}
              />

          </div>

        </div>

        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          <div className=" flex flex-col w-full">
              
              <label htmlFor="year">
                Year
              </label>

              <input type="Number" id="yaer" 
                placeholder='2025'
                className=' px-3 py-2 mt-1 border border-borderColor rounded-md'
                required
                value={car.year}
                onChange={(e) => {
                  SetCar({
                    ...car, year:e.target.value
                  })
                }}
              />

          </div>

           <div className=" flex flex-col w-full">
              
              <label htmlFor="dp">
                Daily Price ({currency})
              </label>

              <input type="Number" id="dp" 
                placeholder='100'
                className=' px-3 py-2 mt-1 border border-borderColor rounded-md'
                required
                value={car.pricePerDay}
                onChange={(e) => {
                  SetCar({
                    ...car, pricePerDay:e.target.value
                  })
                }}
              />

          </div>

           <div className=" flex flex-col w-full">
              
              <label htmlFor="cat">
                Category
              </label>

              <select id="cat"
              value={car.category}
              onChange={(e) => {
                SetCar({
                  ...car, category:e.target.value
                });
              }}
              className=' px-3 py-2 mt-1 border border-borderColor rounded-md cursor-pointer outline-none'
              >
                
                <option value="">
                  Select a category
                </option>
                <option value="Sedan">
                  Sedan
                </option>
                <option value="SUV">
                  SUV
                </option>
                <option value="Van">
                  Van
                </option>

              </select>

          </div>

        </div>


        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          <div className=" flex flex-col w-full">
              
              <label htmlFor="trs">
                Transmission
              </label>

              <select id="trs"
              value={car.transmission}
              onChange={(e) => {
                SetCar({
                  ...car, transmission:e.target.value
                });
              }}
              className=' px-3 py-2 mt-1 border border-borderColor rounded-md cursor-pointer outline-none'
              >
                
                <option value="">
                  Select a Transmission
                </option>
                <option value="Automatic">
                  Automatic
                </option>
                <option value="Manual">
                  Manual
                </option>
                <option value="Semi-Automatic">
                  Semi-Automatic
                </option>

              </select>

          </div>

          <div className=" flex flex-col w-full">
              
              <label htmlFor="ft">
                Fuel Type
              </label>

              <select id="ft"
              value={car.fuel_type}
              onChange={(e) => {
                SetCar({
                  ...car, fuel_type:e.target.value
                });
              }}
              className=' px-3 py-2 mt-1 border border-borderColor rounded-md cursor-pointer outline-none'
              >
                
                <option value="">
                  Select a Fuel Type
                </option>
                <option value="Gas">
                  Gas
                </option>
                <option value="Diesel">
                  Diesel
                </option>
                <option value="Petrol">
                  Petrol
                </option>
                <option value="Electric">
                  Electric
                </option>
                <option value="Hybrid">
                  Hybrid
                </option>

              </select>

          </div>

          <div className=" flex flex-col w-full">
              
              <label htmlFor="sc">
                Seating Capacity
              </label>

              <input type="Number" id="sc" 
                placeholder='4'
                className=' px-3 py-2 mt-1 border border-borderColor rounded-md'
                required
                value={car.seating_capacity}
                onChange={(e) => {
                  SetCar({
                    ...car, seating_capacity:e.target.value
                  })
                }}
              />

          </div>

        </div>

        <div className=" flex flex-col w-full">

              <label htmlFor="loc">
                Location
              </label>

              <select id="loc"
              value={car.loaction}
              onChange={(e) => {
                SetCar({
                  ...car, location:e.target.value
                });
              }}
              className=' px-3 py-2 mt-1 border border-borderColor rounded-md cursor-pointer outline-none'
              >
                
                <option value="">
                  Select a Location
                </option>
                <option value="New York">
                  New York
                </option>
                <option value="Los Angles">
                  Los Angles
                </option>
                <option value="Houston">
                  Houston
                </option>
                <option value="Chicago">
                  Chicago
                </option>

              </select>

        </div>

        <div className="">

              <div className=" flex flex-col w-full">
              
              <label htmlFor="year">
                Description
              </label>

              <textarea id="yaer" 
                placeholder='description of the car'
                className=' px-3 py-2 mt-1 border border-borderColor rounded-md'
                required
                value={car.description}
                onChange={(e) => {
                  SetCar({
                    ...car, description:e.target.value
                  })
                }}
                rows={5}
              ></textarea>

          </div>

        </div>

        <button className=' flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer'>

          <img src={assets.tick_icon} alt="" />

          {
            isLoading ? "Listing..." : "Update Car"
          }

        </button>

      </form>

    </div>
  )
}

export default UpdateCar