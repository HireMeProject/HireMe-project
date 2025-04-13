import React, { useState, useEffect } from "react";
import "./Company.css";
import SidebarRecruiter from "../Sidebar/SidebarRecruiter";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";

const Company = () => {
  const [company, setCompany] = useState({});
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true); // <-- Ajout du state "loading"
  const [editMode,setEditMode] = useState(false);
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
  useEffect(() => {
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
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast.error("Failed to load companies. Please try again.");
      }
    };
    GetCompany();
    const GetMembers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/mycompany-members",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            validateStatus: (status) => true,
          }
        );
        // console.log("member status : ", response.data.message);
        if (response.data.status === "success") {
          setMembers(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast.error("Failed to load companies. Please try again.");
      }
    };
    GetMembers();
  }, [token]);
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
                  ...prev.logo, // on garde les autres champs comme publicId
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
  // console.log("company afterr : ", company);

  return (
    <div className="Company-wrapper">
      <SidebarRecruiter />
      <ToastContainer />
      {editMode?(
        <form className="edit-form" onSubmit={handleSubmit(HandleEditCompany)}>
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
          <input
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
            Sauvegarder
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => setEditMode(false)}
          >
            Annuler
          </button>
        </div>
      </form>
      ):(
        <div className="my-company">
        <div className="company-info">
          <div className="edit-company-btn-wrapper">
            <button className="edit-company-btn" onClick={handleChangeEdit}>Edit Company</button>
          </div>

          <div className="company-name-container">
            <img src={company?.logo?.url} alt="" />
            <div className="company-name">
                {company?.name}
            </div>
          </div>
          <div className="company-informations-wrapper">
            <div className="company-employeesNumber">
              <i class="bi bi-people"></i>
              <div className="employeesNumber-label">
                <div className="company-info-label">employees</div>
                <div className="company-label-info">
                  +{company?.employeesNumber}
                </div>
              </div>
            </div>
            <div className="company-foundedDate">
              <i class="bi bi-fire"></i>
              <div className="foundedDate-label">
                <div className="company-info-label">founded</div>
                <div className="company-label-info">
                  {company?.foundedDate?.split("T")[0]}
                </div>
              </div>
            </div>
            <div className="company-location">
              <i class="bi bi-geo-alt"></i>
              <div className="location-label">
                <div className="company-info-label">location</div>
                <div className="company-label-info">{company?.location}</div>
              </div>
            </div>
            <div className="company-location">
            <i class="bi bi-building"></i>
              <div className="location-label">
                <div className="company-info-label">sector</div>
                <div className="company-label-info">{company?.sector}</div>
              </div>
            </div>
          </div>
          <div className="company-desc">
            <div className="desc-label">Description:</div>
            <span>{company?.description}</span>
          </div>
        </div>
        <div className="company-members">
          <h2 className="members-title">Members</h2>
          <div className="members-container">
            {members?.map((member, index) => (
              <ul key={index} className="member-container">
                <li>
                  <img src={member.recruiterID.profilePhoto.url} alt="" />
                </li>
                <li>{member.recruiterID.name}</li>
              </ul>
            ))}
          </div>
        </div>
      </div>

      )}
    </div>
  );
};

export default Company;
