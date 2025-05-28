import React, { useState, useEffect , useReducer , useContext } from 'react';
import RoleSwitch from '../../components/Auth/RoleSwitch';
import AuthImage from '../../components/Auth/AuthImage';
import {useForm } from 'react-hook-form';
import './Login.css';
import { useNavigate,Link } from 'react-router-dom';
import { LoginContext } from '../../components/Auth/Context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

const emailReducer = (prevState, actions) => {
  switch (actions.name) {
    case "USER_TYPING":
      // setInputCheck(email:"Enter a valid email address"); 
      return {
        value: actions.payload,
        isValid: actions.payload.includes("@"),
        error: actions.payload.includes("@") ? null : "Enter a valid email address",
      };
    case "USER_TYPING_DONE":
      return {
        value: prevState.value,
        isValid: prevState.value.includes("@"),
        error: prevState.value.includes("@") ? null : "Enter a valid email address",
      };
    default:
      return { value: "", isValid: null };
  }
};
const passwordReducer = (prevState, actions) => {
  switch (actions.name) {
    case "USER_TYPING":
      return {
        value: actions.payload,
        isValid: actions.payload.length >= 8,
        error: actions.payload.length >= 8
          ? null
          : "Your password should have at least 8 letters",
      };
    case "USER_TYPING_DONE":
      return {
        value: prevState.value,
        isValid: prevState.value.length >= 8,
        error: prevState.value.length >= 8
          ? null
          : "Your password should have at least 8 letters",
      };
    default:
      return { value: "", isValid: null };
  }
};

const Login = () => {
   const [email, dispatchEmail] = useReducer(emailReducer, {
      value: "",
      isValid: null,
    });
    const [password, dispatchPassword] = useReducer(passwordReducer, {
      value: "",
      isValid: null,
    });
      const [formIsValid, setFormIsValid] = useState(false);
    
    const { isValid: emailIsValid } = email;
    const { isValid: passwordIsValid } = password;
  const { loginHandler } = useContext(LoginContext);
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
 useEffect(() => {
    const timer = setTimeout(() => {
        setFormIsValid(emailIsValid && passwordIsValid );
    }, 1000);
    console.log("aaaa");
    return () => {
      clearTimeout(timer);
    };
  }, [emailIsValid, passwordIsValid]);
  const emailChangeHandler = (event) => {
    dispatchEmail({ name: "USER_TYPING", payload: event.target.value });
  };
  const passwordChangeHandler = (event) => {
    dispatchPassword({ name: "USER_TYPING", payload: event.target.value });
  };
  const validateEmailHandler = () => {
    setValue("email",email.value);
    dispatchEmail({ name: "USER_TYPING_DONE" });
  };
  const validatePasswordlHandler = () => {
    setValue("password",password.value);
    dispatchPassword({ name: "USER_TYPING_DONE" });
  };

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
                // pour eviter Axios de retourner un error automatically
                validateStatus: (status) => true, 
            });
            console.log("Réponse brute :", response.data);

            if (response.status===200) {
                loginHandler(response.data.token, response.data.user.role);
                
                console.log("role de login : ",response.data.user.role);

                // localStorage.setItem("id",result.id) ;
if(response.data.user.status==="active"){
                toast.success("Login successful! Redirecting to your account...", {
                      position: "top-right",
                      autoClose: 3000, 
                    });
                    

                    
                    if(role==="candidate"){
                      navigate("/Dashboard-candidate"); 
                    }
                    else if (role==='recruiter'){
                      navigate("/Dashboard"); 
                    }
                    else if(role==="admin"){
                      navigate("/Dashboard-admin"); 
                    }
                    }
                    else{
                      toast.error(response.data.message || "Your account is inactive for the moment.", {
                      position: "top-right",
                    });
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
                  <input className='input-Field' 
                  type="email" 
                  value={email.value}
                  onChange={emailChangeHandler}
                  onBlur={validateEmailHandler}
                    placeholder='Email@exp.com'   />
                     {email.error && (
                  <div className="error-message">{email.error}</div>
                )}
              </div>
              <div className="input-container">
                  <label>Password</label>
                  <input className='input-Field'
                   type="password"  
                   value={password.value}
                  onChange={passwordChangeHandler}
                  onBlur={validatePasswordlHandler}
                   placeholder='Password' />
                   {password.error && (
                  <div className="error-message">{password.error}</div>
                )}
              </div>
              <div className="SubmitButton-container">
                  <button type="submit" disabled={!formIsValid}>Login</button>
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
