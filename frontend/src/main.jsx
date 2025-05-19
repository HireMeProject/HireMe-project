import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Context } from './components/Auth/Context/AuthContext.jsx'; 
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import {loadStripe} from "@stripe/stripe-js"  ;
import {Elements} from "@stripe/react-stripe-js";

//configure stripe
const stripePromise = loadStripe('pk_test_51QRD5k09acFWKvV3ooNsoTBVpQd2yN39XGMimC6YyjQAf51JMQzl8OHDNYNjVcRqnK8TJt9hQk5h2rIUC25uixTA00CCjphbwn');
  const fetchClientSecret = () => {
    return fetch('/create-checkout-session', {method: 'POST'})
      .then((response) => response.json())
      .then((json) => json.checkoutSessionClientSecret)
  };

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Context>
    <BrowserRouter>
    {/* <CheckoutProvider stripe={stripePromise} options={{fetchClientSecret}}>
      <CheckoutForm />
    </CheckoutProvider> */}
      <App />
    </BrowserRouter>
  </Context>

  </StrictMode>
)
