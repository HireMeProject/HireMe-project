
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
    YAxis } from 'recharts';
import { FiBriefcase, FiUsers, FiDollarSign, FiBell, FiSearch, FiBookmark } from 'react-icons/fi';
import "./Dashboard.css";
import SidebarRecruiter from"../../components/Sidebar/SidebarRecruiter"
import DashboardHeader from '../../components/Dashboard/DashboardHeader';
import Footer from '../../components/Footer/Footer';

const Dashboard = () => {
  // State management
  const [jobs, setJobs] = useState([]);
  const token=localStorage.getItem("token");
  // const profilePic=localStorage.getItem("profilePic");
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
useEffect(()=>{
  const fetchJobs = async () => {  
        try {
          const response = await axios.get(
            `http://localhost:8000/myjoboffers`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              validateStatus: (status) => true,
  
            }
          );  
          // console.log("jobs response:", response.data.message);
          setJobs(response.data.message);
        } catch (error) {
          console.error("Error fetching jobs:", error);
          toast.error("Failed to load companies. Please try again.");
        }
      };
      const fetchApplications = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/myapplications`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log("applications response:", response.data.applications);
          setApplications(response.data.applications);
        } catch (error) {
          console.error("Error fetching applications:", error);
          toast.error("Failed to load companies. Please try again.");
        }
      };
      fetchJobs();
      fetchApplications();
      
},[token])
useEffect(()=>{
  const fetchData=async()=>{
    try{
      console.log("total jobs : ",jobs.length)

      setStats({
              totalJobs: jobs.length,
              activeJobs: jobs.filter(job => job.status === 'open').length,
              totalApplications: applications.length,
              pendingApplications: applications.filter(app => app.status === 'pending').length
            });
    }
    catch(error){
      console.error("Error fetching applications:", error);
      toast.error("Failed to load companies. Please try again.");
    }
  }
  fetchData();
},[jobs,applications])

  
  const applicationStats = [
    { name: 'pending', value: applications?.filter(app => app.status === 'pending').length },
    { name: 'accepted', value: applications?.filter(app => app.status === 'accepted').length },
    { name: 'rejected', value: applications?.filter(app => app.status === 'rejected').length },
  ];

  const jobTypeStats = [
    { name: 'Full-time', value: jobs?.filter(job => job.contractType === 'Full-time').length },
    { name: 'Internship', value: jobs?.filter(job => job.contractType === 'Internship').length },
    { name: 'Part-time', value: jobs?.filter(job => job.contractType === 'Part-time').length },
    { name: 'Remote', value: jobs?.filter(job => job.contractType === 'Remote').length },
  ];

  return (
    <>
   
    <div className="dashboard-container">
      <SidebarRecruiter />

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
                  <h3>Total Jobs</h3>
                  <p>{stats?.totalJobs}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <FiBriefcase />
                </div>
                <div className="stat-info">
                  <h3>Active Jobs</h3>
                  <p>{stats?.activeJobs}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <FiUsers />
                </div>
                <div className="stat-info">
                  <h3>Total Applications</h3>
                  <p>{stats?.totalApplications}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <FiUsers />
                </div>
                <div className="stat-info">
                  <h3>Pending Applications</h3>
                  <p>{stats?.pendingApplications}</p>
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
                <h3>Job Types Distribution</h3>
                <BarChart width={400} height={300} data={jobTypeStats}>
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
              <h3>Recent Job Postings</h3>
              <table>
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Posted</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.slice(0, 5).map(job => (
                    <tr key={job.id}>
                      <td>{job.title}</td>
                      <td>{job.contractType}</td>
                      <td>{job.location}</td>
                      <td>{job.createdAt.split("T")[0]}</td>
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
  );
};
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default Dashboard;