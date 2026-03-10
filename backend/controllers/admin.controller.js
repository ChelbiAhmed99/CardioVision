import User from "../models/sql/user.model.js";
import Waitlist from "../models/waitlist.model.js";
import Settings from "../models/sql/settings.model.js";
import AuditLog from "../models/sql/audit.model.js";
import Feedback from "../models/sql/feedback.model.js";
import { Op, fn, col } from "sequelize";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createUser = async (req, res) => {
    try {
        const { fullName, email, password, specialty, role } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Full name, email and password are required" });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            specialty: specialty || "Cardiologist",
            role: role || 'user'
        });

        // Audit Log
        await AuditLog.create({
            adminId: req.user.id,
            adminName: req.user.fullName,
            action: 'CREATE_USER',
            targetType: 'USER',
            targetId: newUser.id,
            details: `Created new user account: ${fullName} (${email})`,
            ipAddress: req.ip
        });

        const userResponse = newUser.toJSON();
        delete userResponse.password;

        res.status(201).json({ message: "User created successfully", user: userResponse });
    } catch (error) {
        console.error("Error in createUser:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, specialty, role } = req.body;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.update({
            fullName: fullName || user.fullName,
            email: email || user.email,
            specialty: specialty || user.specialty,
            role: role || user.role
        });

        // Audit Log
        await AuditLog.create({
            adminId: req.user.id,
            adminName: req.user.fullName,
            action: 'UPDATE_USER',
            targetType: 'USER',
            targetId: user.id,
            details: `Updated profile for user: ${user.fullName}`,
            ipAddress: req.ip
        });

        const userResponse = user.toJSON();
        delete userResponse.password;

        res.status(200).json({ message: "User updated successfully", user: userResponse });
    } catch (error) {
        console.error("Error in updateUser:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.role = role;
        await user.save();

        // Audit Log
        await AuditLog.create({
            adminId: req.user.id,
            adminName: req.user.fullName,
            action: 'UPDATE_ROLE',
            targetType: 'USER',
            targetId: user.id,
            details: `Updated role for ${user.fullName} to ${role}`,
            ipAddress: req.ip
        });

        res.status(200).json({ message: "User role updated successfully", user });
    } catch (error) {
        console.error("Error in updateUserRole:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const userName = user.fullName;
        await user.destroy();

        // Audit Log
        await AuditLog.create({
            adminId: req.user.id,
            adminName: req.user.fullName,
            action: 'DELETE_USER',
            targetType: 'USER',
            targetId: id,
            details: `Deleted user: ${userName}`,
            ipAddress: req.ip
        });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error in deleteUser:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAdminStats = async (req, res) => {
    try {
        const userCount = await User.count();
        const waitlistCount = await Waitlist.count();

        // Calculate monthly acquisition data for the last 12 months
        const months = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                name: d.toLocaleString('default', { month: 'short' }),
                year: d.getFullYear(),
                month: d.getMonth(),
                count: 0
            });
        }

        const usersByMonth = await User.findAll({
            attributes: [
                [fn('strftime', '%m', col('createdAt')), 'month'],
                [fn('strftime', '%Y', col('createdAt')), 'year'],
                [fn('count', col('id')), 'count']
            ],
            where: {
                createdAt: {
                    [Op.gte]: new Date(now.getFullYear() - 1, now.getMonth(), 1)
                }
            },
            group: ['month', 'year']
        });

        // Map real data to month structure
        const acquisitionData = months.map(m => {
            const match = usersByMonth.find(u =>
                parseInt(u.getDataValue('month')) === (m.month + 1) &&
                parseInt(u.getDataValue('year')) === m.year
            );
            return match ? parseInt(match.getDataValue('count')) : 0;
        });

        // Get recent activity from audit logs
        const recentActivity = await AuditLog.findAll({
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: [] // If you had relations, you'd include them here
        });

        res.status(200).json({
            totalUsers: userCount,
            totalWaitlist: waitlistCount,
            activeSessions: userCount > 0 ? Math.max(1, Math.floor(userCount * 0.15)) : 0, // 15% heuristic
            systemHealth: "Optimal",
            acquisitionData,
            recentActivity: recentActivity.map(log => ({
                action: log.action.replace(/_/g, ' '),
                details: log.details,
                timestamp: log.createdAt
            }))
        });
    } catch (error) {
        console.error("Error in getAdminStats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        res.status(200).json(settings);
    } catch (error) {
        console.error("Error in getSettings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getPublicSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne({
            attributes: [
                'siteName', 'maintenanceMode', 'heroTitle', 'heroHighlight',
                'heroSubtitle', 'announcementText', 'contactEmail', 'footerText'
            ]
        });
        if (!settings) {
            settings = {
                siteName: 'CardioVision',
                maintenanceMode: false,
                heroTitle: "GLS Analysis",
                heroHighlight: "In Seconds.",
                heroSubtitle: "The first clinical-grade AI platform for automated myocardial segmentation and quantitative biomechanical assessment.",
                announcementText: "Next-Gen Echocardiography AI",
                contactEmail: "contact@cardiovision.com",
                footerText: "© 2026 CardioVision AI. All rights reserved."
            };
        }
        res.status(200).json(settings);
    } catch (error) {
        console.error("Error in getPublicSettings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const {
            siteName, maintenanceMode, allowSignups, maxUploadSize, apiRateLimit,
            heroTitle, heroHighlight, heroSubtitle, announcementText, contactEmail, footerText
        } = req.body;

        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({});

        await settings.update({
            siteName,
            maintenanceMode,
            allowSignups,
            maxUploadSize,
            apiRateLimit,
            heroTitle,
            heroHighlight,
            heroSubtitle,
            announcementText,
            contactEmail,
            footerText,
            updatedBy: req.user.id
        });

        // Audit Log
        await AuditLog.create({
            adminId: req.user.id,
            adminName: req.user.fullName,
            action: 'UPDATE_SETTINGS',
            targetType: 'SETTINGS',
            details: `Updated system configurations`,
            ipAddress: req.ip
        });

        res.status(200).json({ message: "Settings updated successfully", settings });
    } catch (error) {
        console.error("Error in updateSettings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.findAll({
            order: [['createdAt', 'DESC']],
            limit: 100
        });
        res.status(200).json(logs);
    } catch (error) {
        console.error("Error in getAuditLogs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getFeedbackStats = async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll({
            order: [['createdAt', 'DESC']]
        });

        // Simple aggregation
        const profileStats = {};
        const usefulnessStats = {};
        const experienceStats = {};

        feedbacks.forEach(f => {
            if (f.profile) profileStats[f.profile] = (profileStats[f.profile] || 0) + 1;
            if (f.usefulness) usefulnessStats[f.usefulness] = (usefulnessStats[f.usefulness] || 0) + 1;
            if (f.experienceLevel) experienceStats[f.experienceLevel] = (experienceStats[f.experienceLevel] || 0) + 1;
        });

        res.status(200).json({
            count: feedbacks.length,
            profiles: profileStats,
            usefulness: usefulnessStats,
            experience: experienceStats,
            entries: feedbacks
        });
    } catch (error) {
        console.error("Error in getFeedbackStats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
