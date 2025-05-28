import React, { useState, useEffect } from "react";
import "./Company.css";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaMapLocationDot,FaBuilding } from "react-icons/fa6";

import SidebarRecruiter from "../../components/Sidebar/SidebarRecruiter";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Footer from "../../components/Footer/Footer"

const Company = () => {
  const [company, setCompany] = useState({});
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true); // <-- Ajout du state "loading"
  // const [employees, setEmployees] = useState([]); // liste locale des employés avec index et data
  const [newEmployee, setNewEmployee] = useState({ name: "", email: "", position: "" });
  
  const [editMode,setEditMode] = useState(false);
  const [addEmpForm,setAddEmpForm]=useState(false);
  const token = localStorage.getItem("token");
  const [file,setFile]=useState(null);
   let {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
    } = useForm({
      defaultValues: {
        sector: "",
        description: "",
        employeesNumber: "",
        location: "",
        foundedDate: "",
        employeesList:[]
      },
    });
    //pour recuperer les valeurs dans edit page
    const handleChangeEdit=(e)=>{
      setEditMode(true);
      setValue("description",company.description);
      setValue("sector",company.sector);
      setValue("employeesNumber",company.employeesNumber);
      setValue("location",company.location);
      setValue("foundedDate",company.foundedDate);

    }
     const GetCompany = async () => {
      try {
        const response = await axios.get("http://localhost:8000/mycompany", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          validateStatus: (status) => true,
        });
        console.log("company data dans fetch : ", response.data.message.companyID);
        if (response.data.status === "success") {
          setCompany(response.data.message.companyID);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching companies:", error);
        toast.error("Failed to load companies. Please try again.");
      }
    };
  useEffect(() => {
   
    GetCompany();

  }, [token]);
                console.log("company employees : ",company.employeesList)

  const HandleEditCompany=async(data)=>{
    try{
      const response=await axios.patch("http://localhost:8000/mycompany",data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("edit company data : ",response.data)
      if(response.status===200){
        setCompany((prevData)=>({
          ...prevData,
          ...data
        }));
        toast.success("Update successful! ", {
                  position: "top-right",
                  autoClose: 3000,
                });
        setEditMode(false);
        await GetCompany();
      }
      else {
              toast.error(response.data.message || "Identifiants incorrects.", {
                position: "top-right",
              });
            }

    }
    catch(error){
      console.error("Error fetching companies:", error);
        toast.error("Failed to edit company. Please try again.");
    }
  }
  const handlePhotoUpload=async()=>{
    try{
      if(!file){
        toast.error("Please choose a file first.");
        return;
      }
      const formData=new FormData();
      formData.append("image",file);
      console.log("file data : ",company);
      const response=await axios.post("http://localhost:8000/mycompany/logo-photo-upload",formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          },
        });
        console.log("response picture logo : ",response.data)
        if (response.status === 200) {
              toast.success("Photo uploaded successfully!");
              // Mets à jour le state utilisateur avec la nouvelle photo
              setCompany(prev => ({
                ...prev,
                logo: {
                  ...prev.logo, 
                  url: 
                  response.data.logo.url
                }
              }));
              setFile(null); // reset le champ fichier
            }
    }catch(error){
      console.error("Error fetching companies:", error);
      toast.error("Failed to edit company. Please try again.");
    }
  }

  const handleAddEmployee=async(e)=>{
    e.preventDefault();
    try{
const response=await axios.post(`http://localhost:8000/mycompany/addMembers/${company._id}`,newEmployee,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        if(response.status===200){
         await GetCompany(); // Recharger les données de l'entreprise
        setNewEmployee({ name: "", position: "", email: "" });
        toast.success("Employee added successfully!");
        }
        setAddEmpForm(false);
        
    }
    catch (err) {
            toast.error("Failed to add employees to company. Please try again.");
      console.error("Erreur ajout employé:", err);
    }
  }

  //handle upload emp photo
  const handleEmpPhotoUpload = async(index)=>{
    if (!file) {
        toast.error("Please choose a file first.");
      return;
    }
     try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(
        `http://localhost:8000/mycompany/${company.name}/employee-photo-upload?index=${index}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200) {
        toast.success("Photo uploaded successfully !");
        // Met à jour la photo dans la liste locale
        setCompany(prev => ({
          ...prev,
          employeesList: prev.employeesList.map((emp, empIndex) =>
            empIndex === index 
              ? { ...emp, profilePic: { url: res.data.profilePic.url } }
              : emp
          )
        }));
        setFile(null);
        setAddEmpForm(false);

      }
    } catch (err) {
      console.error("Erreur upload photo:", err);
      toast.success("Error while uploading profile picture !");
    }
  };
  const handleChangeAddEmp=()=>{
      setAddEmpForm(true);
  }

  return (
    <>
    <div className="Company-wrapper">
      <SidebarRecruiter />
      <ToastContainer />
      {editMode?(
        <form className="edit-form-comp" onSubmit={handleSubmit(HandleEditCompany)}>
        <h2>Update Company</h2>
        <div>
            <div>
  <label htmlFor="file">Choose profile photo</label>
  <input
    type="file"
    name="file"
    id="file"
    accept="image/*"
    onChange={(e) => setFile(e.target.files[0])}
  />
  <button
    type="button"
    className="upload-photo-btn"
    onClick={handlePhotoUpload}
    style={{
      marginTop: "0.5rem",
      backgroundColor: "#2563eb",
      color: "white",
      border: "none",
      padding: "0.4rem 0.8rem",
      borderRadius: "8px",
      cursor: "pointer"
    }}
  >
    Upload Photo
  </button>
</div>

          </div>
        <label>
          Sector :
          <input type="text" name="sector" {...register("sector")} />
        </label>
        <label>
          description :
          <textarea
            type="text"
            name="description"
            {...register("description")}
          />
        </label>
        <label>
          location :
          <input type="text" name="location" {...register("location")} />
        </label>
        <label>
        employeesNumber :
          <input type="text" name="employeesNumber" {...register("employeesNumber")} />
        </label>
        <label>
        foundedDate :
          <input type="date" name="foundedDate" {...register("foundedDate")}/>
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
      ):(
       
        <div className="my-company-profile">
           <header className="my-company-header">
             <div className="my-company-container">
            <div class="logo-container">
            <img src={company?.logo?.url} className="my-company-logo" alt="" />
            </div>
            <h1 className="my-company-name">{company?.name}</h1>
            <div className="my-company-tagline">
                    {company?.sector}
                  </div>
            <div className="my-company-stats">
              <div className="stats-item">
                <BsFillPeopleFill />

                  <div className="stat-value">
                    {company?.employeesNumber}+
                  </div>
                  <div className="stat-label">
                    Employees
                  </div>
                  </div>
                  <div className="stats-item">
                    <FaMapLocationDot />
                  <div className="stat-value">
                    {company?.location}
                  </div>
                  <div className="stat-label">
                    Location
                  </div>
                  </div>
                  <div className="stats-item">
                    <FaBuilding />
                  <div className="stat-value">
                    {company?.foundedDate?.split("T")[0]}
                  </div>
                  <div className="stat-label">
                    Established
                  </div>
              </div>
            </div>
     </div>
      </header>


          <main className="my-company-container">
            <section className="section">
              <div className="section-header">
              <h2 class="section-title">Description</h2>
             <button className="edit-company-btn" onClick={handleChangeEdit}>
                Edit
              </button>
              </div>
            <div className="my-company-desc">
              <p>{company?.description}</p>
            </div>
          </section>
          <section className="section">
            <div className="section-header">
            <h2 class="section-title">Our Team</h2>
            <button className="addEmp-btn" onClick={handleChangeAddEmp}>+ Add Member</button>
          </div>
{addEmpForm &&(
            <form onSubmit={handleAddEmployee} className="add-employee-form">
        <input
          type="text"
          placeholder="Nom"
          value={newEmployee.name}
          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newEmployee.email}
          onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Position"
          value={newEmployee.position}
          onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
          required
        />
         <div className="form-actions">
                  <button type="submit">Add Employee</button>
                  <button type="button" onClick={() => setAddEmpForm(false)}>
                    Cancel
                  </button>
                </div>
      </form>

          )}
          <div className="employees-grid">
            {company?.employeesList?.map((emp, index) => (
                <div key={index} className="employee-card">
                  <img 
                    src={emp.profilePic?.url } 
                    alt={emp.name} 
                    className="employee-photo" 
                  />
                  <div className="employee-info">
                    <h3 className="employee-name">{emp.name}</h3>
                    <p className="employee-position">{emp.position}</p>
                    <p className="employee-email">{emp.email}</p>
                    
                    <div className="upload-section">
                      <input 
                        type="file" 
                        id={`employee-photo-${index}`}
                        onChange={(e) => setFile(e.target.files[0])} 
                        className="visually-hidden"
                      />
                      <label 
                        htmlFor={`employee-photo-${index}`} 
                        className="upload-label"
                      >
                        Change Photo
                      </label>
                      <button 
                        onClick={() => handleEmpPhotoUpload(index)}
                        className="upload-member-button"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
              ))}
               {/* {company?.employeesList?.map((emp, index) => (
                <div key={`new-${index}`} className="employee-card">
                  <img 
                    src="https://via.placeholder.com/200x200?text=New+Member" 
                    alt={emp?.name} 
                    className="employee-photo" 
                  />
                  <div className="employee-info">
                    <h3 className="employee-name">{emp?.name}</h3>
                    <p className="employee-position">{emp?.position}</p>
                    <p className="employee-email">{emp?.email}</p>
                  </div>
                </div>
              ))} */}
            </div>
          </section>
  
          </main>
           </div>
      

      )}
      
    </div>
    <Footer />
    </>
  );
};

export default Company;
