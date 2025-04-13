import React,{useEffect, useState} from 'react'
import { FiBriefcase, FiUsers, FiDollarSign, FiBell, FiSearch, FiBookmark } from 'react-icons/fi';
import axios from 'axios';
const DashboardHeader = ({setSearchTerm,searchTerm}) => {
    const [user, setUser] = useState(null);
        const token = localStorage.getItem("token");
    useEffect(()=>{
        const fetchUserProfile = async () => {
            try {
              // //console.log("Token récupéré pour la requête :", token);
              ////console.log("role :", role);
        
              const response = await axios.get("http://localhost:8000/profile", {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                validateStatus: (status) => true,
              });
              console.log("Réponse du serveur dans user profile methode fetch:", response.data);
              setUser(response.data.recruiter);
              // reset(response.data.user);
            } catch (error) {
              console.error("Error fetching profile:", error.response?.data || error.message);
            }
          };
          fetchUserProfile();

    },[token])
  return (
    <header className="dashboard-header">
              <div className="search-bar">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Search jobs, candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="user-actions">
                <button className="notification-btn">
                  <FiBell />
                  <span className="badge">3</span>
                </button>
                <div className="user-profile">
                  <img src={user?.profilePhoto.url} alt="User" />
                </div>
              </div>
            </header>
  )
}

export default DashboardHeader
