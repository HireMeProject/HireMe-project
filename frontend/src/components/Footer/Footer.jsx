import React from 'react';
import "./Footer.css";
import logo from "../../assets/HireMe-logo.png";
import { Link, useNavigate } from 'react-router-dom';


const Footer = () => {
    const navigate = useNavigate();
    const HandleRedirect=()=>{
        setTimeout(() => navigate("/Signup"), 500);
    }
  return (
    <div className='Footer-container'>
        <div className="footer-desc-container">
            <div className="footer-desc">
                <div className="footer-hireme-container">
                    <div className="footer-hireme-logo">
                        <img src={logo} alt="" />
                    </div>
                    <div className="footer-hireme-desc">
                        Great platform for the job seeker that passionate about startups. 
                        Find your dream job easier.
                    </div>
                </div>
                <div className="footer-about-container">
                    <div className="footer-about">About</div>
                    <div className="footer-about-desc">
                        <div>Companies</div>
                        <div>Pricing</div>
                        <div>Terms</div>
                        <div>Advice</div>
                        <div>Privacy Policy</div>
                    </div>
                </div>
                <div className="footer-resources-container">
                    <div className="footer-resources">Resources</div>
                    <div className="footer-resources-desc">
                        <Link className='Footer-link'>Help Docs</Link>
                        <Link className='Footer-link'>Guide</Link>
                        <Link className='Footer-link'>Updates</Link>
                        <Link className='Footer-link'>Contact Us</Link>
                    </div>
                </div>
                <div className="footer-notif-container">
                    <div className="footer-notif">Get job notifications</div>
                    <div className="footer-notif-desc">
                        <div>The latest job news, articles, sent to your inbox weekly.</div>
                        <div className='footer-input-container'>
                            <input type="text" />
                            <button onClick={HandleRedirect}>Subscribe</button>
                        </div>
                    </div>
                </div>

            </div>
            <div className="footer-copyright-container">
                2025&copy; HireME. All rights reserved.
            </div>
        </div>
      
    </div>
  )
}

export default Footer
