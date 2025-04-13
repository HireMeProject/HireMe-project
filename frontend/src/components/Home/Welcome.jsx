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
            <div className="welcome-search-bar-job">
                <i class="bi bi-search"></i>
                <input type="text" />
            </div>
            <div className="welcome-search-job-filter-location">
                <i class="bi bi-geo-alt"></i>
                <select name="" id="">
                    <option value="Tunisia">Sousse, Tunisia</option>
                </select>
            </div>
            <div className="welcome-search-job-button">
                <button>Search my job</button>
            </div>
        </div>


        </div>
    </div>
      
  )
}

export default Welcome
