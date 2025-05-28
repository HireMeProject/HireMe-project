import React from 'react'
import Line from "../../assets/Line.png";

const Welcome = () => {
  return (
    <div className="welcome-container">
        <div className='Welcome-part-container'>
        <div className="welcome-title">
            <span>Discover </span>
            <div>more than</div>
            <div style={{"color":"#26A4FF"}}>5000+ Jobs</div>
            <img src={Line} alt="" srcset="" />
            <p style={{fontSize:"20px",color:"grey",fontFamily:"Roboto , sans-serif"}}>Great platform for the job seeker that searching for new career heights and passionate about startups.</p>
        </div>
        <div className="welcome-search-job-container">
             <div className="welcome-jobs-search-bar-job">
    <i className="bi bi-search"></i>
    <input type="text" placeholder="Search for jobs..."  
 />
  </div>
           <div className="welcome-jobs-search-job-filter-location">
    <i className="bi bi-geo-alt"></i>
    <select >
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

export default Welcome
