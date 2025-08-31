import React from 'react'
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const ForgotPassword = () => {

    const {setShowLogin, axios, navigate} = useAppContext();

    const [state, setState] = React.useState("step1");
    const [otp, setOtp] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async (e) => {

        e.preventDefault();

        try{
            if( state == "step1"){
                const {data} = await axios.post("/api/user/send-reset-otp" ,{
                    email
                });

                if( data.success){
                    toast.success(data.message);
                    setState("step2");
                }
                else{
                    toast.error(data.message);
                }
            }
            else{

                if( password != confirmPassword){
                    return toast.error("password and confirm password doesn,t matches");
                }

                const {data} = await axios.post("/api/user/reset-password" ,{
                    otp,
                    email, 
                    newPassword: password
                });

                if( data.success){
                    toast.success(data.message);
                    navigate("/");
                    setShowLogin(true);
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
    <div className=' flex items-center text-sm text-gray-600 min-h-[90vh]'
    onClick={() => {
        setShowLogin(false);
    }}
    >

       <form className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-2xl border border-gray-200 bg-white relative"
       onSubmit={onSubmitHandler}
       >
            <p className="text-2xl font-medium m-auto">
                <span className=" text-primary">{state === "step1" ? "Send" : "Reset"}</span> {state === "step1" ? "OTP" : "Password"}
            </p>
            {state === "step1" && (
                <div className="w-full ">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Email" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
                </div>
            )}
            { state !== "step1" && <div className="w-full ">
                <p>OTP</p>
                <input onChange={(e) => setOtp(e.target.value)} value={otp} placeholder="Enter the OTP" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
            </div>}
            { state !== "step1" && <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="New Password" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
            </div>}
            { state !== "step1" && <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} placeholder="Confirm New Password" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
            </div>}

            <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {state === "step1" ? "Send OTP" : "Reset Password"}
            </button>
        </form>

    </div>
  )
}

export default ForgotPassword