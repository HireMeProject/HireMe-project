// interfaces/ISubscriptionRepository.js
class ISubscription {
    async createSubscription(subscriptionData) {
      throw new Error('create() method not implemented');
    }
  
    async getAllActiveSubscriptions() {
      throw new Error('findAllActive() method not implemented');
    }
  
    async updateSubscription(id, updateData) {
      throw new Error('findByIdAndUpdate() method not implemented');
    }
  }
  
  module.exports = ISubscription;