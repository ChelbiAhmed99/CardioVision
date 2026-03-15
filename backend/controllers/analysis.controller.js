import Analysis from "../models/sql/analysis.model.js";
import Notification from "../models/sql/notification.model.js";
import User from "../models/sql/user.model.js";

export const getAnalysisHistory = async (req, res) => {
    try {
        const analyses = await Analysis.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(analyses);
    } catch (error) {
        console.log("Error in getAnalysisHistory controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const saveAnalysis = async (req, res) => {
    try {
        const { metrics, diagnosis, videoPath, patientId } = req.body;
        const userId = req.user.id;

        // Fetch user to check plan and scan counts
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Handle Scan Reset if date passed
        const now = new Date();
        if (user.scanResetDate && now > new Date(user.scanResetDate)) {
            user.scanCount = 0;
            const nextReset = new Date();
            nextReset.setDate(nextReset.getDate() + 30);
            user.scanResetDate = nextReset;
            await user.save();
        }

        // Enforce Freemium Limit (10 scans per month)
        if (user.plan === 'Free' && user.scanCount >= 10) {
            return res.status(403).json({
                limitReached: true,
                message: "Monthly Freemium limit reached (10/10 scans). Upgrade to Professional for unlimited clinical analysis.",
                action: "upgrade_required"
            });
        }

        const newAnalysis = await Analysis.create({
            userId,
            patientId,
            videoPath,
            metrics,
            diagnosis,
        });

        // Increment scan count
        user.scanCount += 1;
        await user.save();

        // Automatically create a notification for high-risk findings
        if (metrics.ejectionFraction < 45 || metrics.gls > -12) {
            await Notification.create({
                userId: req.user.id,
                type: "warning",
                message: `High-Risk finding for Patient ${patientId || 'ID_N/A'}: EF ${metrics.ejectionFraction}% and GLS ${metrics.gls}% detected.`,
            });
        } else if (metrics.ejectionFraction > 50) {
            await Notification.create({
                userId: req.user.id,
                type: "success",
                message: `Analysis complete for Patient ${patientId || 'ID_N/A'}: Healthy cardiac parameters confirmed.`,
            });
        }

        res.status(201).json(newAnalysis);
    } catch (error) {
        console.log("Error in saveAnalysis controller: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
