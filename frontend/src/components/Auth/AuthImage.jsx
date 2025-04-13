import React from 'react'
import WorkerImage from '../../assets/AuthImage.png';
import HireMelogo from "../../assets/HireMe-logo.png";
import "./AuthImage.css";
const AuthImage = () => {
  return (
    <div className='AuthImage-container'>
        <div className="logo-container">
          <img className='logo' src={HireMelogo} alt="" />
        </div>
        <div className="img-container">
          <div className="peoplehired-container">
          <i class="bi bi-bar-chart-fill" ></i>
            <b>100k+</b>
            <span >People got hired</span>
          </div>
          <div className="WorkerImage-container">
            
          </div>
          
        </div>
      
    </div>
  )
}

export default AuthImage
