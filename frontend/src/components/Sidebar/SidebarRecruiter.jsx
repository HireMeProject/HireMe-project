import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/HireMe-logo.png";
import {jwtDecode} from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import "./SidebarRecruiter.css"

const SidebarRecruiter = () => {
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
        //    const [activeLink,setActiveLink]=useState("");
        const location = useLocation();
           const [error,setError]=useState("");
           const [username, setUsername] = useState("");

        //    const HandleLogout=(e)=>{
        //        e.preventDefault();
        //        }
        //    const HandleToken=()=>{
        //        try{
        //            const token=localStorage.getItem("userToken");
        //        if(token){
        //            const decodedToken=jwtDecode(token);
        //            const firstname=decodedToken.userInfo.firstname;
        //            console.log("token : ",token);
        //            setUsername(firstname);
        //            setLoading(true);}
        //        else{
        //            setLoading(false);
        //            setError("You have to login first ");}   
        //        }
        //        catch(error){
        //            setError(error);
        //            console.log("error : ",error)
        //        }}
        //    useEffect(()=>{
        //        HandleToken();
        //    },[])
      
  return (
    <div className="sidebar">
                <img className='logo-navbar' src={logo} alt="" />

                        <ul className="nav-links-dashboard">
                            <Link to="/Dashboard"  className={`sidebar-link-dashboard ${location.pathname==="/Dashboard" ? "active-dashboard" : "" }`} >
                                <i className="icons-sidebar bi bi-speedometer2"></i>Dashboard
                            </Link>
                            <Link to="/profile" className={`sidebar-link-dashboard ${location.pathname==="/profile" ?"active-dashboard": ""}`}  >
                            <i class="icons-sidebar bi bi-person-circle"></i>Profile
                            </Link>
                            <Link to="/my-jobs" className={`sidebar-link-dashboard ${location.pathname==="/my-jobs" ?"active-dashboard":""}`} >
                            <i class="icons-sidebar bi bi-book-half"></i>My job listing
                            </Link>
                            <Link to="/my-applications" className={`sidebar-link-dashboard ${location.pathname==="/my-applications" ?"active-dashboard":""}`} >
                            <i class="icons-sidebar bi bi-book-half"></i>My applications
                            </Link>
                            <Link to="/Payments" className={`sidebar-link-dashboard ${location.pathname==="/Payments"?"active-dashboard":""}`} >
                            <i class="icons-sidebar bi bi-wallet"></i>Payments
                            </Link>
                            <Link to="/Subscriptions" className={`sidebar-link-dashboard ${location.pathname==="/Subscriptions"?"active-dashboard":""}`} >
                            <i class="icons-sidebar bi bi-wallet"></i>Subscriptions
                            </Link>
                            <Link to="/myCompany" className={`sidebar-link-dashboard ${location.pathname==="/myCompany"?"active-dashboard":""}`} >
                            <i class="icons-sidebar bi bi-wallet"></i>My Company
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

export default SidebarRecruiter
