import React, { useState, useEffect } from 'react';
import RoleSwitch from './RoleSwitch';
import AuthImage from '../AuthImage';
import {useForm } from 'react-hook-form';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
const Signup = () => {
  const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
  const [role,setRole]=useState("candidate");
  const ChangeRole=(e)=>{ 
    const newRole=e.target.value;
    setRole(newRole);
    setValue("role", newRole);
    if(newRole==="recruiter"){
      setRecruiterMode(true);
    }
    else{
      setRecruiterMode(false);
    }
  }
  let {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
} = useForm({
    defaultValues: {
        name: "",
        email: "",
        password: "",
        birthDate: "",
        gender:"",
        phoneNumber: "",
        address:"",
        role:"candidate",
        company:""
    }
});
const [recruiterMode,setRecruiterMode]=useState(false);
  const [companies, setCompanies] = useState([]);
  useEffect(() => {
    
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("http://localhost:8000/companies"); // Remplace par l'URL de ton API
        console.log("Companies response:", response.data.companies);
        setCompanies(response.data.companies);
        // localStorage.setItem("companies", response.data.companies);// Stockez le rôle renvoyé par l'API
        // Convertir le tableau en JSON et le stocker dans localStorage
        localStorage.setItem("companies", JSON.stringify(response.data.companies));

        // setCompanies(response.data); 
        // // Supposons que le backend renvoie un tableau d'objets { id, name }
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast.error("Failed to load companies. Please try again.");
      }
    };
  
    fetchCompanies();
  }, []);

const onSubmit = async(data,e) => {
  e.preventDefault();
  
  setError(null); // Réinitialise les erreurs
  setSuccess(null);
  console.log(data)
  // send data to backend API
  try { 
    console.log("Sending data to the server:", data);
    const { company, ...rest } = data;
      var response = await axios.post("http://localhost:8000/signup",rest, {
        headers: {'content-type' : 'application/json'},
        validateStatus: (status) => true,
    });
    
    if(data.role==="recruiter"){
      
      response = await axios.post("http://localhost:8000/signuprecruiter",data, {
        headers: {'content-type' : 'application/json'},
        validateStatus: (status) => true,
    });
    }
    console.log(" data envoyé : ",data);
    console.log("Réponse brute :", response.data);

  if (response.status===200) {
    toast.success("Registration successful! Redirecting to login...", {
      position: "top-right",
      autoClose: 3000, // Ferme après 3 secondes
    });
    setTimeout(() => navigate("/login"), 2000); // Redirige après 2 secondes
  } else {
    toast.error(response.data.message || "An error occurred during registration.", {
      position: "top-right",
    });  }
  } catch (error) {
  console.error("Error during registration:", error);
  toast.error("Failed to connect to the server. Please try again later.", {
    position: "top-right",
  });  }

}


  
  return (
    <>
        <ToastContainer /> {/* Ajoute le conteneur des notifications */}
        <div className="signup-container">
          <AuthImage />
        <div className="signup-form">
          <div className="signup-form-container">
              <RoleSwitch ChangeRole={ChangeRole} role={role} />
              <h2>Get more opportunities</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-container">
                  <label>Name</label>
                  <input className='input-Field' type="text" {...register("name")} placeholder='username'   />
                </div>
                <div className="input-container">
                  <label>Email</label>
                  <input className='input-Field' type="email" {...register("email")} placeholder='Email@exp.com'   />
                </div>
                <div className="input-container">
                  <label>Password</label>
                  <input className='input-Field' type="password" {...register("password")} placeholder='Password' />
                </div>
                <div className="input-container">
                  <label>Gender</label>
                  <div className="GenderButtons-container">
                  <input className='input-Field-Gender' type="radio" value="male" {...register(`gender`)}  />Male
                  <input className='input-Field-Gender' type="radio" value="female" {...register(`gender`)}  />Female
                  </div>
                </div>
                <div className="input-container">
                  <label>BirthDate</label>
                  <input className='input-Field' type="date" {...register("birthDate")}  />
                </div>
                <div className="input-container">
                  <label>Address</label>
                  <input className='input-Field' type="text" {...register("address")} placeholder='Address'   />
                </div>
                <div className="input-container">
                  <label>phoneNumber</label>
                  <input className='input-Field' type="text" {...register("phoneNumber")} placeholder='phoneNumber'   />
                </div>
                {recruiterMode?(
                  <div className="input-container">
                  <label>Company</label>
                  <select className='Company-container input-Field' {...register("company")}>
                  <option value="" key={"test"}>Select a company</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company.name}>
                      {company.name}
                    </option>
                  ))}
                </select>
                </div>):null}
                <div className="SubmitButton-container">
                  <button type="submit">Continue</button>
                </div>
              </form>
              <div className='HaveAnAccount-container'>
                    <p>Already have an account ? <Link to='/Login'><b>Login</b></Link></p>
                </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default Signup;
