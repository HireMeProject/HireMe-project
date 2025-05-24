import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Footer from "../../components/Footer/Footer";
import { Link, useNavigate } from 'react-router-dom';
import SidebarAdmin from '../../components/Sidebar/SidebarAdmin';
const MySubscriptions = () => {
const [subscription, setSubscription] = useState([]);
const [subsId, setSubsId] = useState();
    const token = localStorage.getItem("token");
 const [newData, setNewData] = useState({});
  const [editMode, setEditMode] = useState(false);  
    const [postSubsMode, setPostSubsMode] = useState(false);
      const [subscriptions, setSubscriptions] = useState([]);
        const [showDeleteModal, setShowDeleteModal] = useState(false); // State for the delete modal
      
    
     let {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
      } = useForm({
        defaultValues: {
          name: "",
          description: "",
          price: "",
          duration: "",
          status: "",
        },
      });
    useEffect(()=>{
        const GetSubscription=async()=>{
            try{
                const response=await axios.get(`http://localhost:8000/subscriptions`,
                    {headers:{
                        Authorization:`Bearer ${token}`,
                        "Content-Type": "application/json",
                    }},
                    
                );
                // console.log("Subscriptions response apres axios:", response.data.Subscriptions);
                    setSubscription(response.data.Subscriptions);
            }
            catch (error) {
              console.error("Error fetching Subscriptions :", error);
              toast.error("Failed to load  Subscriptions. Please try again.");
            }
        
          };
        GetSubscription();
    
    },[token])
    console.log("candidate profile response:", subscription);    
   
            const HandlePostSubs = async (data, e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:8000/subscriptions`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          validateStatus: (status) => true,
        }
      );
      if (response.status === 200) {
        toast.success("subscription posted successful!", {
          position: "top-right",
          autoClose: 3000, // Ferme après 3 secondes
        });
        setSubscription((prevsubscriptions) => [...prevsubscriptions, response.data.newSubscription]);

        console.log("data ::::",response.data)
        setPostSubsMode(false);
      } else {
        toast.error(response.data.message || "An error occurred .", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Failed to load companies. Please try again.");
    }
  };
  const HandleEditSubs = async (data) => {
    console.log("job id dans update:",subsId);
    console.log("data dans update : ",data)
    try {
      const response = await axios.patch(
        `http://localhost:8000/subscriptions/${subsId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          validateStatus: (status) => true,
        }
      );
      console.log("subscriptions response:", response.data);
      setNewData((prevData) => ({
        ...prevData, // Garder les anciennes valeurs
        ...response.data.Subscriptions, // Écraser avec les nouvelles valeurs
      }));
      if (response.status === 200) {
        setSubscription(
          subscription.map((subs) => (subs._id === subsId ? { ...subs, ...data } : subs))
        );
        toast.success("Update successful! ", {
          position: "top-right",
          autoClose: 3000,
        });
        setEditMode(false);
      } else {
        toast.error(response.data.message || "Identifiants incorrects.", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Failed to update subscriptions. Please try again.");
    }
  };
  const HandleChange = () => {
    setPostSubsMode(true);
  };
   const HandleChangeEditMode =(subs, subs_id) => {
    setEditMode(true);
 
    console.log("editttt", subs);
    console.log("subs_id received:", subs_id);
    setPostSubsMode(false);
    setSubsId(subs_id);
    setValue("name", subs.name);
    setValue("description", subs.description);
    setValue("price", subs.price);
    setValue("duration", subs.duration);
    setValue("status", subs.status);
  };
  return (
    <div className="subscription-container">
       <ToastContainer />
        <SidebarAdmin />
        <div className="my-job-list-container">
        {editMode ? (
          <form className="edit-form" onSubmit={handleSubmit(HandleEditSubs)}>
            <h2>Update my Subscription</h2>
            <label>
              name :
              <input type="text" name="name" {...register("name")} />
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
              price :
              <input type="number" name="price" {...register("price")} />
            </label>
            <label>
              duration :
              <input type="number" name="duration" {...register("duration")} />
            </label>
            <label>
              status :
              <select name="status" {...register("status")}>
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
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
        ) : !postSubsMode ? (
        <div className="my-job-list-container">
          <div className="my-jobs-header">
              <div className="my-jobs-title-container">My Subscriptions</div>
              <div className="post-job-btn-container">
                <button className="post-job-btn" onClick={HandleChange}>
                  <i class="bi bi-plus-lg"></i>Post a subscription
                </button>
              </div>
            </div>
      
        <div className="sub-container">
        {subscription?.map((item,index)=>
        item?(
            <ul key={index} className="subscription-list">
                <div className="Subscription">
                <li className="subscription-item-title">
             {item?.name}
          </li>
          <li className="subscription-item-price">
           {item?.price} $
          </li>
          <li className="subscription-item">
            <strong>Description:</strong> {item?.description}
          </li><li className="subscription-item">
            <strong>Duration:</strong> {item?.duration} days
          </li><li className="subscription-item ">
            <strong>Status:</strong> <span className="subs-status">{item?.status}</span>
          </li>
          
          <div className="pay-btn-container">
                        <button type="submit" onClick={() => HandleChangeEditMode(item, item._id)} className="btn-pay">Edit</button>
          </div>
          </div>
            </ul>
        ):null)
      }    
        </div>
        </div>
         ) : (
          <>
            <div className="">
              {/* onSubmit={handleSubmit(HandleEdit)} */}
              <form
                className="edit-form"
                onSubmit={handleSubmit(HandlePostSubs)}
              >
                <h2>Post a new Subscription</h2>
                <label>
                  name :
                  <input type="text" name="name" {...register("name")} />
                </label>
                <label>
                  description :
                  <textarea
                    type="text"
                    name="description"
                    rows="6"
                    {...register("description")}
                  />
                </label>
                
                <label>
                  price :
                  <input
                    type="number"
                    name="price"
                    {...register("price")}
                  />
                </label>
                <label>
                  duration :
                  <input type="text" name="duration" {...register("duration")} />
                </label>
                
                <label>
                  status :
                  <select name="status" {...register("status")}>
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                </label>
                <div className="form-buttons">
                  <button type="submit" className="save-button">
                    Sauvegarder
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setPostSubsMode(false)}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
        
          </div>
      
    
</div>
  )
}

export default MySubscriptions
