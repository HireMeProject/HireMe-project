import vector from "../../assets/Vector.png";
import { JobContext } from '../Auth/Context/JobContext'; 
import React, { useState, useEffect,useContext } from "react";

const Welcomejobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
    const {
      jobs,
      loading,
      fetchJobs,
      page,
      setPage,
      totalPages,
      searchJob
    } = useContext(JobContext);
  return (
    <div className="welcome-jobs-container">
      <div className='Welcome-jobs-part-container'>
              <div className="welcome-jobs-title">
                  <span className="">Find Your </span>
              a    <span style={{"color":"#26A4FF"}}>DreamJob</span>
                  <div className='vector-img-container'>
                  <img className='vector-img' src={vector} alt="" srcset="" />
                  </div>
                  <div style={{fontSize:"20px",color:"grey",fontFamily:"Roboto , sans-serif"}}>Find your next career at companies like HubSpot, Nike, and Dropbox</div>
              </div>
              <div className="welcome-jobs-search-job-container">
  <div className="welcome-jobs-search-bar-job">
    <i className="bi bi-search"></i>
    <input type="text" placeholder="Search for jobs..."  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}/>
  </div>
  <div className="welcome-jobs-search-job-filter-location">
    <i className="bi bi-geo-alt"></i>
    <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
      <option value="Sousse">Sousse</option>
      <option value="Tunisia">Tunisie</option>
      <option value="Monastir">Monastir</option>

    </select>
  </div>
  <div className="welcome-jobs-search-job-button">
    <button onClick={() => searchJob({ query: searchQuery, location: selectedLocation })}>Search</button>
  </div>
</div>

      
      
              </div>
    </div>
  )
}

export default Welcomejobs
