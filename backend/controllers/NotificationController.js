const NotificationManager=require("../Services/NotificationManager")

    const createNotif=async(req,res)=>{
        try{
            const {type, message}=req.body;
            const userId=req.user.id;
            const notification = await NotificationManager.createNotification(userId, type, message);
            io.to(userId).emit('notification', notification);
            return res.status(200).json(notification);
        }
        catch(error){
            return res.status(500).json({ error: error.message });
        }
    }
    // Récupérer toutes les catégories
    const  getNotificationsByUser=async(req, res)=> {
        try {
            const userId = req.user.id;
            const notifs = await NotificationManager.getNotificationsByUser(userId);
            return res.status(200).json(notifs);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Récupérer une catégorie par ID
    const  markAsRead=async(req, res)=> {
        try {
            const userId = req.user.id;
            console.log("userId: ",userId)
            const updatedNotifs = await NotificationManager.markAsRead(userId);
            return res.status(200).json(updatedNotifs);
        } catch (error) {
            return res.status(404).json({ error: error.message });
        }
    }

module.exports = {
    getNotificationsByUser,
    markAsRead,
    createNotif,
};
