import React, { useState, useEffect } from "react";
import SidebarCandidate from "../../components/Sidebar/SidebarCandidate";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "./MyAppsCand.css";
import { Link, useNavigate } from 'react-router-dom';
const MyAppsCand = () => {
     const [applications, setApplications] = useState([]);
      const [statuses, setStatuses] = useState({});
      const [companynId,setCompanynId]=useState("");
       const [page, setPage] = useState(1);
        const [limit, setLimit] = useState(4);
          const [totalPages, setTotalPages] = useState(1);
            const [filtreStatus, setFiltreStatus] = useState("");
      const token = localStorage.getItem("token");

        const [companyId, setCompanyId] = useState("");
  const [companyData, setCompanyData] = useState(null);
  const [showModal, setShowModal] = useState(false);
      const navigate = useNavigate();
      

       useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/candidate/myapplications`,
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
        console.log("application cand data : ",response.data)
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error("Failed to load companies. Please try again.");
      }
    };
    fetchApplications();
  }, [token,page,limit,filtreStatus]);

  const HandleChangeFiltreStatus = (e) => {
    e.preventDefault();
    setFiltreStatus(e.target.value);
  };
    const changeProfileMode = async (e, companyID) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:8000/candidate/company/${companyID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("companyDataaaa : ",response.data)
      setCompanyId(companyID);
      setCompanyData(response.data.message);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching company data:", error);
      toast.error("Failed to load company profile. Please try again.");
    }
  }
  console.log("companyData : ",companyData)

  const closeModal = () => {
    setShowModal(false);
  }

  return (
    <div className="applications-wrapper">
      <ToastContainer />
      <SidebarCandidate />
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Company Profile</h2>
              <button onClick={closeModal} className="close-modal-btn">&times;</button>
            </div>
            <div className="modal-body">
                {companyData.logo && (
                    <div className="company-logo-container">
                      <img 
                        src={companyData?.logo?.url} 
                        className="company-logo"
                      />
                    </div>
                  )}
              {companyData && (
                <>
                  <div className="company-info">
                    <h3>{companyData.name}</h3>
                    <p><strong>Industry:</strong> {companyData.sector}</p>
                    <p><strong>Location:</strong> {companyData.location}</p>
                    <p><strong>Description:</strong> {companyData.description}</p>
                    {/* Ajoutez d'autres champs ici */}
                  </div>
                
                </>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={closeModal} className="btn btn-close">Close</button>
            </div>
          </div>
        </div>
      )}
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
              <div className="my-applications-fiels">company-name</div>
              <div className="my-applications-fiels">date posted</div>
              <div className="my-applications-fiels">date updated</div>
              <div className="my-applications-fiels">status</div>
              <div className="my-applications-fiels">company-profile</div>

            </div>
            <div className="my-applications">
              {applications.map((application) => (
                <div key={application._id} className="my-application">
                  <div className="application-title app-title-style">
                    {application?.jobTitle}
                  </div>
                  <div className="application-name">
                    {application?.company?.name}
                  </div>
                  {/* <div className="application-email">
                    {application?.candidateID?.email}
                  </div> */}
                  <div className="application-date">
                  {application?.createdAt?.split('T')[0]}
                  </div>
                   <div className="application-date">
                  {application?.updatedAt?.split('T')[0]}
                  </div>
                  <div className="application-status">
                    <div>
                      {application?.status}
                    </div>
                  </div>
                  <div className="check-candidate-profile-btn-container">
                    <button className="check-candidate-profile-btn" onClick={(e)=>changeProfileMode(e,application?.company?._id)}><i class="bi bi-person-square"></i><div>profile</div></button>
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
        <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
          Next
        </button>
      </div>
        {/* ):null} */}
      </div>
    </div>
  )
}


export default MyAppsCand
