import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FeaturedJobs from "../Home/FeaturedJobs";
import "./JobProfile.css"
import Footer from "../Footer/Footer"
const JobProfile = () => {
  const [job, setJob] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const jobId = useParams();
  // const [applied,setApplied]=useState(false);
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/joboffers/${jobId.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          validateStatus: (status) => true,
        }
        );
        console.log("jobs response:", response.data.jobOffer);
        setJob(response.data.jobOffer);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load companies. Please try again.");
      }
    };
    fetchJob();
  }, []);
  const HandleApplyToJob = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/candidate/joboffers/apply/${jobId.id}`,{},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          validateStatus: (status) => true,

        }
      );
      console.log("job application : ",response.data);
      if (response.status === 200) {
        // reset(response.data.user);
        toast.success("Update successful! ", {
          position: "top-right",
          autoClose: 3000,
        });
        // setApplied(true);
      } else {
        toast.error(response.data.message || "Identifiants incorrects.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load companies. Please try again.");
    }
  };
  return (
    <div>
      <Navbar />
      <ToastContainer />
      <div className="job-profile-container">
        <div className="Job-profile-content-container">
          {/*<button className={`btn-apply-job-offer-profile ${applied===true?"applied":"not-applied"}`} onClick={HandleApplyToJob} disabled={applied} >Apply</button> */}
          <div className="job-offer-header-container">
            <div className="header-joboffer-info-container">
            <img src={job?.companyID?.logo.url} alt="" />
            <div className=""><h1>{job?.title}</h1>
            <div>{job?.companyID?.name}</div></div>
            
            </div>
            <button className="btn-apply-job-offer-profile" onClick={HandleApplyToJob}>Apply</button>

          </div>
          <div className="job">
          <div className="job-desc-location-status-salary-contract-container">

            <div className="job-offer-desc-container">
              <h2>Description</h2>
              <div>{job?.description}</div>
            </div>
            <div className="job-offer-contract-container">
              <h3>Contract type</h3>
              <div>{job?.contractType}</div>
            </div>
            <div className="job-offer-location-container">
              <h3>Location</h3>
              <div>{job?.location}</div>
            </div>
            <div className="job-offer-salary-container">
              <h3>Salary</h3>
              <div>{job?.salary}</div>
            </div>
            
            <div className="job-offer-location-container">
              <h3>Status</h3>
              <div data-status={job?.status}>{job?.status}</div>
            </div>
            </div>
            <div className="job-offer-requirements-container">
              <h3>Job requirements</h3>
              <div>{job?.requirements}</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobProfile;
