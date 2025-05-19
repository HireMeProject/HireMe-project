const {Payment} = require('../models/Payment');
const {Subscription} = require('../models/Subscription');
const {User} = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Recruiter } = require('../models/Recruiter');
const IPayment = require('../Interface/PaymentInterface');


class PaymentManager extends IPayment{
   async createCheckoutSession(recruiterId, subscriptionId) {
    try {
        console.log("error 111 " )

        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) {
            throw { status: 404, message: 'Subscription not found' };
        }
        
        const recruiter = await Recruiter.findById(recruiterId).populate('recruiterID');
        if (!recruiter) {
            throw { status: 404, message: 'Recruiter not found' };
        }
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            customer_email: recruiter.recruiterID.email,
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: subscription.name,
                    },
                    unit_amount: subscription.price * 100,
                    recurring: {
                      interval: subscription.name === 'Annual' ? 'year' : 'month',
                      interval_count: subscription.name === 'Quarterly' ? 3 : 1
                    },
                },
                quantity: 1,
            }],
            success_url: `http://localhost:5173/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:8000/payment/cancel`,
            metadata: {
                recruiterId,
                subscriptionId
            }
        });
        console.log("url : ",session.url)
        // return {status:200,message:session.clie}
        // return {status:200, url: session.url };
        return { status: 200, sessionId: session.id };

    } catch (error) {
        console.error('Error creating checkout session:', error.message);
        throw { status: 500, message: error.message };
    }
}

// Vérifier le statut du paiement
 async checkPaymentStatus(paymentIntentId) {
  try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent.status;
  } catch (error) {
      console.error("Error checking payment status:", error.message);
      throw {status:500,message:error.message  }
  }
}
     // Annuler un paiement
    static async cancelPayment(paymentIntentId) {
      try {
          const canceledPayment = await stripe.paymentIntents.cancel(paymentIntentId);
          return canceledPayment;
      } catch (error) {
          console.error("Error canceling payment:", error.message);
          throw {status:500,message:error.message  }
        }
  }

//verify payment 
async verifyPayment(sessionId) {
    console.log("id sde session  :",typeof sessionId);

  try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
        console.log("tyoe d id dans manager : ",typeof sessionId);
      if (session.payment_status === "paid") {
          const recruiter = await Recruiter.findById(session.metadata.recruiterId);
          if (recruiter) {
              recruiter.subscription = {
                  plan: session.metadata.subscriptionId,
                  status: "active",
              };
              await recruiter.save();
          }
          const savedpaymentExist= await Payment.findOne({stripeSessionId:session.id});
          console.log("saved payment exist status :",savedpaymentExist);
          if(!savedpaymentExist){
            const payment = new Payment({
                subscription:session.metadata.subscriptionId,
                  client: recruiter._id,
                  amount: session.amount_total / 100,
                  currency: session.currency,
                  status: "Succeeded",
                  stripeSessionId: session.id,
              });
              const savedPayment = await payment.save();
              return { status: 200, message: "Paiement confirmé." };
          }
          return { status: 200, message: savedpaymentExist.status };
         
      }

      return { status: 403, message: "Paiement en attente ou échoué." };
  } catch (error) {
      console.error("Erreur de vérification de paiement :", error.message);
      return { status: 500, message: error.message };
  }
}
async GetMyPayments(recruiterId){
    try{
        const mypayments=await Payment.find({client:recruiterId}).populate("subscription","name price duration");
        if(mypayments){
            return { status: 200, message: mypayments };
        }
    }
    catch (error) {
        console.error("Erreur de vérification de paiement :", error.message);
        return { status: 500, message: error.message };
    }
}
}

module.exports = new PaymentManager();