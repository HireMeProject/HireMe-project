import React, { useState, useEffect,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { FiBriefcase, FiUsers, FiDollarSign, FiBell, FiSearch, FiBookmark ,FiMapPin } from 'react-icons/fi';
import { JobContext } from '../../components/Auth/Context/JobContext';

import SidebarAdmin from '../../components/Sidebar/SidebarAdmin'

const DashboardAdmin = () => {
  const navigate=useNavigate();
     const [users, setUsers] = useState([]);
      const token=localStorage.getItem("token");
      // const profilePic=localStorage.getItem("profilePic");
      const [applications, setApplications] = useState([]);
      const [stats, setStats] = useState({
        totalUsers: 0,
        recruiters: 0,
        candidates: 0,
        totalSubs: 0
      });
        const [searchTerm, setSearchTerm] = useState('');
        const {jobs,loading,fetchJobs}=useContext(JobContext);
      useEffect(()=>{
    const fetchApps = async () => {  
          try {
            const response = await axios.get(
              `http://localhost:8000/all-users`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                validateStatus: (status) => true,
    
              }
            );  
            console.log("users response:", response.data.users);
            setUsers(response.data.users);
          } catch (error) {
            console.error("Error fetching jobs:", error);
            toast.error("Failed to load companies. Please try again.");
          }
        };
        
        fetchApps();
            fetchJobs();
  
        
  },[token])
  const fetchCountSubs=async()=>{
    try{
 const response = await axios.get(
              `http://localhost:8000/subscribed-recruiters-count`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                validateStatus: (status) => true,
    
              }
            );  
            console.log("users count response :", response.data.count);
            setStats(prev => ({
            ...prev,
            totalSubs: response.data.count
          }));
         
    }
    catch (error) {
            console.error("Error fetching jobs:", error);
            toast.error("Failed to load companies. Please try again.");
          }

  }
  useEffect(()=>{
    const fetchData=async()=>{
      try{
        console.log("total jobs : ",users.length)

        setStats({
                totalUsers: users.length,
                recruiters: users.filter(user => user.role === 'recruiter').length,
                candidates: users.filter(user => user.role === 'candidate').length,
              });
      }
      catch(error){
        console.error("Error fetching applications:", error);
        toast.error("Failed to load companies. Please try again.");
      }
    }
    fetchData();
              fetchCountSubs();

  },[users])
   const applicationStats = [
      // { name: 'candidates', value: users?.filter(user => user.role === 'candidates').length },
      { name: 'recruiters', value: users?.filter(user => user.role === 'recruiter').length },
      { name: 'Total Users', value: users?.length },
      { name: 'Total Subs', value: stats?.totalSubs },

    ];
    const recruiterStats= [
      // { name: 'candidates', value: users?.filter(user => user.role === 'candidates').length },
      { name: 'recruiters', value: users?.filter(user => user.role === 'recruiter').length },
      { name: 'Total Subs', value: stats?.totalSubs },

    ];
    const [job, setJob] = useState({});
    useEffect(() => {
    if (jobs && jobs.length > 0) {
      setJob(jobs[0]);
    }
  }, [jobs]);
      // console.log(" job : ",job);
  
  
  return (
    <>
   
    <div className="dashboard-container">
      <SidebarAdmin />

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
                  <p>{stats?.totalUsers}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <FiBriefcase />
                </div>
                <div className="stat-info">
                  <h3>Recruiters</h3>
                  <p>{stats?.recruiters}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <FiUsers />
                </div>
                <div className="stat-info">
                  <h3>Candidates</h3>
                  <p>{stats?.candidates}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <FiUsers />
                </div>
                <div className="stat-info">
                  <h3>Total Subscribed</h3>
                  <p>{stats?.totalSubs}</p>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="charts-row">
              <div className="chart-container">
                <h3>All Users</h3>
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
                 <h3>Users Role Distribution</h3>
                 <BarChart width={400} height={300} data={recruiterStats}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="name" />
                   <YAxis />
                   <Tooltip />
                   <Bar dataKey="value" fill="#8884d8" />
                 </BarChart>
               </div>
            </div>

            {/* Recent Jobs */}
            <div className="recent-jobs">
              <h3>Recent Jobs Posted</h3>
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
                  {jobs.slice(0, 5).map((job,index) => (
                    <tr key={index}>
                      <td>{job?.title}</td>
                      <td>{job?.companyID?.name}</td>
                      <td>{job?.publicationDate?.split("T")[0]}</td>
                      <td>{job?.contractType}</td>
                      <td><span className={`status-badge ${job.status}`}>{job.status}</span></td>
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

export default DashboardAdmin
