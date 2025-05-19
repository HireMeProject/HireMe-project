import React, { useState, useEffect } from "react";
import SidebarRecruiter from "../../components/Sidebar/SidebarRecruiter";
import axios from "axios";
import { useForm } from "react-hook-form";
import "./CandidateProfile.css";
import { toast, ToastContainer } from "react-toastify";

const CandidateProfile = () => {
    //Get candidate Profile
      const token = localStorage.getItem("token");
      const applicationId=localStorage.getItem("applicationId");
      const [candidateProfile,setCandidateProfile]=useState(null);
      console.log("app id debuttt: ",applicationId);

  useEffect(()=>{
    const GetCandidateProfile=async()=>{
        try{
            const response=await axios.get(`http://localhost:8000/myapplications/${applicationId}/profile`,
                {headers:{
                    Authorization:`Bearer ${token}`,
                    "Content-Type": "application/json",
                }},
                
            );
            console.log("applications response apres axios:", response.data.candidateProfile);
            if(response.status===200){
                setCandidateProfile(response.data.candidateProfile);
            }
        }
        catch (error) {
          console.error("Error fetching candidate Profile:", error);
          toast.error("Failed to load candidate Profile. Please try again.");
        }
    
      };
    GetCandidateProfile();

},[token,applicationId])
console.log("candidate profile response:", candidateProfile);
console.log("id candidate response:", applicationId);

    let profileFields;
    profileFields = [
        { label: "Name", value: candidateProfile?.name },
        { label: "Email", value: candidateProfile?.email },
        { label: "PhoneNumber", value: candidateProfile?.phoneNumber },
        { label: "Address", value: candidateProfile?.address },
        { label: "Status", value: candidateProfile?.status },
        //  { label: "Company", value: [<img src={user.companyLogo}/>,user.company] },
        // { label: "CV", value: candidateProfile.cv.url },
        { label: "Skills", value: candidateProfile?.skills },
        ];
  return (
    <div className="candidate-profile-container">
        <SidebarRecruiter />
        <div className="candidate-profile-wrapper">
        <h2> {candidateProfile?.name} Profile</h2>
        <div className="candidate-pic-container">
            <img src={candidateProfile?.profilePhoto?.url} alt="Profile" className="candidate-pic" />
          </div>
          <ul className="candidate-list">
            {profileFields?.map((field,index)=>
            field.value?(
              <li key={index} className="candidate-item">
                <strong>{field.label}:</strong> {field.value}
              </li>
               
            ):null)
          }
          <li className="candidate-item">
          <strong>Cv :</strong>
           {candidateProfile?.cv?.url ? (
                  <>
                    <a 
                      href={candidateProfile?.cv.downloadUrl || `${candidateProfile?.cv.url}?response-content-disposition=attachment`} 
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginRight: "10px" }}
                    >
                      My CV
                    </a>
                    {/* <a 
                      href={candidateProfile.cv.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      (Voir en ligne)
                    </a> */}
                  </>
                ) : (
                  <span>Aucun CV disponible</span>
                )}
                </li>
          </ul>
        </div>
        
    </div>
  )
}

export default CandidateProfile
