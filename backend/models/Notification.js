const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
    userId: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
    type: String,
  });
 
  const Notification = mongoose.model('Notification', notificationSchema);
module.exports={
    Notification
}