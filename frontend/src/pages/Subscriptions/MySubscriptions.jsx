import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Footer from "../../components/Footer/Footer";
import { Link, useNavigate } from 'react-router-dom';
import SidebarAdmin from '../../components/Sidebar/SidebarAdmin';
const MySubscriptions = () => {
const [subscription, setSubscription] = useState([]);
    const token = localStorage.getItem("token");
    const [editMode,setEditMode]=useState(false);
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
     let profileitems;
        profileitems = [
            { label: "Name", value: subscription.name },
            { label: "Description", value: subscription.description },
            { label: "Price", value: subscription.price },
            { label: "Duration", value: subscription.duration },
            { label: "Status", value: subscription.status },           
            ];
  return (
    <div className="subscription-container">
       <ToastContainer />
        <SidebarAdmin />
        <div className="Subscription-wrapper">
        <h2>Subscriptions</h2>
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
                        <button onClick={()=>HandleCheckout(item._id)} className="btn-pay">Edit</button>
          </div>
          </div>
            </ul>
        ):null)
      }    
        </div>
        </div>
        
    
</div>
  )
}

export default MySubscriptions
