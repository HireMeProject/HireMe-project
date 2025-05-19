import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const stripePromise = loadStripe("pk_test_51QRD5k09acFWKvV3ooNsoTBVpQd2yN39XGMimC6YyjQAf51JMQzl8OHDNYNjVcRqnK8TJt9hQk5h2rIUC25uixTA00CCjphbwn");
const token =localStorage.getItem("token");

const CheckoutForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const decodedToken = jwtDecode(token); 
    console.log("token info:",decodedToken); // Décodage du token
    const recruiterId = decodedToken.userInfo.id;
    const subscriptionId=localStorage.getItem("subscriptionId");
  const HandleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/payment/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recruiterId, subscriptionId }),
      });
      
      const session = await response.json();
      if (session.url) {
        window.location.href = session.url; // Redirection vers Stripe Checkout
      } else {
        console.error("Erreur lors de la création de la session");
      }
    } catch (error) {
      console.error("Erreur lors du paiement:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={HandleCheckout}
      disabled={loading}
      className="bg-blue-500 text-white p-2 rounded-lg"
    >
      {loading ? "Chargement..." : "S'abonner"}
    </button>
  );
};

export default CheckoutForm;
