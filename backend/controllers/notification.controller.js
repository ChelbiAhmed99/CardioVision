import Notification from "../models/sql/notification.model.js";
import User from "../models/sql/user.model.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(notifications);
    } catch (error) {
        console.log("Error in getNotifications controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.update({ read: true }, { where: { id } });
        res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
        console.log("Error in markAsRead controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const clearNotifications = async (req, res) => {
    try {
        await Notification.destroy({ where: { userId: req.user.id } });
        res.status(200).json({ message: "Notifications cleared" });
    } catch (error) {
        console.log("Error in clearNotifications controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const markAllRead = async (req, res) => {
    try {
        await Notification.update({ read: true }, { where: { userId: req.user.id, read: false } });
        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        console.log("Error in markAllRead controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const broadcastNotification = async (req, res) => {
    try {
        const { message, type } = req.body;
        const users = await User.findAll({ attributes: ['id'] });

        const notifications = users.map(user => ({
            userId: user.id,
            type: type || 'info',
            message: message,
            read: false
        }));

        await Notification.bulkCreate(notifications);
        res.status(200).json({ message: `Broadcast sent to ${users.length} users` });
    } catch (error) {
        console.log("Error in broadcastNotification controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
