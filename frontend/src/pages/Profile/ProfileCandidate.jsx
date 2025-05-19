// import "./Profile.css";
// import SidebarCandidate from "../../components/Sidebar/SidebarCandidate";
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast, ToastContainer } from 'react-toastify';
// import axios from "axios";
// import 'react-toastify/dist/ReactToastify.css';

// const ProfileCandidate = () => {
//   const [editMode, setEditMode] = useState(false);
//   const [user, setUser] = useState(null);
//   const [cvFile, setCvFile] = useState(null);
//   const [profilePhotoFile, setProfilePhotoFile] = useState(null);
//   const token = localStorage.getItem("token");
//   const [loading, setLoading] = useState(false);

//   const { register, handleSubmit, reset } = useForm();

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const response = await axios.get("http://localhost:8000/candidate/profile", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setUser(response.data.candidate);
//         reset(response.data.candidate);
//       } catch (error) {
//         toast.error("Erreur lors du chargement du profil");
//       }
//     };
//     fetchUserProfile();
//   }, [token, reset]);

//   const handleEditToggle = () => setEditMode(!editMode);

//   const onSubmit = async (data) => {
//     setLoading(true);
//     const formData = new FormData();
    
//     // Ajoute le CV si présent
//     if (cvFile) {
//       formData.append("cv", cvFile);
//     }
    
//     // Ajoute les données textuelles
//     Object.keys(data).forEach(key => {
//       if (key !== "cv" && data[key] !== undefined) {
//         formData.append(key, data[key]);
//       }
//     });

//     try {
//       const response = await axios.patch(
//         "http://localhost:8000/candidate/update-profile",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data'
//           }
//         }
//       );

//       if (response.status === 200) {
//         setUser(response.data.user);
//         toast.success("Profil mis à jour avec succès !");
//         setEditMode(false);
//         setCvFile(null);
//       }
//     } catch (error) {
//       console.error("Update error:", error);
//       toast.error(error.response?.data?.message || "Erreur lors de la mise à jour");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileChange = (e, setFileFunction) => {
//     if (e.target.files && e.target.files[0]) {
//       setFileFunction(e.target.files[0]);
//     }
//   };

//   const profileFields = [
//     { label: "Nom", field: "name", type: "text" },
//     { label: "Email", field: "email", type: "email" },
//     { label: "Téléphone", field: "phoneNumber", type: "text" },
//     { label: "Date de naissance", field: "birthDate", type: "date" },
//     { label: "Adresse", field: "address", type: "text" },
//     { label: "Compétences", field: "skills", type: "text" }
//   ];

//   return (
//     <div className="Profile-wrapper-container">
//       <ToastContainer />
//       <SidebarCandidate />
      
//       <div className="profile-container">
//         {!editMode ? (
//           <>
//             <h2>Mon Profil</h2>
//             <div className="profile-info">
//               <img 
//                 src={user?.profilePhoto?.url || "/default-profile.png"} 
//                 alt="Profile" 
//                 className="profile-pic" 
//               />
              
//               <div className="profile-details">
//                 {profileFields.map(({label, field}) => (
//                   user?.[field] && (
//                     <div key={field} className="profile-field">
//                       <strong>{label}:</strong> 
//                       <span>{Array.isArray(user[field]) ? user[field].join(", ") : user[field]}</span>
//                     </div>
//                   )
//                 ))}
                
//                 <div className="profile-field">
//                   <strong>CV:</strong>
//                   {user?.cv?.file ? (
//                     <a 
//                       href={`http://localhost:8000/${user.cv.file}`} 
//                       target="_blank" 
//                       rel="noopener noreferrer"
//                       className="cv-link"
//                     >
//                       {user.cv.name}
//                     </a>
//                   ) : "Aucun CV téléchargé"}
//                 </div>
//               </div>
//             </div>
            
//             <button onClick={handleEditToggle} className="edit-button">
//               Modifier le profil
//             </button>
//           </>
//         ) : (
//           <form onSubmit={handleSubmit(onSubmit)} className="edit-form">
//             <h2>Modifier le profil</h2>
            
//             {/* Champs de formulaire */}
//             {profileFields.map(({label, field, type}) => (
//               <div key={field} className="form-group">
//                 <label>{label}</label>
//                 {field === "skills" ? (
//                   <textarea
//                     {...register(field)}
//                     defaultValue={Array.isArray(user?.[field]) ? user[field].join(", ") : user?.[field]}
//                   />
//                 ) : (
//                   <input
//                     type={type || "text"}
//                     {...register(field)}
//                     defaultValue={user?.[field]}
//                   />
//                 )}
//               </div>
//             ))}
            
//             {/* Champ CV */}
//             <div className="form-group">
//               <label>CV (PDF uniquement)</label>
//               <input
//                 type="file"
//                 accept="application/pdf"
//                 onChange={(e) => handleFileChange(e, setCvFile)}
//               />
//               {cvFile && (
//                 <span className="file-info">Fichier sélectionné: {cvFile.name}</span>
//               )}
//               {user?.cv?.file && !cvFile && (
//                 <div className="current-file">
//                   CV actuel: <a href={`http://localhost:8000/${user.cv.file}`} target="_blank">{user.cv.name}</a>
//                 </div>
//               )}
//             </div>
            
//             {/* Boutons */}
//             <div className="form-actions">
//               <button type="submit" disabled={loading} className="save-button">
//                 {loading ? "Enregistrement..." : "Enregistrer"}
//               </button>
//               <button 
//                 type="button" 
//                 onClick={handleEditToggle} 
//                 className="cancel-button"
//               >
//                 Annuler
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProfileCandidate;

import "./Profile.css";
import SidebarCandidate from "../../components/Sidebar/SidebarCandidate";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from 'react-toastify';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
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
            // //console.log("Token récupéré pour la requête :", token);
            ////console.log("role :", role);
      
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
            localStorage.setItem("profile-picture",response.data.candidate.profilePhoto.url);
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
      // mise à jour du state
      setUser(prev => ({
        ...prev,
        cv: {
          // url: response.data.user.cv.url,
          // name: response.data.user.cv.name
          url:response.data.Cv.url,
          publicId:response.data.Cv.publicId
        }
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
  <div className="Profile-wrapper-container">
            <ToastContainer /> {/* Ajoute le conteneur des notifications */}
    
    <SidebarCandidate />
    <div className="profile-container">
    {!editMode ? (
        <>
        <h2>My Profile</h2>
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
          <li className="profile-item">
  <strong>CV:</strong>  
  {user?.cv?.url ? (
    <>
      <a 
        href={user.cv.downloadUrl || `${user.cv.url}?response-content-disposition=attachment`} 
        download
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginRight: "10px" }}
      >
        Télécharger le CV
      </a>
      <a 
        href={user.cv.url} 
        target="_blank"
        rel="noopener noreferrer"
      >
        (Voir en ligne)
      </a>
    </>
  ) : (
    <span>Aucun CV disponible</span>
  )}
</li>
          <div className="btn-edit-wrapper">
          <button className="btn-edit" onClick={handleChange}>Edit</button>
          </div>
          </ul>
          </>):( 
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
);
};

export default ProfileCandidate
