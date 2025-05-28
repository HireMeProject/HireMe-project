import React, { useState, useEffect } from "react";
import SidebarRecruiter from "../../components/Sidebar/SidebarRecruiter";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "./Subscription.css";
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";


const Subscription = () => {
  const stripePromise = loadStripe("pk_test_51QRD5k09acFWKvV3ooNsoTBVpQd2yN39XGMimC6YyjQAf51JMQzl8OHDNYNjVcRqnK8TJt9hQk5h2rIUC25uixTA00CCjphbwn");
  
    const [subscription, setSubscription] = useState([]);
    const token = localStorage.getItem("token");
    // const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    //Get subscriptions
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
        // if (subscription.length===0) {
        //     return <p>Loading subscriptions...</p>; 
        // }
        let profileitems;
        profileitems = [
            { label: "Name", value: subscription.name },
            { label: "Description", value: subscription.description },
            { label: "Price", value: subscription.price },
            { label: "Duration", value: subscription.duration },
            { label: "Status", value: subscription.status },           
            ];
    //HandlePay
    const HandleCheckout=async(subsId)=>{
      // localStorage.setItem("subscriptionId",subsId);
      // setTimeout(()=>navigate("/payment/create-checkout-session"),500);
      try{
        console.log("subsId : ",subsId)
        // setLoading(true);
            // setError("");
            // Appel API pour créer la session Stripe
            const response = await fetch("http://localhost:8000/payment/create-checkout-session", {
              method: "POST",
              headers: {Authorization:`Bearer ${token}`,
               "Content-Type": "application/json" },
              body: JSON.stringify({ "subscriptionId":subsId }),
            });
            const data = await response.json();
            console.log("data : ",data);
            console.log("response data : ",response)
if (response.status!==200) {
    toast.error(response.data.message || "An error occurred during registration.", {
      position: "top-right",
    });  }
            // Rediriger vers Stripe Checkout
            const stripe = await stripePromise;
            console.log("sseessionId:",data.sessionId)
            localStorage.setItem("sessionId",data.sessionId);
            console.log("session_id récupéré dans SuccessPage:", typeof sessionId, data.sessionId);

            await stripe.redirectToCheckout({ sessionId: data.sessionId });


      }
      catch(error){
 console.error("Error during  checkout:", error);
  toast.error("Failed to connect to the server. Please try again later.", {
    position: "top-right",
  });  }
    //   finally {
    //     setLoading(false);
    // }
    }
  return (
    <div className="subscription-container">
       <ToastContainer />
        <SidebarRecruiter />
        <div className="my-job-list-container">
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
            <button onClick={()=>HandleCheckout(item._id)} className="btn-pay">Buy</button>
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

export default Subscription
