const PaymentManager=require("../Services/PaymentManager");
const {Payment} = require('../models/Payment');
const {Subscription} = require('../models/Subscription');
const {User} = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Recruiter } = require('../models/Recruiter');

/**
 * @desc Create Paiement
 * @route
 * @method POST
 * @access public
 */
const createPayment=async(requestAnimationFrame,res)=>{
    try{
        const { recruiterId, subscriptionId, amount } = req.body;
            if (!recruiterId || !subscriptionId || !amount) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const payment = await PaymentManager.createPaymentIntent(recruiterId, subscriptionId, amount);
            res.status(201).json(payment);
    }
    catch(error){
        if (error.status) {
            return res.status(error.status).json({ status: "error", message: error.message });
        }
        res.status(400).json({ status: "error", message: error.message });
    
    }
}
/**
 * @desc Create checkout session
 * @route
 * @method POST
 * @access public
 */
const createCheckoutSession=async(req,res)=>{
    try{
        const recruiterId=req.user.id;
        const {  subscriptionId } = req.body;
        console.log(subscriptionId)
            if ( !subscriptionId ) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const payment = await PaymentManager.createCheckoutSession(recruiterId, subscriptionId);
            return res.status(200).json(payment);
    }
    catch(error){
        if (error.status) {
            return res.status(error.status).json({ status: "error", message: error.message });
        }
        res.status(400).json({ status: "error", message: error.message });
    
    }
}
/**
 * @desc check Paiement
 * @route
 * @method POST
 * @access public
 */
const checkPayment=async(req,res)=>{
    try {
        const { paymentIntentId } = req.params;
        const status = await PaymentManager.checkPaymentStatus(paymentIntentId);
        res.status(200).json({ status });

    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ status: "error", message: error.message });
        }
        res.status(400).json({ status: "error", message: error.message });
        }
}
/**
 * @desc check Paiement
 * @route
 * @method POST
 * @access public
 */
const verifyPayment=async(req,res)=>{
    console.log("query verify cont : ",req.query.session_id)
    try {
        const  session_id  = req.query.session_id;
        console.log("session id controller : ",session_id);
        const status = await PaymentManager.verifyPayment(session_id);
        return res.status(200).json({ status });

    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ status: "error", message: error.message });
        }
        console.log(error.message)
        return res.status(500).json({ status: "error", message: error.message });
        }
}
/**
 * @desc cancel Paiement
 * @route
 * @method POST
 * @access public
 */
const cancelPayment=async(req,res)=>{
    try {
        const { paymentIntentId } = req.params;
        const canceledPayment = await PaymentManager.cancelPayment(paymentIntentId);
            res.status(200).json(canceledPayment);

    } catch (error) {
        if (error.status) {
            return res.status(error.status).json({ status: "error", message: error.message });
        }
        res.status(400).json({ status: "error", message: error.message });
        }
}
/**
 * 
 */
const HandleWebhookEvent=async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook error:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { recruiterId, subscriptionId } = session.metadata;

        try {
            await Payment.create({
                subscription: subscriptionId,
                client: recruiterId,
                amount: session.amount_total / 100,
                currency: session.currency,
                status: 'Succeeded',
                stripePaymentIntentId: session.payment_intent,
                stripePaymentMethodId: session.payment_method,
                client_secret: session.client_secret,
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Exemple: expiration après 30 jours
            });
        } catch (err) {
            console.error('Database error:', err.message);
            return res.status(500).send('Failed to update payment in database');
        }
    }

    res.json({ received: true });
}
/**
 * 
 */
const GetMyPayments=async(req,res)=>{
    try{
        const recruiterId=req.user.id;
        const mypayments=await PaymentManager.GetMyPayments(recruiterId)
        return res.status(200).json({ status:"Success",message:mypayments.message });
    }
    catch(error){
        if (error.status) {
            return res.status(error.status).json({ status: "error", message: error.message });
        }
        res.status(400).json({ status: "error", message: error.message });
        
    }
}
module.exports={
    createPayment,
    checkPayment,
    cancelPayment,
    createCheckoutSession,
    HandleWebhookEvent,
    verifyPayment,
    GetMyPayments,
}
