import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import MyBookings from './pages/MyBookings';
import Footer from './components/Footer';
import Layout from './pages/owner/Layout';
import Dashborad from './pages/owner/Dashborad';
import AddCar from './pages/owner/AddCar';
import ManageCars from './pages/owner/ManageCars';
import ManageBooking from './pages/owner/ManageBooking';
import Login from './components/Login';
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext';
import UpdateCar from './pages/owner/UpdateCar';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';

const App = () => {

  const {showLogin, setShowLogin} = useAppContext();
  const isOwnerPath = useLocation().pathname.startsWith("/owner");

  return (
    <>

      <Toaster/>

     { 
        !isOwnerPath && <Navbar
          setShowLogin={setShowLogin}
        />
      }

      {
        showLogin && <Login
          setShowLogin={setShowLogin}
        />
      }

      <Routes>

        <Route
          path='/'
          element={<Home/>}
        />

        <Route
          path='/cars'
          element={<Cars/>}
        />

        <Route
          path='/car/:id'
          element={<CarDetails/>}
        />

        <Route
          path='/my-bookings'
          element={<MyBookings/>}
        />

        <Route
          path='/forgot-password'
          element={<ForgotPassword/>}
        />

        <Route
          path='/profile'
          element={<Profile/>}
        />

        <Route path='/owner' element={<Layout/>}>

          <Route
            index
            element={<Dashborad/>}
          />

          <Route
            path='add-car'
            element={<AddCar/>}
          />

          <Route
            path='manage-cars'
            element={<ManageCars/>}
          />

          <Route
            path='manage-bookings'
            element={<ManageBooking/>}
          />

          <Route
            path='car/:id'
            element={<UpdateCar/>}
          />
           
        </Route>

      </Routes>

      { 
        !isOwnerPath && <Footer/>
      }

    </>
  )
}

export default App