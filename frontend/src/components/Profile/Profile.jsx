import "./Profile.css";
import SidebarRecruiter from "../Sidebar/SidebarRecruiter";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from 'react-toastify';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
const Profile = () => {
  const [editMode, setEditMode] = useState(false);
    const [user, setUser] = useState(null);
    const token = localStorage.getItem("token"); // Vérifier la récupération du token
    const role=localStorage.getItem("role");
    const [companies, setCompanies] = useState([])
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
        const storedCompanies = localStorage.getItem("companies");
      
        if (storedCompanies) {
          try {
            const parsedCompanies = JSON.parse(storedCompanies);
          ////console.log("Parsed Companies:", parsedCompanies);  // Vérifier le contenu
          setCompanies(parsedCompanies);
          } catch (error) {
            console.error("Erreur lors du parsing des entreprises :", error);
          }
        }
      }, []);
      useEffect(() => {
        const fetchUserProfile = async () => {
          try {
            // //console.log("Token récupéré pour la requête :", token);
            ////console.log("role :", role);
      
            const response = await axios.get("http://localhost:8000/profile", {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              validateStatus: (status) => true,
            });
            console.log("Réponse du serveur dans user profile methode fetch:", response.data);
            setUser(response.data.recruiter);
            setNewData(response.data.recruiter);
            setEditMode(false);
            // reset(response.data.user);
          } catch (error) {
            console.error("Error fetching profile:", error.response?.data || error.message);
          }
        };
      
        fetchUserProfile();
        // localStorage.setItem("profilePic",user?.profilePhoto.url);
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
{ label: "Company", value: user?.company },
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
// console.log("new data: 2",newData)
// console.log("profile-pic",user?.profilePhoto.url)
return (
  <div className="Profile-wrapper-container">
            <ToastContainer /> {/* Ajoute le conteneur des notifications */}
    
    <SidebarRecruiter />
    <div className="profile-container">
    {!editMode ? (
        
        <div className="profile-all-container">
        <h2>My Profile</h2>
        <div className="profile-content-container">
<div className="profile-pic-container">
            <img src={user?.profilePhoto.url} alt="Profile" className="profile-pic" />
          </div>
          <ul className="profile-list">
            {profileFields?.map((field,index)=>
            field.value?(
              <li key={index} className="profile-item">
                <strong>{field.label}:</strong> {field.value}
              </li>
            ):null)
          }
          <div className="btn-edit-wrapper">
          <button className="btn-edit" onClick={handleChange}>Edit</button>
          </div>
          </ul>
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
            Company :
              <select name="company"  value={newData.company || ''}  onChange={handleInputChange}>
                <option value="">Select Company</option>
                {companies.map((company)=>(
                  <option key={company._id} value={company.name}>
                    {company.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="form-buttons">
              <button type="submit" className="save-button"  >Sauvegarder</button>
              <button type="button" className="cancel-button" onClick={() => setEditMode(false)}>Annuler</button>
            </div>
          </form>
        )}
    </div>
   
      
  </div>
);
};

export default Profile
