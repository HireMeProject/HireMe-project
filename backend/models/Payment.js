const mongoose = require('mongoose');
const {Subscription}=require("./Subscription");

const PaymentSchema = new mongoose.Schema({
    subscription: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription', 
        required: true 
    },
    client:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter', 
        required: true 
    },
    amount: { 
        type: Number,
        required: true 
    },
    currency: { 
        type: String, 
        default: 'tnd' 
    },
    status: { 
        type: String, 
        enum:['Pending','Succeeded','Failed'],
        default: 'pending' 
    }, 
    stripeSessionId: { // ID de la session de paiement Stripe
        type: String,
        required: true
    },
    stripePaymentMethodId: { // ID du moyen de paiement utilisé (optionnel)
        type: String
    },
    invoiceId: { // Facture Stripe (optionnel)
        type: String
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date,
    }
}, { timestamps: true });
// **Middleware pour calculer expiryDate avant de sauvegarder**
PaymentSchema.pre('save', async function(next) {
    try {
        const subscription = await Subscription.findById(this.subscription);
        if (!subscription) {
            return next(new Error("Subscription not found")); // Ne pas utiliser res.status()
        }
        console.log("this.pay",this.subscription)

        // Calcul de expiryDate en fonction du type d'abonnement
        const now = new Date();
        if (subscription.name === 'Monthly') {
            this.expiryDate = new Date(now.setMonth(now.getMonth() + 1)); // +1 mois
        } else if (subscription.name === 'Quarterly') {
            this.expiryDate = new Date(now.setMonth(now.getMonth() + 3)); // +3 mois
        } else if (subscription.name === 'Annual') {
            this.expiryDate = new Date(now.setFullYear(now.getFullYear() + 1)); // +1 an
        }

        next();
    } catch (error) {
        next(error);
    }
});

const Payment=mongoose.model('Payment', PaymentSchema);
module.exports = {
    Payment
}