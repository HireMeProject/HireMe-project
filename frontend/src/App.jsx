import { useState } from 'react'

import './App.css'
import Signup from './pages/Signup/Signup';
import { BrowserRouter,Routes,Route,Router } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from "./pages/Profile/Profile"
import MyJobs from './pages/MyJobs/myJobs';
import MyApplications from './pages/Applications/MyApplications';
import CandidateProfile from './pages/Applications/CandidateProfile';
import Subscription from './pages/Subscriptions/Subscription';
import SuccessPage from './pages/Payment/Success';
import Payment from './pages/Payment/Payment';
import Company from './pages/Company/Company';
import Alljobs from './pages/Jobs/Alljobs';
import JobProfile from './components/Jobs/JobProfile';
import DashboardCandidate from './pages/Dashboard/Dashboard-candidate';
import ProfileCandidate from './pages/Profile/ProfileCandidate';
import MyAppsCand from './pages/Applications/MyAppsCand';
import DashboardAdmin from './pages/Dashboard/DashboardAdmin';
import ProfileAdmin from './pages/Profile/ProfileAdmin';
import UsersList from './pages/Users/UsersList';
import CompanyProfile from './pages/Company/CompanyProfile';
import UserProfile from './pages/Users/UserProfile';
import MySubscriptions from './pages/Subscriptions/MySubscriptions';
import Adminjobs from './pages/Jobs/Adminjobs';
import AboutUs from './pages/AboutUs/AboutUs';
import ContactUs from './pages/ContactUs/ContactUs';
function App() {

  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/all-jobs" element={<Alljobs />} />
        {/* Recruiter  */}
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
        {/* Candidate */}
        <Route path='/Dashboard-candidate' element={<DashboardCandidate />} />
        <Route path='/profile-candidate' element={<ProfileCandidate />} />
        <Route path='/my-applications-candidate' element={<MyAppsCand />} />
        {/* Admin */}
        <Route path='/Dashboard-admin' element={<DashboardAdmin />} />
        <Route path="/profile-admin" element={<ProfileAdmin/>} />  
        <Route path="/users" element={<UsersList />} />
        <Route path="/company-profile" element={<CompanyProfile />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path='/my-subscriptions' element={<MySubscriptions />} />
        <Route path='/users-jobs' element={<Adminjobs />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/contact-us' element={<ContactUs />} />

      </Routes>
     
    </>
  )
}

export default App
