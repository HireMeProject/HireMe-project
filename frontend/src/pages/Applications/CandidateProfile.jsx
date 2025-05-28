import React, { useState, useEffect } from "react";
import SidebarRecruiter from "../../components/Sidebar/SidebarRecruiter";
import axios from "axios";
import "./CandidateProfile.css";
import { toast, ToastContainer } from "react-toastify";
import { IoMail } from "react-icons/io5";
import { BsBuildingFill } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";
import { FaRegCalendarAlt,FaPhoneAlt,FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";

const CandidateProfile = () => {
    const [user, setUser] = useState(null);
        const token = localStorage.getItem("token"); // Vérifier la récupération du token
        let role="candidate";
        const userId=localStorage.getItem("UserProfileId");
        console.log("userIDDD: ",userId)
        const navigate=useNavigate();
        useEffect(() => {
        const fetchUserProfile = async () => {
          try {
            const response = await axios.get(`http://localhost:8000/users-profile/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              validateStatus: (status) => true,
            });
            console.log("Réponse du serveur dans user profile methode fetch:", response.data);
            setUser(response.data.user);
            
          
           
          } catch (error) {
            console.error("Error fetching profile:", error.response?.data || error.message);
          }
        };
      
        fetchUserProfile();
      }, []);

  return (
   <>
  <div className="Profile-wrapper-container">
            <ToastContainer /> 
    
    <SidebarRecruiter />
    <div className="profile-container">
        
        <div className="profile-all-container">
        <div className="profile-header">
            <img src={user?.profilePhoto?.url} alt="Profile" className="profile-picture" />
        <h1 class="profile-user-name" >{user?.name}</h1>
        <h2 class="profile-user-role">{user?.role}</h2>
        <span class="profile-user-status">{user?.status}</span>
        </div>
        <div class="profile-body">
                <div class="info-section">
                    <h3><i class="fas fa-user-circle"></i> Personal informations</h3>
                    
                    <div class="info-item">
                        <div class="info-icon">
                            <IoMail />
                        </div>
                        <div class="info-content">
                            <h4>Email</h4>
                            <p id="profile-email">{user?.email}</p>
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-icon">
                            <FaPhoneAlt />
                        </div>
                        <div class="info-content">
                            <h4>Phone number</h4>
                            <p id="profile-phone">{user?.phoneNumber}</p>
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-icon">
                            <i class="fas fa-venus-mars"></i>
                        </div>
                        <div class="info-content">
                            <h4>Gender</h4>
                            <p id="profile-gender">{user?.gender}</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-icon">
                            <FaRegCalendarAlt />
                        </div>
                        <div class="info-content">
                            <h4>Birthdate</h4>
                            <p id="profile-gender">{user?.birthDate.split('T')[0]}</p>
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-icon">
                            <MdLocationOn />
                        </div>
                        <div class="info-content">
                            <h4>Adress</h4>
                            <p id="profile-address">{user?.address}</p>
                        </div>
                    </div>
                </div>
                
                <div class="info-section">
                    <h3><i class="fas fa-briefcase"></i> Professional informations</h3>
                    
                    
            
                            <>
                            <div class="company-section">
                            <h3><BsBuildingFill /> Skills</h3>
                            <p id="company-name">{user?.skills}</p>
                            </div>
                            <div class="company-section">
                            <h3><BsBuildingFill /> CV</h3>
                            <p id="company-name">
                            {user?.cv?.url ? (
                                <>
                                  <a 
                                    href={user.cv.downloadUrl || `${user.cv.url}?response-content-disposition=attachment`} 
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ marginRight: "10px" }}
                                  >
                                    my CV
                                  </a>
                                </>
                              ) : (
                                <span>Aucun CV disponible</span>
                              )}
                                </p>
                                </div>
                            </>
                    </div>
                    
  
                </div>
            </div>
        </div>
          
       </div>
         
      
            <Footer />
      </>  
      
  )
}

export default CandidateProfile
