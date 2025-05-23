import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Footer from "../../components/Footer/Footer"
import SidebarAdmin from '../../components/Sidebar/SidebarAdmin';
import { BsFillPeopleFill } from "react-icons/bs";
import { FaMapLocationDot,FaBuilding } from "react-icons/fa6";


const CompanyProfile = () => {
      const [company, setCompany] = useState({});
      const [loading, setLoading] = useState(true); // <-- Ajout du state "loading"
      const [employees, setEmployees] = useState([]); // liste locale des employés avec index et data      
      const token = localStorage.getItem("token");
      const recruiterID=localStorage.getItem("UserProfileId");

        
         const GetCompany = async () => {
          try {
            const response = await axios.get(`http://localhost:8000/company-profile/${recruiterID}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              validateStatus: (status) => true,
            });
            console.log("company data dans fetch : ", response.data.message.companyID);
            if (response.data.status === "success") {
              setCompany(response.data.message.companyID);
              setLoading(false);
            }
          } catch (error) {
            setLoading(false);
            console.error("Error fetching companies:", error);
            toast.error("Failed to load companies. Please try again.");
          }
        };
      useEffect(() => {
       
        GetCompany();
    
      }, [token]);
                    // console.log("company employees : ",company.employeesList)
  return (
   <>
    <div className="Company-wrapper">
      <SidebarAdmin />
      <ToastContainer />
      <div className="my-company-profile">
                 <header className="my-company-header">
                   <div className="my-company-container">
                  <div class="logo-container">
                  <img src={company?.logo?.url} className="my-company-logo" alt="" />
                  </div>
                  <h1 className="my-company-name">{company?.name}</h1>
                  <div className="my-company-tagline">
                          {company?.sector}
                        </div>
                  <div className="my-company-stats">
                    <div className="stats-item">
                      <BsFillPeopleFill />
      
                        <div className="stat-value">
                          {company?.employeesNumber}+
                        </div>
                        <div className="stat-label">
                          Employees
                        </div>
                        </div>
                        <div className="stats-item">
                          <FaMapLocationDot />
                        <div className="stat-value">
                          {company?.location}
                        </div>
                        <div className="stat-label">
                          Location
                        </div>
                        </div>
                        <div className="stats-item">
                          <FaBuilding />
                        <div className="stat-value">
                          {company?.foundedDate?.split("T")[0]}
                        </div>
                        <div className="stat-label">
                          Established
                        </div>
                    </div>
                  </div>
           </div>
            </header>
      
      
                <main className="my-company-container">
                  <section className="section">
                    <div className="section-header">
                    <h2 class="section-title">Description</h2>
                   
                    </div>
                  <div className="my-company-desc">
                    <p>{company?.description}</p>
                  </div>
                </section>
                <section className="section">
                  <div className="section-header">
                  <h2 class="section-title">Our Team</h2>
                </div>
                <div className="employees-grid">
            {company?.employeesList?.map((emp, index) => (
                <div key={index} className="employee-card">
                  <img 
                    src={emp.profilePic?.url } 
                    alt={emp.name} 
                    className="employee-photo" 
                  />
                  <div className="employee-info">
                    <h3 className="employee-name">{emp.name}</h3>
                    <p className="employee-position">{emp.position}</p>
                    <p className="employee-email">{emp.email}</p>
                    
                    <div className="upload-section">
                      <input 
                        type="file" 
                        id={`employee-photo-${index}`}
                        onChange={(e) => setFile(e.target.files[0])} 
                        className="visually-hidden"
                      />
                      <label 
                        htmlFor={`employee-photo-${index}`} 
                        className="upload-label"
                      >
                        Change Photo
                      </label>
                      <button 
                        onClick={() => handleEmpPhotoUpload(index)}
                        className="upload-member-button"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
              ))}
      
</div>
          </section>
  
          </main>
           </div>
      
      
    </div>
    <Footer />
    </>
  );
};


export default CompanyProfile
