import React from 'react'
import { Link, NavLink } from 'react-router-dom'
const categoryItems=[
    { icon:<i class="bi bi-pencil"></i>,title:'Design'},
    { icon:<i class="bi bi-bar-chart-line"></i>,title:'Sales'},
    { icon:<i class="bi bi-megaphone"></i>,title:'Marketing'},
    { icon:<i class="bi bi-cash-stack"></i>,title:'Finance'},
    { icon:<i class="bi bi-pc-display"></i>,title:'Technology'},
    { icon:<i class="bi bi-code-slash"></i>,title:'Engineering'},
    { icon:<i class="bi bi-briefcase"></i>,title:'Business'},
    { icon:<i class="bi bi-people"></i>,title:'Human Resource'},
]
const Categories = () => {
  return (
    <div className='Explore-container'>
        <div className="Explore-title-Container">
            <div className='Explore-title'>Explore by <span>category</span></div>
            <Link className='show-all-jobs-link' to="/all-jobs" >Show all jobs</Link>
        </div>
        <div className="categories-container">
            {categoryItems.map(({icon,title})=>(

                <Link className='category-link' key={title} to='/all-jobs'>
                    <div className='category-link-container' key={title}>
                    {icon}
                    <div className="title-category">{title}</div>
                    <div className='arrow-category-container'><i class="arrow-category bi bi-arrow-right"></i></div>
                    </div>
                </Link>
            ))}

        </div>
      
    </div>
  )
}

export default Categories
