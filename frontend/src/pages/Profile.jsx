import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Profile = () => {

    const {user,axios, setUser} = useAppContext();

    const [email, setEmail] = useState(user?.email);
    const [password, setPassword] = useState("");
    const [name, setName] = useState(user?.name);
    const [oldPassword, setOldPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const onSubmitHandler = async (e) => {

        e.preventDefault();

        try {

            const {data} = await axios.post("/api/user/update",{
                name,
                email
            });

            if( data.success){
                toast.success(data.message);
                setUser({
                    ...user,
                    name,
                    email
                })
            }
            else{
                toast.error(data.message);
            }
            
        } catch (error) {
            toast.error(error.message);
        }

    }

    const onSubmitHandler2 = async (e) => {

        e.preventDefault();

        try {

            if( password != confirmPassword){
                return toast.error("password and confirm password doesn't matches");
            }

            const {data} = await axios.post("/api/user/change-password",{
                oldPassword,
                newPassword: password
            });

            if( data.success){
                toast.success(data.message);
            }
            else{
                toast.error(data.message);
            }
            
        } catch (error) {
            toast.error(error.message);
        }

    }

  return (
    <div className=' flex flex-col items-start text-sm text-gray-600 min-h-[70vh] justify-around md:flex-row gap-10 px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>

        <form className="flex flex-col gap-4 items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-2xl border border-gray-200 bg-white relative"
       onSubmit={onSubmitHandler}
       >
            <p className="text-2xl font-medium m-auto">
                Update <span className=' text-primary'>Profile</span>
            </p>
            <div className="w-full ">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="Name" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                </div>
            <div className="w-full ">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Email" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
                </div>

            <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                Update Profile
            </button>
        </form>

        <form className="flex flex-col gap-4 items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-2xl border border-gray-200 bg-white relative"
       onSubmit={onSubmitHandler2}
       >
            <p className="text-2xl font-medium m-auto">
                <span className=" text-primary">Change</span> Password
            </p>
            <div className="w-full ">
                    <p>Old Password</p>
                    <input onChange={(e) => setOldPassword(e.target.value)} value={oldPassword} placeholder="Old Password" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
                </div>
            <div className="w-full ">
                    <p>New Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="New Password" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
                </div>
            <div className="w-full ">
                    <p>Confirm New Password</p>
                    <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} placeholder="Confirm new password" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
                </div>
            

            <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
                Change Password
            </button>
        </form>

    </div>
  )
}

export default Profile