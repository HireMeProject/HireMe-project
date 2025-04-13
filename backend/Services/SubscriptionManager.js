const {Subscription} = require('../models/Subscription');

class SubscriptionManager {
   async createSubscription(subscriptionData) {
    const subscription = new Subscription(subscriptionData);
    return await subscription.save();
  }

   async getAllActiveSubscriptions() {
    return await Subscription.find({ status: "active" });
  }

   async updateSubscription(id, updateData) {
    return await Subscription.findByIdAndUpdate(id, updateData, { new: true });
  }
}

module.exports = new SubscriptionManager();