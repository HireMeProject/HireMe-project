 import React from 'react'
 import { NavLink, Link ,useNavigate} from 'react-router-dom'
 import logo from "../../assets/HireMe-logo.png";
 import "./Navbar.css";
//  const employerNavItems = [
//     { label: 'Home', path: '/' },
//     { label: 'Dashboard', path: '/all-jobs' },
//     { label: 'Post Job', path: '/post-job' },
//     { label: 'Candidates', path: '/candidates' },
// ];
// const candidateNavItems = [
//     { label: 'Home', path: '/' },
//     { label: 'All Jobs', path: '/all-posted-jobs' },
//     { label: 'Dashboard', path: `/my-jobs` },
// ];
// const adminNavItems =[
//     { label: 'Home', path: '/' },
//     { label: 'All Jobs', path: '/all-posted-jobs' },
//     { label: 'Users', path: `/all-users` },
//     { label: 'Dashboard', path: '/dashboard' },
// ];
const NavItems =[
    { label: 'Home', path: '/' },
    { label: 'All Jobs', path: '/all-jobs' },
    { label: 'About us', path: `/about-us` },
    { label: 'Contact us', path: '/contact-us' },
]

 const Navbar = () => {
    const navigate=useNavigate();
   return (
     <div className='Navbar-container'>
        <nav className='nav-container'>
            <NavLink to='/' className='Logo-Container' >
                <img className='logo-navbar' src={logo} alt="" />
            </NavLink>
            <ul className="navbar-links">
            {/* <li onClick={()=>setToggle(false)} className="navbar-link">Home</li> */}
            {NavItems.map(({label,path})=>(
                <li key={path}>
                    <NavLink onClick={()=>setToggle(false)} to={path} className={({isActive})=>isActive ?"active":"inactive"} >
                        <span className='Link-label'>{label}</span>
                    </NavLink>
                </li>
            ))}
            </ul>
            <div className="Auth-buttons">
                <button className='Login-button' onClick={()=>navigate("/Login")} >Login</button>
                <button className='Signup-button' onClick={()=>navigate("/Signup")} >Sign up</button>
            </div>

        </nav>
       
     </div>
   )
 }
 
 export default Navbar
 