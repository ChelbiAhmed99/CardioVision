import Analysis from "../models/sql/analysis.model.js";
import Notification from "../models/sql/notification.model.js";

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

        const newAnalysis = await Analysis.create({
            userId: req.user.id,
            patientId,
            videoPath,
            metrics,
            diagnosis,
        });

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
