import React, { useEffect, useState } from "react";
import SidebarAdmin from '../../components/Sidebar/SidebarAdmin'
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from 'react-toastify';
import { IoMail } from "react-icons/io5";
import { BsBuildingFill } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";

import { FaRegCalendarAlt,FaPhoneAlt,FaPencilAlt } from "react-icons/fa";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import Footer from "../../components/Footer/Footer";
const ProfileAdmin = () => {
    const [editMode, setEditMode] = useState(false);
        const [user, setUser] = useState(null);
        const token = localStorage.getItem("token"); // Vérifier la récupération du token
        const role=localStorage.getItem("role");
        const [file, setFile] = useState(null);
              let {
                register,
                handleSubmit,
                reset,
                formState: { errors },
              }  = useForm({
                defaultValues: user || {} // Initialize with user data if available
              });
              //Edit
              const [newData, setNewData] = useState({});
              useEffect(() => {
        const fetchUserProfile = async () => {
          try {
            const response = await axios.get("http://localhost:8000/profile-admin", {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              validateStatus: (status) => true,
            });
            console.log("Réponse du serveur dans user profile methode fetch:", response.data);
            setUser(response.data.user);
            setNewData(response.data.user);
             setEditMode(false);
            // setEditMode(false);
            //localStorage.setItem("profile-picture",response.data.recruiter.profilePhoto.url);

            // reset(response.data.user);
          } catch (error) {
            console.error("Error fetching profile:", error.response?.data || error.message);
          }
        };
      
        fetchUserProfile();
      }, []);
      let profileFields=[];
profileFields = [
{ label: "Name", value: user?.name },
{ label: "Email", value: user?.email },
{ label: "Phone", value: user?.phoneNumber },
{ label: "Gender", value: user?.gender },
{ label: "Address", value: user?.address },
{ label: "Status", value: user?.status },
{ label: "Role", value: user?.role }
];
// Gestion des changements dans les champs de formulaire
const handleChange = () => {
  setEditMode(true);
  //console.log("data de handleedit: ",newData);
};
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setNewData(prevState => ({
    ...prevState,
    [name]: value,
  }));
};
const HandleEdit=async (data)=>{  
  try{
    // console.log("data recuperer ",data)
    // console.log("token ",token);
    // console.log("new data: 1 ",newData)

    const response=await axios.patch("http://localhost:8000/update-profile",newData,{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      validateStatus: (status) => true,
    });
    
  // const {_id,...newUserData}=response.data.user;
    if (response.status===200) {
      setNewData(prevData => ({
        ...prevData, 
        ...response.data.user 
      }));
      setUser(prevData => ({
        ...prevData, 
        // ...response.data.user 
        ...newData 

      }));

      // reset(response.data.user); 
      toast.success("Update successful! ", {
                            position: "top-right",
                            autoClose: 3000, 
                          });
                          setEditMode(false);
                          // fetchUserProfile(); 
                  } 
                  else {
                      toast.error(response.data.message || "Identifiants incorrects.", {
                            position: "top-right",
                          });
    }
  }
  catch(error){
    console.error("Error fetching companies:", error);
            toast.error("Failed to load companies. Please try again.");

  }
}
const handlePhotoUpload = async () => {
  if (!file) {
    toast.error("Please choose a file first.");
    return;
  }
  const formData = new FormData();
  formData.append("image", file); // Assure-toi que le backend attend "image" comme champ
console.log("formData",formData);
  try {
    const response = await axios.post("http://localhost:8000/profile/profile-photo-upload", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      },
      validateStatus: (status) => true,

    });
        console.log("response picture logo : ",response.data)

    if (response.status === 200) {
      toast.success("Photo uploaded successfully!");
      // Mets à jour le state utilisateur avec la nouvelle photo
      setUser(prev => ({
        ...prev,
        profilePhoto: {
          ...prev.profilePhoto, // on garde les autres champs comme publicId
          url: response.data.profilePhoto.url
        }
      }));
    }
  } catch (error) {
    console.error("Upload failed:", error.message);
    toast.error("Photo upload failed.");
  }
};


  return (
     <>
  <div className="Profile-wrapper-container">
            <ToastContainer /> 
    
    <SidebarAdmin />
    <div className="profile-container">
    {!editMode ? (
        
        <div className="profile-all-container">
        <div className="profile-header">
          <button className="edit-btn" onClick={handleChange}>
            <FaPencilAlt />
          </button>
            <img src={user?.profilePhoto?.url} alt="Profile" className="profile-picture" />
        <h1 class="profile-user-name" >{user?.name}</h1>
        <h2 class="profile-user-role">{user?.role}</h2>
        <span class="profile-user-status">{user?.status}</span>
        </div>
        <div class="profile-body">
                <div class="info-section">
                    <h3><i class="fas fa-user-circle"></i> Personal informations</h3>
                    
                    <div class="info-item">
                        <div class="info-icon">
                            <IoMail />
                        </div>
                        <div class="info-content">
                            <h4>Email</h4>
                            <p id="profile-email">{user?.email}</p>
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-icon">
                            <FaPhoneAlt />
                        </div>
                        <div class="info-content">
                            <h4>Phone number</h4>
                            <p id="profile-phone">{user?.phoneNumber}</p>
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-icon">
                            <i class="fas fa-venus-mars"></i>
                        </div>
                        <div class="info-content">
                            <h4>Gender</h4>
                            <p id="profile-gender">{user?.gender}</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-icon">
                            <FaRegCalendarAlt />
                        </div>
                        <div class="info-content">
                            <h4>Birthdate</h4>
                            <p id="profile-gender">{user?.birthDate?.split('T')[0]}</p>
                        </div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-icon">
                            <MdLocationOn />
                        </div>
                        <div class="info-content">
                            <h4>Adress</h4>
                            <p id="profile-address">{user?.address}</p>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
          
        
          ):( 
            <form className="edit-form" onSubmit={handleSubmit(HandleEdit)}>
            <h2>Update my profile</h2>
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
              name :
              <input type="text" name="name"  value={newData.name || ''} {...register("name")} onChange={handleInputChange} />
            </label>
            <label>
              email :
              <input type="email" name="email"  value={newData.email || ''} {...register("email")} onChange={handleInputChange} />
            </label>
            <label>
            password :
              <input type="password" name="password"  value={newData.password || ''} {...register("password")} onChange={handleInputChange} />
            </label>
            <label>
              phone number :
              <input type="text" name="phoneNumber"  value={newData.phoneNumber || ''} {...register("phoneNumber")} onChange={handleInputChange} />
            </label>
            <label>
            birth date :
              <input type="date" name="birthDate"  value={newData.birthDate || ''} {...register("birthDate")} onChange={handleInputChange} />
            </label>
            <label>
            address :
              <input type="text" name="address"  value={newData.address || ''} {...register("address")} onChange={handleInputChange} />
            </label>
            <label>
            gender :
              <select name="gender"  value={newData.gender || ''} {...register("gender")} onChange={handleInputChange}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            
            <div className="form-buttons">
              <button type="submit" className="save-button"  >Save</button>
              <button type="button" className="cancel-button" onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </form>
        )}
    </div>
   

  </div>
      <Footer />
</>
  )
}

export default ProfileAdmin
