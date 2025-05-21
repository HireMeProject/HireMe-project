import "./Profile.css";
import SidebarCandidate from "../../components/Sidebar/SidebarCandidate";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from 'react-toastify';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import { IoMail } from "react-icons/io5";
import { BsBuildingFill } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";
import { FaRegCalendarAlt,FaPhoneAlt,FaPencilAlt } from "react-icons/fa";
import Footer from "../../components/Footer/Footer";

const ProfileCandidate = () => {
    const [editMode, setEditMode] = useState(false);
    const [user, setUser] = useState(null);
    const token = localStorage.getItem("token"); // Vérifier la récupération du token
    const role=localStorage.getItem("role");
    const [file, setFile] = useState(null);
    const [cvFile, setCvFile] = useState(null); // Nouvel état pour le fichier CV
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
            const response = await axios.get("http://localhost:8000/candidate/profile", {
                headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              validateStatus: (status) => true,
            });
            console.log("Réponse du serveur dans user profile methode fetch:", response.data);
            setUser(response.data.candidate);
            setNewData(response.data.candidate);
            setEditMode(false);
            // localStorage.setItem("profile-picture",response.data.candidate.profilePhoto.url);
            // reset(response.data.user);
          } catch (error) {
            console.error("Error fetching profile:", error.response?.data || error.message);
          }
        };
      
        fetchUserProfile();
      }, []);
      // if (!user) {
      // return <p>Loading profile...</p>;
      // }
      let profileFields=[];
      profileFields = [
        { label: "Name", value: user?.name },
        { label: "Email", value: user?.email },
        { label: "Phone", value: user?.phoneNumber },
        { label: "Gender", value: user?.gender },
        { label: "Address", value: user?.address },
        { label: "Status", value: user?.status },
        // { label: "CV", value: user?.cv?.url },
        { label: "Skills", value: user?.skills },
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
    console.log("data recuperer ",data)
    
    console.log("new data: 1 ",newData)

    const response=await axios.patch("http://localhost:8000/update-profile",newData,{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      validateStatus: (status) => true,
    });
    
  
    if (response.status===200) {
      setNewData(prevData => ({
        ...prevData, // Garder les anciennes valeurs
        ...response.data.user // Écraser avec les nouvelles valeurs
      }));
      setUser(prevData => ({
        ...prevData, // Garder les anciennes valeurs
        ...newData // Écraser avec les nouvelles valeurs
      }));      
      // reset(response.data.user); 
      toast.success("Update successful! ", {
                            position: "top-right",
                            autoClose: 3000, 
                          });
                          setEditMode(false);
                  } 
                  else {
                    console.log("res ident incorr   :  ",response.data.message);
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
      // setFile(null); // reset le champ fichier
    }
  } catch (error) {
    console.error("Upload failed:", error.message);
    toast.error("Photo upload failed.");
  }
};
console.log("new data: 2",newData)
//CV upload
const handleCvUpload = async () => {
  if (!file) {
    toast.error("Please choose a CV file first.");
    return;
  }

  const formData = new FormData();
  formData.append("cv", file); // important: le nom du champ doit correspondre au backend

  try {
    const response = await axios.post("http://localhost:8000/candidate/upload-Cv", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      },
      validateStatus: (status) => true
    });
    console.log("response cv : ",response.data)
    if (response.status === 200) {
      toast.success("CV uploaded successfully!");
       const newCvData = {
        url: response.data.Cv.url,
        publicId: response.data.Cv.publicId
      };
      
      // Mettre à jour user
      setUser(prev => ({
        ...prev,
        cv: newCvData
      }));
      
      // Mettre à jour AUSSI newData pour que les données soient cohérentes
      setNewData(prev => ({
        ...prev,
        cv: newCvData
      }));

    } else {
      toast.error(response.data.message || "CV upload failed.");
    }
  } catch (error) {
    console.error("Upload failed:", error.message);
    toast.error("CV upload failed.");
  }
};


console.log("new data skills: ",newData?.skills)
return (
    <>
  <div className="Profile-wrapper-container">
            <ToastContainer /> {/* Ajoute le conteneur des notifications */}
    
    <SidebarCandidate />
    <div className="profile-container">
    {!editMode ? (
        <div className="profile-all-container">
                <div className="profile-header">
          <button className="edit-btn" onClick={handleChange}>
            <FaPencilAlt />
          </button>

            <img src={user?.profilePhoto.url} alt="Profile" className="profile-picture" />
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
                <div class="info-section">
                    <h3><i class="fas fa-briefcase"></i> Professional informations</h3>
                <div class="company-section">
                        <h3><BsBuildingFill /> Skills</h3>
                        <p id="company-name">{user?.skills}</p>
                    </div>
                    <div class="company-section">
                        <h3><BsBuildingFill /> CV</h3>
                        <p id="company-name">
                        {user?.cv?.url ? (
    <>
      <a 
        href={user.cv.downloadUrl || `${user.cv.url}?response-content-disposition=attachment`} 
        download
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginRight: "10px" }}
      >
        my CV
      </a>
    </>
  ) : (
    <span>Aucun CV disponible</span>
  )}
    </p>
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
            <label>
            CV :
            <input
  type="file"
  accept=".pdf,.doc,.docx"
  onChange={(e) => setFile(e.target.files[0])}
/>
              <button
    type="button"
    className="upload-photo-btn"
    onClick={handleCvUpload}
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
    Upload Cv
  </button>
            </label>
            <label>
            Skills :
              <textarea type="text" name="skills" value={newData.skills || []}  {...register("skills")} onChange={handleInputChange}  />
            </label>
            <div className="form-buttons">
              <button type="submit" className="save-button"  >Sauvegarder</button>
              <button type="button" className="cancel-button" onClick={() => setEditMode(false)}>Annuler</button>
            </div>
          </form>
        )}
    </div>
   
      
  </div>
        <Footer />
</>

);
};

export default ProfileCandidate
