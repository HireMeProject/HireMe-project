import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  BarChart, 
    Bar, 
    PieChart, 
    Pie, 
    Cell, 
    Tooltip, 
    CartesianGrid, 
    XAxis, 
    YAxis ,AreaChart, Area, ResponsiveContainer} from 'recharts';
    import "./Dashboard.css";
import DashboardHeader from '../../components/Dashboard/DashboardHeader';
import Footer from '../../components/Footer/Footer';
import { FiBriefcase, FiUsers, FiDollarSign, FiBell, FiSearch, FiBookmark } from 'react-icons/fi';
import SidebarCandidate from '../../components/Sidebar/SidebarCandidate'


const DashboardCandidate = () => {
  const timelineData = [
  { month: 'Jan', applied: 3, interviews: 1 },
  { month: 'Feb', applied: 5, interviews: 2 },
  { month: 'Mar', applied: 7, interviews: 3 },
];
   const [apps, setApps] = useState([]);
    const token=localStorage.getItem("token");
    // const profilePic=localStorage.getItem("profilePic");
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({
      totalApplications: 0,
      accepted: 0,
      pending: 0,
      refused: 0
    });
      const [searchTerm, setSearchTerm] = useState('');
    useEffect(()=>{
  const fetchApps = async () => {  
        try {
          const response = await axios.get(
            `http://localhost:8000/candidate/myapplications`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              validateStatus: (status) => true,
  
            }
          );  
          // console.log("jobs response:", response.data.applications);
          setApps(response.data.applications);
        } catch (error) {
          console.error("Error fetching jobs:", error);
          toast.error("Failed to load companies. Please try again.");
        }
      };
      
      fetchApps();
      
},[token])
useEffect(()=>{
  const fetchData=async()=>{
    try{
      console.log("total jobs : ",apps.length)

      setStats({
              totalApps: apps.length,
              accepted: apps.filter(app => app.status === 'accepted').length,
              pending: apps.filter(app => app.status === 'pending').length,
              refused: apps.filter(app => app.status === 'refused').length
            });
    }
    catch(error){
      console.error("Error fetching applications:", error);
      toast.error("Failed to load companies. Please try again.");
    }
  }
  fetchData();
},[apps])
 const applicationStats = [
    { name: 'pending', value: apps?.filter(app => app.status === 'pending').length },
    { name: 'accepted', value: apps?.filter(app => app.status === 'accepted').length },
    { name: 'rejected', value: apps?.filter(app => app.status === 'rejected').length },
  ];
  const [recommendedJobs, setRecommendedJobs] = useState([
  {
    id: 1,
    title: "Développeur Frontend",
    company: "TechCorp",
    location: "Paris (Remote)",
    salary: "50-60K",
    skills: ["React", "TypeScript", "CSS"]
  },
  {
    id: 2,
    title: "UX Designer",
    company: "DesignHub",
    location: "Lyon",
    salary: "45-55K", 
    skills: ["Figma", "User Research", "Prototyping"]
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "DataSystems",
    location: "Full Remote", 
    salary: "55-65K",
    skills: ["Python", "SQL", "Tableau"]
  }
]);

// Fonction pour récupérer les offres recommandées

  return (
<>
   
    <div className="dashboard-container">
      <SidebarCandidate />

      <div className="main-content">
        <DashboardHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          <div className="dashboard-content">
            <h1>Dashboard Overview</h1>

            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-icon">
                  <FiBriefcase />
                </div>
                <div className="stat-info">
                  <h3>Total Applications</h3>
                  <p>{stats?.totalApps}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <FiBriefcase />
                </div>
                <div className="stat-info">
                  <h3>Accepted applications</h3>
                  <p>{stats?.accepted}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <FiUsers />
                </div>
                <div className="stat-info">
                  <h3>Pending Applications</h3>
                  <p>{stats?.pending}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <FiUsers />
                </div>
                <div className="stat-info">
                  <h3>Refused Applications</h3>
                  <p>{stats?.refused}</p>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="charts-row">
              <div className="chart-container">
                <h3>Application Status</h3>
                <PieChart width={300} height={300}>
                  <Pie
                    data={applicationStats}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {applicationStats?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>

             <div className="chart-container">
  <h3>Opportunités recommandées</h3>
  <div className="opportunities-grid">
    {recommendedJobs.slice(0, 3).map((job) => (
      <div key={job.id} className="opportunity-card">
        <div className="job-header">
          <h4>{job.title}</h4>
          <span className="company">{job.company}</span>
        </div>
        <div className="job-details">
          <span><FiMapPin /> {job.location}</span>
          <span><FiDollarSign /> {job.salary}</span>
        </div>
        <div className="job-skills">
          {job.skills.map(skill => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </div>
        <button className="apply-button">
          Voir l'offre 
          {/* <FiArrowRight /> */}
        </button>
      </div>
    ))}
  </div>
  <div className="see-all-container">
    <button className="see-all-button">
      Voir toutes les offres <FiBriefcase />
    </button>
  </div>
</div>
            </div>

            {/* Recent Jobs */}
            <div className="recent-jobs">
              <h3>Recent Applications Applied</h3>
              <table>
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Company name</th>
                    <th>Date posted</th>
                    <th>Date updated</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.slice(0, 5).map((app,index) => (
                    <tr key={index}>
                      <td>{app?.jobTitle}</td>
                      <td>{app?.createdAt.split("T")[0]}</td>
                      <td>{app?.updatedAt.split("T")[0]}</td>
                      <td><span className={`status-badge ${app.status}`}>{app.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        
      </div>
    </div>
    <Footer />
    </>
  )
}
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default DashboardCandidate
