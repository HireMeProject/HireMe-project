import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo1 from "../../assets/comp-logo1.png"
import logo2 from "../../assets/comp-logo2.png"
import logo3 from "../../assets/comp-logo3.png"
import logo4 from "../../assets/comp-logo4.png"
import logo5 from "../../assets/comp-logo5.png"
import logo6 from "../../assets/comp-logo6.png"
import logo7 from "../../assets/comp-logo7.png"
import logo8 from "../../assets/comp-logo8.png"
import background from  "../../assets/BG.png"

const FeaturedJobsItems=[
    { logo:logo1,job:"Social media assistant",title:'Nomad',location:"Paris, France",jobType:"full-time",category:["Marketing"]},
    { logo:logo2,job:"Brand designer",title:'Dropbox',location:"San Francisco, Usa",jobType:"full-time",category:["Marketing"]},
    { logo:logo3,job:"Interactive developer",title:'Terraform',location:"Hamburg, Germany",jobType:"full-time",category:["Marketing"]},
    { logo:logo4,job:"HR Manager",title:'Packer',location:"Lucern, Switzerland",jobType:"full-time",category:["Marketing"]},
    { logo:logo5,job:"Social media assistant",title:'Netify',location:"Paris, France",jobType:"full-time",category:["Marketing"]},
    { logo:logo6,job:"Brand designer",title:'Maze',location:"PSan Francisco, Usa",jobType:"full-time",category:["Marketing"]},
    { logo:logo7,job:"Interactive developer",title:'Udacity',location:"Hamburg, Germany",jobType:"full-time",category:["Marketing"]},
    { logo:logo8,job:"HR Manager",title:'Webflow',location:"Lucern, Switzerland",jobType:"full-time",category:["Marketing"]},
    
]
const FeaturedJobs = () => {
  return (
    <div className='Featured-jobs-container'>
        <div className="Explore-title-Container">
            <div className='Explore-title'>Featured <span>jobs</span></div>
            <Link className='show-all-jobs-link' to="/jobs" >Show all jobs</Link>
        </div>
        <div className="Featured-Jobs-container">
            {FeaturedJobsItems.map(({logo,job,title,location,jobType,category})=>(
                // <Link className='category-link' key={title} to='/jobs'>
                    <div className='Featured-job-link-container' key={title}>
                        <div className="comp-logo">
                            <img src={logo} alt="" />
                        </div>
                    <div className='featured-job-desc'>
                        <div className="featured-job-name">{job}</div>
                        <div className="featured-job-title-location">
                            <div className="title-featured-job">{title} &bull; </div>
                            <div className="featured-job-location"> {location}</div>
                        </div>
                        <div className="featured-job-type-category">
                            <div className="featured-job-type">
                                {jobType}
                            </div>
                            <div className="featured-job-categories">
                                {category.map((cat,index)=>(
                                    <div key={index} className="featured-job-category">{cat}</div>
                    
                                ))}
                            </div>
                        </div>

                        </div>
                    </div>
                // </div>
            ))}
           
        </div>
    </div>
  )
}

export default FeaturedJobs
