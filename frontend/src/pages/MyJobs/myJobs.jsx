import React, { useState, useEffect } from "react";
import "./myJobs.css";
import SidebarRecruiter from "../../components/Sidebar/SidebarRecruiter";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Footer from "../../components/Footer/Footer";

const MyJobs = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for the delete modal
  const [categories, setCategories] = useState([]);
  const [jobs, setJobs] = useState([]);
  const token = localStorage.getItem("token");
  const [postJobMode, setPostJobMode] = useState(false);
  const [filtreCategory, setFiltreCategory] = useState("");
  const [filtreStatus, setFiltreStatus] = useState("");
  const [newData, setNewData] = useState({});
  const [editMode, setEditMode] = useState(false);
 const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);
    const [totalPages, setTotalPages] = useState(1);
  
  let {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      contractType: "",
      location: "",
      salary: "",
      status: "",
      category: "",
      requirements:"",
    },
  });
  const [jobId, setJobId] = useState("");

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
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/myjoboffers`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          validateStatus: (status) => true,
          params:{
            page:page, limit:limit,
          }
        });
        console.log("jobs response:", response.data.message.jobs);
        setJobs(response.data.message.jobs.jobOffersWithCategory);

      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load companies. Please try again.");
      }
    };
    const fetchJobsByquery = async () => {
      // console.log("filtre avant la la methode fetch b yq query ",typeof filtreCategory,filtreStatus)

      try {
        const response = await axios.get(
          `http://localhost:8000/myjoboffers?category=${filtreCategory}&status=${filtreStatus}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            validateStatus: (status) => true,
            params:{
            page:page, limit:limit,
          }
          }
        );
        console.log("category dans fetch jobs query:", filtreCategory);

        console.log("jobs response:", response.data.message);
        setJobs(response.data.message.jobOffersWithCategory);
        console.log("math ceil totalpages : ",response.data.message.total)
        setTotalPages(Math.ceil(response.data.message.total / limit));

      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load companies. Please try again.");
      }
    };
    fetchCategories();
    // console.log("filtre :",filtreCategory)
      fetchJobsByquery();



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

  const HandleChange = () => {
    setPostJobMode(true);
  };
  const handleChangeEdit = (job, job_id) => {
    console.log("editttt", job);
    console.log("job_id received:", job_id);
    setEditMode(true);
    setPostJobMode(false);
    setJobId(job_id);
    setValue("title", job.title);
    setValue("description", job.description);
    setValue("contractType", job.contractType);
    setValue("location", job.location);
    setValue("salary", job.salary);
    setValue("status", job.status);
    setValue("category", job.category);
    setValue("requirements",job.requirements);
  };
  // console.log("edit btn mode ",editMode)
  const HandlePostJob = async (data, e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:8000/joboffer`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          validateStatus: (status) => true,
        }
      );
      if (response.status === 200) {
        toast.success("Job offer posted successful!", {
          position: "top-right",
          autoClose: 3000, // Ferme après 3 secondes
        });
        setJobs((prevJobs) => [...prevJobs, response.data.newJobOffer]);

        // console.log("data ::::",response.data)
        setPostJobMode(false);
      } else {
        toast.error(response.data.message || "An error occurred .", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load companies. Please try again.");
    }
  };

  const HandleDeleteJob = async (data) => {
    console.log("job id dans delete:", jobId);
    console.log("data dans delete : ", data);

    try {
      const response = await axios.delete(
        `http://localhost:8000/myjoboffers/${jobId}`,
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
  const HandleEditJob = async (data) => {
    // console.log("job id dans update:",jobId);
    // console.log("data dans update : ",data)
    try {
      const response = await axios.patch(
        `http://localhost:8000/myjoboffers/${jobId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          validateStatus: (status) => true,
        }
      );
      // console.log("jobs response:", response.data.message);
      setNewData((prevData) => ({
        ...prevData, // Garder les anciennes valeurs
        ...response.data.user, // Écraser avec les nouvelles valeurs
      }));
      if (response.status === 200) {
        setJobs(
          jobs.map((job) => (job._id === jobId ? { ...job, ...data } : job))
        );
        toast.success("Update successful! ", {
          position: "top-right",
          autoClose: 3000,
        });
        setEditMode(false);
      } else {
        toast.error(response.data.message || "Error.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to update jobs. Please try again.");
    }
  };

  return (
    <>
    <div className="my-job-list-wrapper">
      <ToastContainer />
      <SidebarRecruiter />
      <div className="my-job-list-container">
        {editMode ? (
          <form className="edit-form" onSubmit={handleSubmit(HandleEditJob)}>
            <h2>Update my job</h2>
            <label>
              title :
              <input type="text" name="title" {...register("title")} />
            </label>
            <label>
              description :
              <input
                type="text"
                name="description"
                {...register("description")}
              />
            </label>
            <label>
              contractType :
              <select name="contractType" {...register("contractType")}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Remote">Remote</option>
                    <option value="Internship">Internship</option>

                  </select>
            </label>
            <label>
              location :
              <input type="text" name="location" {...register("location")} />
            </label>
            <label>
              salary :
              <input type="text" name="salary" {...register("salary")} />
            </label>
            <label>
              requirements :
              <textarea type="text" name="requirements" rows="10" {...register("requirements")}/>
            </label>
            <label>
              status :
              <select name="status" {...register("status")}>
                <option value="open">open</option>
                <option value="closed">closed</option>
              </select>
            </label>
            <label>
              category :
              <select
                className="filter-category"
                name="category"
                {...register("category")}
              >
                <option value="">Category</option>
                {categories?.map((category) => (
                  <option value={category?.name} key={category?._id}>
                    {category?.name}
                  </option>
                ))}
                {/* Ajoute d'autres catégories ici */}
              </select>
            </label>
            <div className="form-buttons">
              <button type="submit" className="save-button">
                Save
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : !postJobMode ? (
          <>
            <div className="my-jobs-header">
              <div className="my-jobs-title-container">My Jobs</div>
              <div className="post-job-btn-container">
                <button className="post-job-btn" onClick={HandleChange}>
                  <i class="bi bi-plus-lg"></i>Post a job
                </button>
              </div>
            </div>
            <div className="my-jobs-container">
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
                        <option value={category.name} key={category._id}>
                          {category.name}
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
              <div className="my-jobs-list-container">
                <div className="my-jobs-fields-container">
                  <div className="my-jobs-fiels">name</div>
                  <div className="my-jobs-fiels">status</div>
                  <div className="my-jobs-fiels">category</div>
                  <div className="my-jobs-fiels">date posted</div>
                  <div className="my-jobs-fiels">job type</div>
                </div>
                <div className="my-jobs">
                  {jobs?.map((job) => (
                    <div key={job._id} className="my-job">
                      <div className="job-title">{job.title}</div>
                      <div className="job-status">{job.status}</div>
                      <div className="job-category">{job.category}</div>
                      <div className="job-date">{job.createdAt}</div>
                      <div className="job-type">{job.contractType}</div>
                      <div key={job._id} className="edit-delete-container">
                        <div
                          onClick={() => handleChangeEdit(job, job._id)}
                          className="edit-job-btn-container"
                        >
                          <i class="bi bi-pencil-square"></i>
                        </div>
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
        ) : (
          <>
            <div className="">
              {/* onSubmit={handleSubmit(HandleEdit)} */}
              <form
                className="edit-form"
                onSubmit={handleSubmit(HandlePostJob)}
              >
                <h2>Post a new job offer</h2>
                <label>
                  title :
                  <input type="text" name="title" {...register("title")} />
                </label>
                <label>
                  description :
                  <textarea
                    type="text"
                    name="description"
                    rows="6"
                    {...register("description")}
                  />
                </label>
                <label>
                  contract type :
                  <select name="contractType" {...register("contractType")}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Remote">Remote</option>
                    <option value="Internship">Internship</option>

                  </select>
                </label>
                <label>
                  location :
                  <input
                    type="text"
                    name="location"
                    {...register("location")}
                  />
                </label>
                <label>
              requirements :
              <textarea type="text" rows="10" name="requirements" {...register("requirements")}/>
            </label>
                <label>
                  salary :
                  <input type="text" name="salary" {...register("salary")} />
                </label>
                <label>
                  category:
                  <select className="filter-category" {...register("category")}>
                    <option value="">Category</option>
                    {categories?.map((category) => (
                      <option value={category.name} key={category._id}>
                        {category.name}
                      </option>
                    ))}
                    {/* Ajoute d'autres catégories ici */}
                  </select>
                </label>
                <label>
                  status :
                  <select name="status" {...register("status")}>
                    <option value="open">open</option>
                    <option value="closed">closed</option>
                  </select>
                </label>
                <div className="form-buttons">
                  <button type="submit" className="save-button">
                    Save
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setPostJobMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
        
      </div>
      
    </div>
    
    <Footer />
    </>

  );
};

export default MyJobs;
