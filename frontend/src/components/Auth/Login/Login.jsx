import React, { useState, useEffect , useContext } from 'react';
import RoleSwitch from '../Signup/RoleSwitch';
import AuthImage from '../AuthImage';
import {useForm } from 'react-hook-form';
import './Login.css';
import { useNavigate,Link } from 'react-router-dom';
import { LoginContext } from '../Context/Context';
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

const Login = () => {
  const { loginData, setLoginData } = useContext(LoginContext);
  const [role,setRole]=useState("candidate");
  const ChangeRole=(e)=>{
    setValue("role", e.target.value);
    setRole(e.target.value);
  }
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
} = useForm({
  defaultValues:{
    role:role
  }
});

const navigate = useNavigate(); 
const onSubmit = async (data,event) => {
  console.log("role : ",role);
  console.log("data : ",data);
  event.preventDefault();  

        try {
            const response = await axios.post("http://localhost:8000/login",data, { 
                headers: {
                    "Content-Type": "application/json",
                },
                validateStatus: (status) => true, // This prevents Axios from throwing an error automatically
            });
            console.log("response : ",response);

            console.log("Réponse brute :", response.data);

            if (response.status===200) {
                // Si la connexion est réussie, stockez le token et redirigez
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("role", response.data.user.role);// Stockez le rôle renvoyé par l'API
                setLoginData({ token: response.data.token });
                setLoginData({role: response.data.user.role})
                console.log("role de login : ",response.data.user.role);

                // localStorage.setItem("id",result.id) ;

                toast.success("Login successful! Redirecting to your account...", {
                      position: "top-right",
                      autoClose: 3000, 
                    });
                    if(role==="candidate"){
                      navigate("/Dashboard-candidate"); 
                    }
                    else{
                      navigate("/Dashboard"); 
                    }
            } 
            else {
                toast.error(response.data.message || "Identifiants incorrects.", {
                      position: "top-right",
                    });}
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
           toast.error("Failed to connect to the server. Please try again later.", {
               position: "top-right",
             });  }
           
           };
  return (
    <>
    <ToastContainer />
    <div className='signup-container'>
        <AuthImage />
        <div className="signup-form">
          <div className="signup-form-container">
            <RoleSwitch ChangeRole={ChangeRole} role={role} {...register("role")}/>
            <h2>Let's get started</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" {...register("role")} value={role} />
              <div className="input-container">
                  <label>Email</label>
                  <input className='input-Field' type="email" {...register("email")} placeholder='Email@exp.com'   />
              </div>
              <div className="input-container">
                  <label>Password</label>
                  <input className='input-Field' type="password" {...register("password")} placeholder='Password' />
              </div>
              <div className="SubmitButton-container">
                  <button type="submit">Login</button>
                </div>
            </form>
            <div className='HaveAnAccount-container'>
                    <p>You don't have an account ? <Link to='/Signup'><b>Signup</b></Link></p>
                </div>

          </div>
        </div>
    </div>
    </>
  )
}

export default Login
