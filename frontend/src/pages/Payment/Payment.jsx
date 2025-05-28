import React, { useState, useEffect } from "react";
import SidebarRecruiter from "../../components/Sidebar/SidebarRecruiter";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "./Payment.css";
import { Link, useNavigate } from 'react-router-dom';
const Payment = () => {
    // const subsId=localStorage.getItem("PaymentsId");
       const [Payments, setPayments] = useState([]);
        const token = localStorage.getItem("token");
    useEffect(()=>{
      const GetPayments=async()=>{
                  try{
                      const response=await axios.get(`http://localhost:8000/payments`,
                          {headers:{
                              Authorization:`Bearer ${token}`,
                              "Content-Type": "application/json",
                          }},
                          
                      );
                      console.log("Paymentss response apres axios:", response.data.message);
                          setPayments(response.data.message);
                  }
                  catch (error) {
                    console.error("Error fetching Paymentss :", error);
                    toast.error("Failed to load  Paymentss. Please try again.");
                  }
              
                };
              GetPayments();

    },[token])
    
  return (
    <div className="payment-container">
       <ToastContainer />
        <SidebarRecruiter />
<div className="my-job-list-container">
            <div className="mypayments-header">
          <div className="mypayments-title"><h2>My payments</h2></div>
          <div className="mypayments-title-list"><h2>My payments list</h2></div>

          </div>
        <div className="myPayments-list">
        <div className="my-payments-fields-container">
                  <div className="my-payments-fiels">Payment Id</div>
                  <div className="my-payments-fiels">Payment date</div>
                  <div className="my-payments-fiels">Subscription</div>
                  <div className="my-payments-fiels">Price</div>
                  <div className="my-payments-fiels">Expiry date</div>
          </div>
          <div className="my-payments">
                  {Payments.map((Payment) => (
                    <div key={Payment._id} className="my-payment">
                      <div className="payment-paymentId">{Payment._id}</div>
                      <div className="payment-PaymentDate">{Payment.paymentDate.split("T")[0]}</div>
                      <div className="payment-Subscription">{Payment.subscription.name}</div>
                      <div className="payment-Price">{Payment.amount}</div>
                      <div className="payment-Expiry date">{Payment.expiryDate.split("T")[0]}</div>
                    </div>
                  ))}
                </div>
        </div>
        </div>
        
    
</div>
  )
}

export default Payment
