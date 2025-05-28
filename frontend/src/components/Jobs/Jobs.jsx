import React, { useState, useEffect,useContext } from "react";
import SidebarRecruiter from "../Sidebar/SidebarRecruiter";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import {JobContext } from "../Auth/Context/JobContext";

const Jobs = ({
  filtreCategory,
  filtreEmploymentType,
  filtrePriceRange,
  filtreStatus,
}) => {
  const token=localStorage.getItem("token");
  const [jobId,setJobId]=useState("");
  const navigate=useNavigate();
  const [limit, setLimit] = useState(5);
   const {
    jobs,
    loading,
    fetchJobs,
    page,
    setPage,
    totalPages,
  } = useContext(JobContext);
  useEffect(() => {
    // const fetchJobsquery = async () => {
    //   try {
    //     const response = await axios.get(`http://localhost:8000/joboffers`, {
    //       params: {
    //         category: filtreCategory, // ex: ['IT', 'Design']
    //         status: filtreStatus, // ex: ['open']
    //         contractType: filtreEmploymentType, // ex: ['Remote', 'Full-time']
    //         minsalary: filtrePriceRange[0],
    //         maxsalary: filtrePriceRange[1],
    //         page:page, limit:limit,
    //       },
    //     });
    //     console.log("jobs response:", response.data);
    //     setJobs(response.data.jobOffers.jobOffers);
    //     setTotalPages(Math.ceil(response.data.jobOffers.total / limit));
    //   } catch (error) {
    //     console.error("Error fetching jobs:", error);
    //     toast.error("Failed to load companies. Please try again.");
    //   }
    // };
    // if (
    //   filtreCategory ||
    //   filtreEmploymentType ||
    //   filtrePriceRange ||
    //   filtreStatus
    // ) {
    //   console.log("query : ", filtreCategory);
    //   fetchJobsquery();
    // }
    fetchJobs({
      filtreCategory,
      filtreEmploymentType,
      filtrePriceRange,
      filtreStatus,
    });
  }, [filtreCategory, filtreEmploymentType, filtrePriceRange, filtreStatus, page]);
  // }, [filtreCategory, filtreEmploymentType, filtrePriceRange, filtreStatus,page,limit]);
  const VerifyLoggedIn=(job_Id)=>{
    try{
        if(token){
            navigate(`${job_Id}`);
        }
        else{
            navigate('/Signup')
        }
    }
    catch(error){
        console.error("Error redirecting:", error);
        toast.error("Failed to load companies. Please try again.");
    }
  }
  console.log("jobsssssssssss:::::",jobs)

  return (
    <div className="All-jobs-wrapper">
      <div className="All-jobs-header">
        <span>All Jobs</span>
        <div>Showing {jobs.length} result</div>
      </div>
      <div className="All-jobs-container">
        {jobs?.map((job, index) => (
          <div onClick={(e)=>setJobId(job._id)} key={index} className="job-container">
            <div className="img-company-container">
              <img src={job.companyID.logo.url} alt="" />
            </div>
            <div className="job-name-container">
              <div className="job-name-content">{job.title}</div>
              <div className="job-company-info">
                <div className="job-company-name">{job.companyID.name}</div>
                <div className="job-company-name">{job.location}</div>
              </div>
              <div className="job-contract-category-container">
                <div className="job-contract-type">{job.contractType}</div>
                <div className="Job-category">{job.categoryId.name}</div>
              </div>
            </div>
            <div className="apply-btn-container">
              <button className="apply-btn" onClick={(e)=>VerifyLoggedIn(job._id)}>Apply</button>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page <= 1}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Jobs;
