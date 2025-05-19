import React, { useState, useEffect } from "react";
import SidebarRecruiter from "../../components/Sidebar/SidebarRecruiter";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "./MyApplications.css";
import { Link, useNavigate } from 'react-router-dom';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [applicationId,setApplicationId]=useState("");
  const [profileMode,setProfileMode]=useState(false);
   const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(4);
      const [totalPages, setTotalPages] = useState(1);
        const [filtreStatus, setFiltreStatus] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
//get applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/myapplications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
             params:{
              status: filtreStatus,
            page:page, limit:limit,
          }
          }
        );
        console.log("applications response:", response.data.applications);
        setApplications(response.data.applications);
        setTotalPages(Math.ceil(response.data.applications.length / limit));

        // Initialiser l'état des statuts
        const initialStatuses = {};
        response.data.applications.forEach((app) => {
          initialStatuses[app._id] = app.status;
        });
        setStatuses(initialStatuses);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error("Failed to load companies. Please try again.");
      }
    };
    fetchApplications();
  }, [token,page,limit,filtreStatus]);
  //set the new status
  const HandleChangeStatus = async (e, appId) => {
    e.preventDefault();
    const newStatus = e.target.value;
    setStatuses((prevStatus) => ({
      ...prevStatus,
      [appId]: newStatus,
    }));
    
    try {
      console.log("app id: ", appId);
      console.log("data envoyé", newStatus);
      const response = await axios.patch(
        `http://localhost:8000/myapplications/${appId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          validateStatus: (status) => true,

        }
      );
      if (response.status === 200) {
        console.log(
          "application data statussss:",
          response.data.applications.status
        );
        toast.success("Update successful! ", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(response.data.message || "Identifiants incorrects.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load companies. Please try again.");
    }
  };
   const HandleChangeFiltreStatus = (e) => {
    e.preventDefault();
    setFiltreStatus(e.target.value);
  };
  //change profile mode and set application id
  const changeProfileMode=(e,appId)=>{
    setApplicationId(appId);
    e.preventDefault();
    localStorage.setItem("applicationId",appId);
    setTimeout(() => navigate("/candidate-profile"), 1000);  }

  
  return (
    <div className="applications-wrapper">
      <ToastContainer />
      <SidebarRecruiter />
      <div className="my-applications-header">
        <div className="my-applications-title-container">My applications</div>
    
        <div className="my-applications-container">
          <div className="my-applications-filter-container">
            <div className="my-applications-list-title">
              My applications List
            </div>
            <div className="filter-application-container">
              <div className=""></div>
              <div>
                <select className="filter-status" onChange={HandleChangeFiltreStatus}>
                  <option value="">status</option>
                  <option value="pending">pending</option>
                  <option value="accepted">accepted</option>
                  <option value="rejected">rejected</option>
                </select>
              </div>
            </div>
          </div>
          <div className="my-applications-list-container">
            <div className="my-applications-fields-container">
              <div className="my-applications-fiels">job-title</div>
              <div className="my-applications-fiels">candidate-name</div>
              <div className="my-applications-fiels">candidate-email</div>
              <div className="my-applications-fiels">date posted</div>
              <div className="my-applications-fiels">status</div>
              <div className="my-applications-fiels">candidate-profile</div>

            </div>
            <div className="my-applications">
              {applications.map((application) => (
                <div key={application._id} className="my-application">
                  <div className="application-title app-title-style">
                    {application?.jobID?.title}
                  </div>
                  <div className="application-name">
                    {application?.candidateID?.name}
                  </div>
                  <div className="application-email">
                    {application?.candidateID?.email}
                  </div>
                  <div className="application-date">
                  {application?.createdAt?.split('T')[0]}
                  </div>
                  <div className="application-status">
                    <select
                      value={statuses[application._id] || ""}
                      onChange={(e) => HandleChangeStatus(e, application._id)}
                      name="status"
                      id=""
                    >
                      <option value="">status</option>
                      <option value="pending">pending</option>
                      <option value="accepted">accepted</option>
                      <option value="rejected">rejected</option>
                    </select>
                  </div>
                  <div className="check-candidate-profile-btn-container">
                    <button className="check-candidate-profile-btn" onClick={(e)=>changeProfileMode(e,application._id)}><i class="bi bi-person-square"></i><div>profile</div></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page <= 1}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page > totalPages}>
          Next
        </button>
      </div>
        {/* ):null} */}
      </div>
    </div>
  );
};

export default MyApplications;
