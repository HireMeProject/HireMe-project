const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Monthly', 'Quarterly', 'Annual'], 
    default: 'Monthly'
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    comment: 'Duration in days'
  },
  status: {
    type: String,
    enum:["active","inactive"],
    default: "active"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
},{timestamps:true});
const Subscription=mongoose.model("Subscription",SubscriptionSchema);

module.exports = {Subscription};