// interfaces/INotification.js
class INotification {
    async createNotification(obj) {
     throw new Error("Method 'validateNotification()' must be implemented");
   }
 
   async getNotificationsByUser(obj) {
     throw new Error("Method 'validateUpdateNotification()' must be implemented");
   }
 
    async markAsRead(jobData, recruiterId) {
     throw new Error("Method 'postNotification()' must be implemented");
   }
 
}
 
 module.exports = INotification;