// import React, { useState, useEffect } from "react";
// import SidebarRecruiter from "../Sidebar/SidebarRecruiter";
// import axios from "axios";
// import { useForm } from "react-hook-form";
// import { toast, ToastContainer } from "react-toastify";

// const FiltreJobs = ({filtreCategory,filtreEmploymentType,filtrePriceRange,filtreStatus,
//     setFiltreCategory,setFiltreEmploymentType,setFiltrePriceRange,setFiltreStatus}) => {
//         const HandleCheckBoxChange = (e,setState,stateArray) => {
//             console.log("e.target.value : ",e.target)
//             // e.preventDefault();
//             const{name,checked}=e.target;
//             if(checked){
//                 if (checked) {
//                     setState([...stateArray, name]);
//                   }            }
//             else{
//                 setState(stateArray.filter((item)=>item!==name));
//             }

//         };
//           const HandleChangePrice = (e) => {
//             // e.preventDefault();
//             console.log("e.target.value : ",e.target.value)
//             setFiltrePriceRange(e.target.value.split("-"));
//           };
//     console.log("filtre category range : ",filtreCategory)
//   return (
//     <div className='filtre-jobs-wrapper'>
//       <div className="filtre-types">
//         <h3>Type of employment</h3>
//         <div className="filtre-content">
//             <div><input type="checkbox" value="Part-time" name="Part-time" onChange={(e) => HandleCheckBoxChange(e, setFiltreEmploymentType, filtreEmploymentType)} checked={filtreEmploymentType.includes("Part-time")} /><label className='label-filtre-jobs'>Part-time</label></div>
//             <div><input type="checkbox" value="Full-time" name="Full-time" onChange={(e) => HandleCheckBoxChange(e, setFiltreEmploymentType, filtreEmploymentType)} checked={filtreEmploymentType.includes("Full-time")} /><label className='label-filtre-jobs'>Full-time</label></div>
//             <div><input type="checkbox" value="Remote" name="Remote" onChange={(e) => HandleCheckBoxChange(e, setFiltreEmploymentType, filtreEmploymentType)} checked={filtreEmploymentType.includes("Remote")} /><label className='label-filtre-jobs'>Remote</label></div>
//             <div><input type="checkbox" value="Internship" name="Internship" onChange={(e) => HandleCheckBoxChange(e, setFiltreEmploymentType, filtreEmploymentType)} checked={filtreEmploymentType.includes("Internship")} /><label className='label-filtre-jobs'>Internship</label></div>
//             <div><input type="checkbox" value="Contract" name="Contract" onChange={(e) => HandleCheckBoxChange(e, setFiltreEmploymentType, filtreEmploymentType)} checked={filtreEmploymentType.includes("Contract")} /><label className='label-filtre-jobs'>Contract</label></div>
//         </div>
//       </div>
//       <div className="filtre-content">
//         <h3>Category</h3>
//             <div><input type="checkbox" value="Design" name="Design" onChange={(e) => HandleCheckBoxChange(e, setFiltreCategory, filtreCategory)} checked={filtreEmploymentType.includes("Design")} /><label className='label-filtre-jobs'>Design</label></div>
//             <div><input type="checkbox" value="Sales" name="Sales" onChange={(e) => HandleCheckBoxChange(e, setFiltreCategory, filtreCategory)} checked={filtreEmploymentType.includes("Sales")} /><label className='label-filtre-jobs'>Sales</label></div>
//             <div><input type="checkbox" value="Marketing" name="Marketing" onChange={(e) => HandleCheckBoxChange(e, setFiltreCategory, filtreCategory)} checked={filtreEmploymentType.includes("Marketing")} /><label className='label-filtre-jobs'>Marketing</label></div>
//             <div><input type="checkbox" value="Business" name="Business" onChange={(e) => HandleCheckBoxChange(e, setFiltreCategory, filtreCategory)} checked={filtreEmploymentType.includes("Business")} /><label className='label-filtre-jobs'>Business</label></div>
//             <div><input type="checkbox" value="IT" name="IT" onChange={(e) => HandleCheckBoxChange(e, setFiltreCategory, filtreCategory)} checked={filtreEmploymentType.includes("IT")} /><label className='label-filtre-jobs'>IT</label></div>
//             <div><input type="checkbox" value="Finance" name="Finance" onChange={(e) => HandleCheckBoxChange(e, setFiltreCategory, filtreCategory)} checked={filtreEmploymentType.includes("Finance")} /><label className='label-filtre-jobs'>Finance</label></div>
//             <div><input type="checkbox" value="Engineering" name="Engineering" onChange={(e) => HandleCheckBoxChange(e, setFiltreCategory, filtreCategory)} checked={filtreEmploymentType.includes("Engineering")} /><label className='label-filtre-jobs'>Engineering</label></div>
//             <div><input type="checkbox" value="Technology" name="Technology" onChange={(e) => HandleCheckBoxChange(e, setFiltreCategory, filtreCategory)} checked={filtreEmploymentType.includes("Technology")} /><label className='label-filtre-jobs'>Technology</label></div>

