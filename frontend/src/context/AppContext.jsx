import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();
 
export const AppProvider = ({children}) => {

    const navigate = useNavigate();

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [pickupDate, setPickupDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [cars, setCars] = useState([]);

    const currency = "₹";


    const fetchUser = async () => {

        try{
            const {data} = await axios.get("/api/user/data");

            console.log('user', data);

            if( data.success){
                setUser(data.user);
                setIsOwner(data.user.role === "owner");
            }else{
                navigate("/");
            }
        }
        catch(err){
            toast.error(err.message);
        }

    }

    const fetchCars = async () => {

        try{
            const {data} = await axios.get("/api/user/cars");

            console.log('cars', data);

            if( data.success){
                setCars(data.cars);
            }else{
                toast.error(data.message);
            }
        }
        catch(err){
            toast.error(err.message);
        }

    } 

    const logout = async () => {

        try{
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
            setIsOwner(null);
            axios.defaults.headers.common['Authorization'] = "";

            toast.success("Logout Successfully");
        }
        catch(err){
            toast.error(err.message);
        }

    }

    useEffect(() => {

        const token = localStorage.getItem("token");

        setToken(token);

        fetchCars();

    },[]);

    useEffect(() => {

        if( token){

            axios.defaults.headers.common['Authorization'] = `${token}`;

            fetchUser();
        }

    },[token]);

    const value = {
        navigate,
        axios,
        user,
        setUser,
        token,
        setToken,
        isOwner,
        setIsOwner,
        fetchUser,
        showLogin,
        setShowLogin,
        logout,
        fetchCars,
        cars,
        setCars,
        pickupDate,
        setPickupDate,
        returnDate,
        setReturnDate,
        currency
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}

export const useAppContext = () => useContext(AppContext);