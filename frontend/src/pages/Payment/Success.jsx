import React, { useEffect, useState } from "react";
import {  useNavigate,useSearchParams } from "react-router-dom";
import axios from "axios"; // Importer axios
import "./Success.css";
const SuccessPage = () => {
    const navigate=useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [status, setStatus] = useState("Vérification du paiement...");

    useEffect(() => {
        console.log("sseessionId typeofff :",typeof sessionId)
        if (!sessionId) {
            console.log("erreur message : no sessionid")
            return sessionId;
        };

        // Utiliser axios au lieu de fetch
        axios
            .get(`http://localhost:8000/payment/success`, {
                params: { session_id: sessionId }, // Passer session_id comme paramètre
            })
            .then((response) => {
                console.log(response.data)
                setStatus(response.data.status.message); // Utiliser les données de réponse de axios
            })
            .catch(() => {
                setStatus("Erreur lors de la vérification du paiement");
            });
    }, [sessionId]);

    return (
        <div className="success-container">
      <h2 className="status-message">Payment {status}</h2>
      <button className="return-button" onClick={() => navigate("/Payments")}>
        Check your payment list
      </button>
    </div>
    );
};

export default SuccessPage;
// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import axios from "axios"; // Importer axios

// const SuccessPage = () => {
//     const [searchParams] = useSearchParams();
//     const sessionId = localStorage.getItem("sessionId");
//     const [status, setStatus] = useState("Vérification du paiement...");

//     useEffect(() => {
//         const HandleSuccess=async()=>{
//             try{
//                 console.log("sseessionId:",sessionId)
//                 if (!sessionId) {
//                     console.log("erreur message : no sessionid")
//                     return sessionId;
//                 };
//                 console.log("session id dans success : ",sessionId);
//                 const response=await axios.post(`http://localhost:8000/payment/success?session_id=${sessionId}`);
//                 if(response.status===200){
//                     setStatus(response.data.message);
//                 }
//                 else{
//                     setStatus("Erreur lors de la vérification du paiement");
//                 }
//             }
//             catch(error){
//                 console.log("eeroor server",error.message);
//             }
//         }
        
//     }, [sessionId]);

//     return (
//         <div className="p-6">
//             <h2 className="text-xl font-bold">{status}</h2>
//         </div>
//     );
// };

// export default SuccessPage;
