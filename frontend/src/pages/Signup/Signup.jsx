import React, { useState, useEffect, useReducer } from "react";
import RoleSwitch from "../../components/Auth/RoleSwitch";
import AuthImage from "../../components/Auth/AuthImage";
import { useForm } from "react-hook-form";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

//check email
const emailReducer = (prevState, actions) => {
  switch (actions.name) {
    case "USER_TYPING":
      // setInputCheck(email:"Enter a valid email address"); car on peut pas utiliser directement setState dans useReducer
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

const phoneNumberReducer = (prevState, actions) => {
  switch (actions.name) {
    case "USER_TYPING":
      return {
        value: actions.payload,
        isValid: /^\d+$/.test(actions.payload),
        error: /^\d+$/.test(actions.payload)
          ? null
          : "enter a valid phone number",
      };
    case "USER_TYPING_DONE":
      return {
        value: prevState.value,
        isValid: /^\d+$/.test(prevState.value),
        error: /^\d+$/.test(prevState.value)
          ? null
          : "enter a valid phone number",
      };

    default:
      return { value: "", isValid: null };
  }
};
const fieldsReducer = (prevState, actions) => {
  switch (actions.type) {  
    case "UPDATE_FIELD":
      return {
        ...prevState,
        //utilisation de clé dynamique 
        [actions.field]: {  
          value: actions.payload,
          isValid: actions.payload.length > 0,
          error: actions.payload.length > 0 ? null : "This field is required"
        }
      };
    case "VALIDATE_FIELD":
      return {
        ...prevState,
        [actions.field]: {
          ...prevState[actions.field],
          isValid: prevState[actions.field]?.value?.length > 0,
          error: prevState[actions.field]?.value?.length > 0 ? null : "This field is required"
        }
      };
    default:
      return {
        name: { value: "", isValid: null, error: null },
        company: { value: "", isValid: null, error: null }
      };
  }
};
const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("candidate");
  //changer le role
  const ChangeRole = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    setValue("role", newRole);
    if (newRole === "recruiter") {
      setRecruiterMode(true);
    } else {
      setRecruiterMode(false);
    }
  };
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
      gender: "",
      phoneNumber: "",
      address: "",
      role: "candidate",
      company: "",
    },
  });

  const [formIsValid, setFormIsValid] = useState(false);

  const [email, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });
  const [password, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });
  const [phoneNumber, dispatchPhoneNumber] = useReducer(phoneNumberReducer, {
    value: "",
    isValid: null,
  });
  const [fields, dispatchFields] = useReducer(fieldsReducer, {
    name: { value: "", isValid: null, error: null },
    company: { value: "", isValid: null, error: null }
  });
  
  const { isValid: emailIsValid } = email;
  const { isValid: passwordIsValid } = password;
  const { isValid: phoneNumberIsValid } = phoneNumber;
  const { isValid: nameIsValid } = fields.name;
  const { isValid: companyIsValid } = fields.company;

  useEffect(() => {
    const timer = setTimeout(() => {
      if(role==="recruiter"){
        setFormIsValid(emailIsValid && passwordIsValid && phoneNumberIsValid && nameIsValid && companyIsValid);
      }
      else{
        setFormIsValid(emailIsValid && passwordIsValid && phoneNumberIsValid && nameIsValid );
      }
    }, 1000);
    console.log("aaaa");
    return () => {
      clearTimeout(timer);
    };
  }, [emailIsValid, passwordIsValid, phoneNumberIsValid,nameIsValid,companyIsValid]);
  const emailChangeHandler = (event) => {
    dispatchEmail({ name: "USER_TYPING", payload: event.target.value });
  };
  const passwordChangeHandler = (event) => {
    dispatchPassword({ name: "USER_TYPING", payload: event.target.value });
  };
  const phoneNumberChangeHandler = (event) => {
    dispatchPhoneNumber({ name: "USER_TYPING", payload: event.target.value });
  };
  const validateEmailHandler = () => {
    setValue("email",email.value);
    dispatchEmail({ name: "USER_TYPING_DONE" });
  };
  const validatePasswordlHandler = () => {
    setValue("password",password.value);
    dispatchPassword({ name: "USER_TYPING_DONE" });
  };
  const validatePhoneNumberHandler = () => {
    setValue("phoneNumber",phoneNumber.value);
    dispatchPhoneNumber({ name: "USER_TYPING_DONE" });
  };
  
  const nameChangeHandler = (event) => {
    dispatchFields({ 
      type: "UPDATE_FIELD", 
      field: "name", 
      payload: event.target.value 
    });
  };
  
  const companyChangeHandler = (event) => {
    dispatchFields({ 
      type: "UPDATE_FIELD", 
      field: "company", 
      payload: event.target.value 
    });
  };
  
  const validateNameHandler = () => {
    setValue("name",fields.name.value);
    dispatchFields({ type: "VALIDATE_FIELD", field: "name" });
  };
  
  const validateCompanyHandler = () => {
    setValue("company",fields.company.value);
    dispatchFields({ type: "VALIDATE_FIELD", field: "company" });
  };

  const [recruiterMode, setRecruiterMode] = useState(false);

  const onSubmit = async (data, e) => {
    e.preventDefault();
    console.log("data : ",data);
    // send data to backend API
    try {
      console.log("Sending data to the server:", data);
      const { company, ...rest } = data;
      var response ;

      if (data.role === "recruiter") {
        response = await axios.post(
          "http://localhost:8000/signuprecruiter",
          data,
          {
            headers: { "content-type": "application/json" },
            validateStatus: (status) => true,
          }
        );
        
      }
      else {
        response = await axios.post("http://localhost:8000/signup", rest, {
          headers: { "content-type": "application/json" },
          validateStatus: (status) => true,
        });
      }
      if (response.status === 200) {
        toast.success("Registration successful! Redirecting to login...", {
          position: "top-right",
          autoClose: 3000, // Ferme après 3 secondes
        });
        setTimeout(() => navigate("/login"), 2000); // Redirige après 2 secondes
      } else {
        toast.error(
          response.data.message || "An error occurred during registration.",
          {
            position: "top-right",
          }
        );
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Failed to connect to the server. Please try again later.", {
        position: "top-right",
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="signup-container">
        <AuthImage />
        <div className="signup-form">
          <div className="signup-form-container">
            <RoleSwitch ChangeRole={ChangeRole} role={role} />
            <h2>Get more opportunities</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="input-container">
                <label>Name</label>
                <input
                  className="input-Field"
                  type="text"
                  // {...register("name")}
                  value={fields.name.value}
                  onChange={nameChangeHandler}
                  onBlur={validateNameHandler}
                  placeholder="username"
                />
                {fields.name.error && (
                  <div className="error-message">{fields.name.error}</div>
                )}
              </div>
              <div className="input-container">
                <label>Email</label>
                <input
                  className="input-Field"
                  type="email"
                  // {...register("email")}
                  value={email.value}
                  onChange={emailChangeHandler}
                  onBlur={validateEmailHandler}
                  placeholder="Email@exp.com"
                />
                {email.error && (
                  <div className="error-message">{email.error}</div>
                )}
              </div>
              <div className="input-container">
                <label>Password</label>
                <input
                  className="input-Field"
                  type="password"
                  // {...register("password")}
                  value={password.value}
                  onChange={passwordChangeHandler}
                  onBlur={validatePasswordlHandler}
                  placeholder="Password"
                />
                {password.error && (
                  <div className="error-message">{password.error}</div>
                )}
              </div>
              <div className="input-container">
                <label>Gender</label>
                <div className="GenderButtons-container">
                  <input
                    className="input-Field-Gender"
                    type="radio"
                    value="male"
                    {...register(`gender`)}
                  />
                  Male
                  <input
                    className="input-Field-Gender"
                    type="radio"
                    value="female"
                    {...register(`gender`)}
                  />
                  Female
                </div>
              </div>
              <div className="input-container">
                <label>BirthDate</label>
                <input
                  className="input-Field"
                  type="date"
                  {...register("birthDate")}
                />
              </div>
              <div className="input-container">
                <label>Address</label>
                <input
                  className="input-Field"
                  type="text"
                  {...register("address")}                  
                  placeholder="Address"
                />
               
              </div>
              <div className="input-container">
                <label>phoneNumber</label>
                <input
                  className="input-Field"
                  type="text"
                  // {...register("phoneNumber")}
                  value={phoneNumber.value}
                  onChange={phoneNumberChangeHandler}
                  onBlur={validatePhoneNumberHandler}
                  placeholder="phoneNumber"
                />
                {phoneNumber.error && (
                  <div className="error-message">{phoneNumber.error}</div>
                )}
              </div>
              {recruiterMode ? (
                <div className="input-container">
                  <label>Company</label>
                  <input
                    className="input-Field"
                    type="text"
                    // {...register("company")}
                    value={fields.company.value}
                  onChange={companyChangeHandler}
                  onBlur={validateCompanyHandler}
                    placeholder="company"
                  />
                  {fields.company.error && (
                  <div className="error-message">{fields.company.error}</div>
                )}
                </div>
                
              ) : null}
              <div className="SubmitButton-container">
                <button type="submit" disabled={!formIsValid}>
                  Continue
                </button>
              </div>
            </form>
            <div className="HaveAnAccount-container">
              <p>
                Already have an account ?{" "}
                <Link to="/Login">
                  <b>Login</b>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
{
  /* <select className='Company-container input-Field' {...register("company")}>
                  <option value="" key={"test"}>Select a company</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company.name}>
                      {company.name}
                    </option>
                  ))}
                </select> */
  // const [companies, setCompanies] = useState([]);
  // useEffect(() => {
  //   const fetchCompanies = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:8000/companies"); // Remplace par l'URL de ton API
  //       console.log("Companies response:", response.data.companies);
  //       setCompanies(response.data.companies);
  //        // Convertir le tableau en JSON et le stocker dans localStorage
  //       localStorage.setItem("companies", JSON.stringify(response.data.companies));
  //       // setCompanies(response.data);
  //       // // Supposons que le backend renvoie un tableau d'objets { id, name }
  //     } catch (error) {
  //       console.error("Error fetching companies:", error);
  //       toast.error("Failed to load companies. Please try again.");
  //     }
  //   };
  //   fetchCompanies();
  // }, []);
}
