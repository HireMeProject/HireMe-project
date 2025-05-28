import React ,{useState ,useContext} from 'react'
import { LoginContext } from '../../components/Auth/Context/AuthContext';
import { NavLink, Link, useNavigate } from 'react-router-dom'
import logo from "../../assets/HireMe-logo.png";
import "./Navbar.css";
import { jwtDecode } from 'jwt-decode';
const NavItems = [
    { label: 'Home', path: '/' },
    { label: 'All Jobs', path: '/all-jobs' },
    { label: 'About us', path: `/about-us` },
    { label: 'Contact us', path: '/contact-us' },
]

const Navbar = () => {
      const [toggle,setToggle]=useState(false);
      const {isLoggedIn,token,role}=useContext(LoginContext);
      const profilePicture=localStorage.getItem("profile-picture");
    const navigate = useNavigate();
    return (
        <div className='Navbar-container'>
            
            <nav className='nav-container'>
                <div className="navbar-header">
                    <NavLink to='/' className='Logo-Container'>
                        <img className='logo-navbar' src={logo} alt="" />
                    </NavLink>
                    <button
                        className="menu-toggle"
                        onClick={() => setToggle(!toggle)}
                    >
                        <i className={toggle ? "bi bi-x" : "bi bi-list"}></i>
                    </button>
                </div>
                <div className={`navbar-content ${toggle ? "active" : ""}`}>
                <div >
                    <ul className="navbar-links">
                        {NavItems.map(({ label, path }) => (
                            <li key={path} onClick={() => setToggle(false)}>
                                <NavLink to={path} className={({ isActive }) => isActive ? "active" : "inactive"}>
                                    <span className='Link-label-navbar'>{label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                    
                </div>
                
                <div className="Auth-buttons">
                {!isLoggedIn ?(
                    <>
                    
                        <button className='Login-button' onClick={() => navigate("/Login")}>Login</button>
                        <button className='Signup-button' onClick={() => navigate("/Signup")}>Sign up</button>
                        </>)
                    :
                        (<div className="user-profile">
                            {role==="recruiter"?(                            
                                <Link to="/Dashboard"><img src={profilePicture} alt="User" /></Link>
                                ):role==="candidate"?(
                                    <Link to="/Dashboard-candidate"><img src={profilePicture} alt="User" /></Link>
                                ):(
                                    <Link to="/Dashboard-admin"><img src={profilePicture} alt="User" /></Link>
                                )}
                          </div>)
                    }
                    </div>
                </div>
           
                
            </nav>
        </div>
    )
}

export default Navbar