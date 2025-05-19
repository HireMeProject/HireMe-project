const INotification = require('../Interface/NotificationInterface');
const {Notification} = require('../models/Notification');

class NotificationManager  extends INotification{

    async createNotification ( userId, type, message ) {
        const notification = new Notification({ userId, message, type });
        return await notification.save();
    };

    async getNotificationsByUser  (userId) {
  return await Notification.find({ userId }).sort({ createdAt: -1 });
};

    async markAsRead (userId)  {
      const result = await Notification.updateMany(
        { userId, isRead: false },
        { $set: { isRead: true } }
    );

    

    return result;
};
}
module.exports = new NotificationManager();
