import React, { useState, useEffect,useContext } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "./AdminJobs.css";
import Footer from "../../components/Footer/Footer";
import { JobContext } from "../../components/Auth/Context/JobContext";
import SidebarAdmin from "../../components/Sidebar/SidebarAdmin";
const Adminjobs = () => {
    const [jobId, setJobId] = useState("");
        const [showDeleteModal, setShowDeleteModal] = useState(false); // State for the delete modal
          const [categories, setCategories] = useState([]);
          const token = localStorage.getItem("token");
          const [postJobMode, setPostJobMode] = useState(false);
          const [filtreCategory, setFiltreCategory] = useState("");
          const [filtreStatus, setFiltreStatus] = useState("");
            const [limit, setLimit] = useState(4);
               const {
                  jobs,
                  loading,
                  fetchJobs,
                  page,
                  setPage,
                  totalPages,
                  setJobs
                } = useContext(JobContext);
    
        useEffect(() => {
            const fetchCategories = async () => {
              try {
                const response = await axios.get("http://localhost:8000/categories"); // Remplace par l'URL de ton API
                // console.log("categories response:", response.data);
                setCategories(response.data);
              } catch (error) {
                console.error("Error fetching categories:", error);
                toast.error("Failed to load companies. Please try again.");
              }
            };
                     fetchCategories();
                   fetchJobs({filtreCategory,filtreStatus,});
            
            
            
              }, [filtreCategory, filtreStatus,page,limit]);
                    console.log("jobs :", jobs);
                    const HandleChangeCategory = (e) => {
        e.preventDefault();
        setFiltreCategory(e.target.value);
      };
      const HandleChangeStatus = (e) => {
        e.preventDefault();
        setFiltreStatus(e.target.value);
      };
    const HandleDeleteJob = async (data) => {
        console.log("job id dans delete:", jobId);
        console.log("data dans delete : ", data);
    
        try {
          const response = await axios.delete(
            `http://localhost:8000/users-joboffers/${jobId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              validateStatus: (status) => true,
    
            }
          );
          if (response.status === 200) {
            toast.success("Delete successful! ", {
              position: "top-right",
              autoClose: 3000,
            });
            setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
          } else {
            console.log("error message : ",response.data.message)
            toast.error(response.data.message || "Identifiants incorrects.", {
              position: "top-right",
            });
          }
        } catch (error) {
          console.error("Error fetching jobs:", error);
          toast.error("Failed to delete job. Please try again.");
        } finally {
          setShowDeleteModal(false); // Close the modal after delete
        }
      };
    const handleDeleteButtonClick = (id) => {
        setJobId(id);
        setShowDeleteModal(true); // Show modal when delete is clicked
      };
                console.log("jobsss: ",jobs)

  return (
    <>
    <div className="users-job-list-wrapper">
      <ToastContainer />
      <SidebarAdmin />
      <div className="users-job-list-container">
<>
            <div className="users-jobs-header">
              <div className="users-jobs-title-container">My Jobs</div>
              <div className="post-job-btn-container">

              </div>
            </div>
            <div className="users-jobs-container">
              <div className="my-jobs-filter-container">
                <div className="my-jobs-list-title">My Jobs List</div>
                <div className="filter-job-container">
                  <div className="">
                    <select
                      className="filter-category"
                      onChange={HandleChangeCategory}
                    >
                      <option value="">Category</option>
                      {categories?.map((category) => (
                        <option value={category?.name} key={category._id}>
                          {category?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      className="filter-status"
                      onChange={HandleChangeStatus}
                    >
                      <option value="">status</option>
                      <option value="open">open</option>
                      <option value="closed">closed</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="users-jobs-list-container">
                <div className="users-jobs-fields-container">
                  <div className="users-jobs-fiels">Company</div>
                  <div className="users-jobs-fiels">name</div>
                  <div className="users-jobs-fiels">status</div>
                  <div className="users-jobs-fiels">category</div>
                  <div className="users-jobs-fiels">date posted</div>
                  <div className="users-jobs-fiels">job type</div>
                </div>
                <div className="users-jobs">
                  {jobs?.map((job) => (
                    <div key={job._id} className="user-job">
                      <div className="job-title job-company-img "><img src={job?.companyID?.logo?.url} alt="" /></div>
                      <div className="job-title">{job?.title}</div>
                      <div className="job-status">{job?.status}</div>
                      <div className="job-category">{job?.categoryId?.name}</div>
                      <div className="job-date">{job?.createdAt.split("T")[0]}</div>
                      <div className="job-type">{job?.contractType}</div>
                      <div key={job?._id} className="edit-delete-container">
                        
                        <div
                          onClick={() => handleDeleteButtonClick(job._id)}
                          className="delete-job-btn-container"
                        >
                          <i className="bi bi-trash"></i>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Delete Confirmation Modal */}
              {showDeleteModal && (
                <div className="modal-overlay">
                  <div className="modal">
                    <h3>Are you sure you want to delete this job?</h3>
                    <div className="modal-buttons">
                      <button onClick={HandleDeleteJob}>Yes, Delete</button>
                      <button onClick={() => setShowDeleteModal(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page <= 1}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page > totalPages}>
          Next
        </button>
      </div>
            </div>
          </>
       
</div>
      
    </div>
    
    <Footer />
    </>
  )
}

export default Adminjobs
