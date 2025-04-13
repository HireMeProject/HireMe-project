// import "./Profile.css"
// import SidebarRecruiter from "../Sidebar/SidebarRecruiter";
// import React, { useEffect, useState } from 'react';
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {jwtDecode} from "jwt-decode";
// import { ToastContainer, toast } from 'react-toastify';

// const Profile = () => {
    
//   return (
//     <div className='Profile-wrapper-container'>
//       <SidebarRecruiter />
//       <div className="profile-pic-container">
//         <img src="" alt="" />
//       </div>
//     </div>
//   )
// }

// export default Profile
import "./Profile.css";
import SidebarRecruiter from "../Sidebar/SidebarRecruiter";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from 'react-toastify';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
  
  //console.log("companieeees:",companies);
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token"); // Vérifier la récupération du token
  const role=localStorage.getItem("role");
//Edit
const [newData,setNewData]=useState(null);
 // Gestion des changements dans les champs de formulaire
 const handleChange = () => {
  setEditMode(true);
  console.log("data de handleedit: ",newData);
};
const HandleEdit=async (data)=>{
  console.log("handle edit data :", data);

  try{
    const response=await axios.put("http://localhost/update-profile",data,{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      validateStatus: (status) => true,
    });
   // console.log("response : ",response);
    console.log("new data :", newData);
    if (response.status===200) {
      console.log("response data user : ",response.data)
      setNewData(response.data.user);
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

const handleInputChange = (e) => {
 
  const { name, value } = e.target;
  console.log("name : ",name);
  console.log("value : ",value);
  setNewData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

const [companies, setCompanies] = useState([]);
let {
  register,
  handleSubmit,
  formState: { errors },
}  = useForm({
  defaultValues: user || {} // Initialize with user data if available
});

  useEffect(() => {
    const storedCompanies = localStorage.getItem("companies");

    if (storedCompanies) {
      try {
        const parsedCompanies = JSON.parse(storedCompanies);
      //console.log("Parsed Companies:", parsedCompanies);  // Vérifier le contenu
      setCompanies(parsedCompanies);
      } catch (error) {
        console.error("Erreur lors du parsing des entreprises :", error);
      }
    }
  }, []);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // console.log("Token récupéré pour la requête :", token);
        //console.log("role :", role);

        const response = await axios.get("http://localhost:8000/myprofile", {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log("Réponse du serveur :", response.data);
        setUser(response.data.user);
        setNewData(response.data.user);
        setEditMode(false);
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
      }
    };

    fetchUserProfile();
}, []);
if (!user) {
  return <p>Loading profile...</p>;
}

// Définir les champs à afficher
let profileFields=[];
if(role==="recruiter"){
 profileFields = [
  { label: "User ID", value: user._id },
  { label: "Name", value: user.name },
  { label: "Email", value: user.email },
  { label: "Phone", value: user.phoneNumber },
  { label: "Address", value: user.address },
  { label: "Status", value: user.status },
  //  { label: "Company", value: [<img src={user.companyLogo}/>,user.company] },
  { label: "Company", value: user.data.name },
  { label: "Role", value: user.role }
];

}
else if(role==="candidate"){

}


  return (
    <div className="Profile-wrapper-container">
      <SidebarRecruiter />
      <div className="profile-container">
      {!editMode ? (
          <>
        <h2>My Profile</h2>
            <div className="profile-pic-container">
              <img src={user.profilePhoto} alt="Profile" className="profile-pic" />
            </div>
            <ul className="profile-list">
              {profileFields.map((field,index)=>
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
            </>):( 
              <form className="edit-form" onSubmit={handleSubmit(HandleEdit)}>
              <h2>Update my profile</h2>
              <label>
                name :
                <input type="text" name="name"  value={newData.name || ''} onChange={handleInputChange} />
              </label>
              <label>
                email :
                <input type="email" name="email"  value={newData.email || ''} onChange={handleInputChange} />
              </label>
              <label>
              password :
                <input type="password" name="password"  value={newData.password || ''} onChange={handleInputChange} />
              </label>
              <label>
                phone number :
                <input type="text" name="phoneNumber"  value={newData.phoneNumber || ''} onChange={handleInputChange} />
              </label>
              <label>
              birth date :
                <input type="date" name="birthDate"  value={newData.birthDate || ''} onChange={handleInputChange} />
              </label>
              <label>
              address :
                <input type="text" name="address"  value={newData.address || ''} onChange={handleInputChange} />
              </label>
              <label>
              gender :
                <select name="gender"  value={newData.gender || ''} onChange={handleInputChange}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </label>
              <label>
              Company :
                <select name="company"  value={newData.data.name || ''} onChange={handleInputChange}>
                  <option value="">Select Company</option>
                  {companies.map((company)=>(
                    <option key={company._id} value={company.name}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="form-buttons">
                <button type="button" className="save-button" onClick={HandleEdit} >Sauvegarder</button>
                <button type="button" className="cancel-button" onClick={() => setEditMode(false)}>Annuler</button>
              </div>
            </form>
          )}
      </div>
     
        
    </div>
  );
};

export default Profile;
