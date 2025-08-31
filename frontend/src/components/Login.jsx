import React from 'react'
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const Login = () => {

    const {setShowLogin, axios, setToken, navigate} = useAppContext();

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async (e) => {

        e.preventDefault();

        try{
            if( state == "login"){
                const {data} = await axios.post("/api/user/login" ,{
                    email, 
                    password
                });

                if( data.success){
                    toast.success(data.message);
                    navigate("/");
                    setToken(data.token);
                    localStorage.setItem("token", data.token);
                    setShowLogin(false);
                }
                else{
                    toast.error(data.message);
                }
            }
            else{
                const {data} = await axios.post("/api/user/register" ,{
                    name,
                    email, 
                    password
                });

                if( data.success){
                    toast.success(data.message);
                    navigate("/");
                    setToken(data.token);
                    localStorage.setItem("token", data.token);
                    setShowLogin(false);
                }
                else{
                    toast.error(data.message);
                }
            }
        }
        catch(err){
            toast.error(err.message);
        }

    } 

  return (
    <div className=' fixed top-0 bottom-0 right-0 left-0 z-100 flex items-center text-sm text-gray-600 bg-black/50'
    onClick={() => {
        setShowLogin(false);
    }}
    >

       <form className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white relative"
       onSubmit={onSubmitHandler}
       onClick={(e) => {
        e.stopPropagation();
       }}
       >
            <p className="text-2xl font-medium m-auto">
                <span className=" text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="Enter your name" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                </div>
            )}
            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Email" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="password" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
            </div>
            {state !== "register" && 
                <p className=' text-right px-8'>
                    <span onClick={() => {
                        navigate("/forgot-password");
                        setShowLogin(false);
                    }} className="text-primary cursor-pointer text-right absolute right-9">Forgot Password?</span>
                </p>
            }
            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                </p>
            ) : (
                <p className=' mt-3'>
                    Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                </p>
            )}
            <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {state === "register" ? "Create Account" : "Login"}
            </button>
        </form>

    </div>
  )
}

export default Login