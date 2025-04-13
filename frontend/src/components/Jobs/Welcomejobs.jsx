import React from 'react'
import vector from "../../assets/Vector.png";


const Welcomejobs = () => {
  return (
    <div className="welcome-jobs-container">
      <div className='Welcome-jobs-part-container'>
              <div className="welcome-jobs-title">
                  <span className="">Find Your </span>
                  <span style={{"color":"#26A4FF"}}>DreamJob</span>
                  <div className='vector-img-container'>
                  <img className='vector-img' src={vector} alt="" srcset="" />
                  </div>
                  <div style={{fontSize:"20px",color:"grey",fontFamily:"Roboto , sans-serif"}}>Find your next career at companies like HubSpot, Nike, and Dropbox</div>
              </div>
              <div className="welcome-jobs-search-job-container">
  <div className="welcome-jobs-search-bar-job">
    <i className="bi bi-search"></i>
    <input type="text" placeholder="Search for jobs..." />
  </div>
  <div className="welcome-jobs-search-job-filter-location">
    <i className="bi bi-geo-alt"></i>
    <select>
      <option value="Tunisia">Sousse, Tunisia</option>
    </select>
  </div>
  <div className="welcome-jobs-search-job-button">
    <button>Search</button>
  </div>
</div>

      
      
              </div>
    </div>
  )
}

export default Welcomejobs
