class IPayment{
    async createCheckoutSession(recruiterId, subscriptionId) {
        // You can add extra logic here if needed
        throw new Error("Method  must be implemented");
      }
    
      async checkPaymentStatus(paymentIntentId) {
        throw new Error("Method  must be implemented");
      }
    
      static async cancelPayment(paymentIntentId) {
        throw new Error("Method  must be implemented");
      }
    
      async verifyPayment(sessionId) {
        throw new Error("Method  must be implemented");
      }
    
      async GetMyPayments(recruiterId){
        throw new Error("Method  must be implemented");
      }
    
      
}
module.exports=IPayment;