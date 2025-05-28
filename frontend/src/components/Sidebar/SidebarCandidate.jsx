import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/HireMe-logo.png";
import {jwtDecode} from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import "./SidebarRecruiter.css"

const SidebarCandidate = () => {
    const navigate=useNavigate();
    const HandleLogout = async (event) => {
      event.preventDefault();  
    
            try {
                const response = await axios.post("http://localhost:8000/logout", {}, { 
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}` // Ajout du token dans l'en-tête si nécessaire
                    },
                    validateStatus: (status) => true, // Pour gérer manuellement les erreurs
                });
                console.log("response : ",response);
    
                if (response.status === 200) {
                    // Suppression des données du localStorage
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
        
                    toast.success("Logout successful! Redirecting...", {
                        position: "top-right",
                        autoClose: 3000, 
                    });
        
                    navigate("/login"); // Rediriger vers la page de connexion après déconnexion
                } else {
                    toast.error(response.data.message || "Logout failed.", {
                        position: "top-right",
                    });
                }
            } catch (error) {
                console.error("Erreur lors de la déconnexion:", error);
                toast.error("Failed to disconnect from the server. Please try again later.", {
                    position: "top-right",
                });
            }
        };
       const [Loading,setLoading]=useState(true);
        const location = useLocation();
           const [error,setError]=useState("");
           const [username, setUsername] = useState("");
      
  return (
    <div className="sidebar">
                <img className='logo-sidebar' src={logo} alt="" />

                        <ul className="nav-links-dashboard">
                            <Link to="/"  className={`sidebar-link-dashboard `} >
                                                    <i class="icons-sidebar bi bi-house"></i>Home
                                                        </Link>
                            <Link to="/Dashboard-candidate"  className={`sidebar-link-dashboard ${location.pathname==="/Dashboard-candidate" ? "active-dashboard" : "" }`} >
                                <i className="icons-sidebar bi bi-speedometer2"></i>Dashboard
                            </Link>
                            <Link to="/profile-candidate" className={`sidebar-link-dashboard ${location.pathname==="/profile-candidate" ?"active-dashboard": ""}`}  >
                            <i class="icons-sidebar bi bi-person-circle"></i>Profile
                            </Link>
                            <Link to="/my-applications-candidate" className={`sidebar-link-dashboard ${location.pathname==="/my-applications-candidate" ?"active-dashboard":""}`} >
                            <i class="icons-sidebar bi bi-book-half"></i>My applications
                            </Link>
                        </ul>
                        <div className="Logout-Button-area">
                        <button className="Logout-Button" onClick={HandleLogout}>
                        <i class="icons-sidebar bi bi-box-arrow-left"></i>
                            Logout</button>
                        </div>
                    </div>
  )
}

export default SidebarCandidate
