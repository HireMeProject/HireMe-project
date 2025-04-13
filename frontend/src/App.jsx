import { useState } from 'react'

import './App.css'
import Signup from './components/Auth/Signup/Signup';
import { BrowserRouter,Routes,Route,Router } from 'react-router-dom';
import Login from './components/Auth/Login/Login';
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from "./components/Profile/Profile"
import MyJobs from './components/Jobs/myJobs';
import MyApplications from './components/Applications/MyApplications';
import CandidateProfile from './components/Applications/CandidateProfile';
import Subscription from './components/Subscriptions/Subscription';
import CheckoutForm from './components/Payment/checkoutForm';
import SuccessPage from './components/Payment/Success';
import Payment from './components/Payment/Payment';
import Company from './components/Company/Company';
import Alljobs from './components/Jobs/Alljobs';
import JobProfile from './components/Jobs/JobProfile';
import DashboardCandidate from './components/Dashboard/Dashboard-candidate';
import ProfileCandidate from './components/Profile/ProfileCandidate';
function App() {
  
// function SuccessPage() {
//   return <h2>Paiement réussi ! 🎉</h2>;
// }

// function CancelPage() {
//   return <h2>Paiement annulé ❌</h2>;
// }

  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/all-jobs" element={<Alljobs />} />
        <Route path="/Dashboard" element={<Dashboard/>} />
        <Route path="/profile" element={<Profile/>} />  
        <Route path="/my-jobs" element={<MyJobs/>} />  
        <Route path="/my-applications" element={<MyApplications/>} />  
        <Route path="/candidate-profile" element={<CandidateProfile/>} />  
        <Route path="/Subscriptions" element={<Subscription />} />
        <Route path="/payment/success" element={<SuccessPage />} />
        <Route path="/Payments" element={<Payment />} />
        <Route path="/myCompany" element={<Company />} />
        <Route path="all-jobs/:id" element={<JobProfile/>} />

        <Route path='/Dashboard-candidate' element={<DashboardCandidate />} />
        <Route path='/profile-candidate' element={<ProfileCandidate />} />

        {/* <Route path='/success-payment'/> */}
      </Routes>
     
    </>
  )
}

export default App