//         </div>
//               <div className="filtre-types">
//                 <h3>Status</h3>
//               <div><input type="checkbox" value="open" name="open" onChange={(e) => HandleCheckBoxChange(e, setFiltreStatus, filtreStatus)} checked={filtreEmploymentType.includes("open")} /><label className='label-filtre-jobs'>open</label></div>
//               <div><input type="checkbox" value="closed" name="closed" onChange={(e) => HandleCheckBoxChange(e, setFiltreStatus, filtreStatus)} checked={filtreEmploymentType.includes("closed")} /><label className='label-filtre-jobs'>closed</label></div>
//               </div>
//       <div className="filtre-types">
//         <h3>Price range</h3>
//       <div><input type="checkbox" value="700-1000" name="700-1000" onChange={HandleChangePrice} /><label className='label-filtre-jobs' checked={filtreEmploymentType.includes("700-1000")}>700$-1000$</label></div>
//       <div><input type="checkbox" value="1000-1500" name="1000-1500" onChange={HandleChangePrice} /><label className='label-filtre-jobs' checked={filtreEmploymentType.includes("1000-1500")}>1000$-1500$</label></div>
//       <div><input type="checkbox" value="1500-2000" name="1500-2000" onChange={HandleChangePrice} /><label className='label-filtre-jobs' checked={filtreEmploymentType.includes("1500-2000")}>1500$-2000$</label></div>
//       <div><input type="checkbox" value="2000-" name="2000-" onChange={HandleChangePrice} /><label className='label-filtre-jobs' checked={filtreEmploymentType.includes("2000-")}>2000$-above</label></div>

//       </div>
//     </div>
//   )
// }

// export default FiltreJobs





import React, { useState, useEffect } from "react";
import SidebarRecruiter from "../Sidebar/SidebarRecruiter";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";

const Jobs = ({filtreCategory,filtreEmploymentType,filtrePriceRange,filtreStatus}) => {
      const [jobs, setJobs] = useState([]);
    
    useEffect(()=>{
        const fetchJobsquery = async () => {
            try {
              const response = await axios.get(`http://localhost:8000/joboffers`,{
                params: {
                  category: filtreCategory, // ex: ['IT', 'Design']
                  status: filtreStatus,     // ex: ['open']
                  contractType: filtreEmploymentType, // ex: ['Remote', 'Full-time']
                  minsalary: filtrePriceRange[0],
                  maxsalary: filtrePriceRange[1],
                }
              });
              console.log("jobs response:", response.data.jobOffers);
              setJobs(response.data.jobOffers);
            } catch (error) {
              console.error("Error fetching jobs:", error);
              toast.error("Failed to load companies. Please try again.");
            }
          };
          const fetchJobs = async () => {
            try {
              const response = await axios.get(`http://localhost:8000/joboffers`);
              console.log("jobs response:", response.data.jobOffers);
              setJobs(response.data.jobOffers);
            } catch (error) {
              console.error("Error fetching jobs:", error);
              toast.error("Failed to load companies. Please try again.");
            }
          };
          if(filtreCategory||filtreEmploymentType||filtrePriceRange||filtreStatus){
            console.log("query : ",filtreCategory);
            fetchJobsquery();
          }
        //   else{
        //     fetchJobs();
        //   }
    },[filtreCategory,filtreEmploymentType,filtrePriceRange,filtreStatus]);
    
  return (
    <div className='All-jobs-wrapper'>
      <div className="All-jobs-header">
            <span>All Jobs</span>
            <div>Showing 73 result</div>
      </div>
      <div className="All-jobs-container">
            {jobs?.map((job,index)=>(
                <div key={index} className="job-container">
                    <div className="img-company-container">
                        <img src={job.companyID.logo.url} alt="" />
                    </div>
                    <div className="job-name-container">
                        <div className="job-name-content">
                            {job.title}
                        </div>
                        <div className="job-company-info">
                        <div className="job-company-name">
                            {job.companyID.name}
                        </div>
                        <div className="job-company-name">
                            {job.location}
                        </div>
                        </div>
                        <div className="job-contract-category-container">
                            <div className="job-contract-type">
                                {job.contractType}
                            </div>
                            <div className="job-category">
                                {job.categoryId.name}
                            </div>
                        </div>
                    </div>
                    <div className="apply-btn-container">  
                      <button className="apply-btn">Apply</button>
                    </div>
                </div>
                
            ))

            }

      </div>

    </div>
  )
}

export default Jobs

