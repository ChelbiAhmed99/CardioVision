import Settings from "../models/sql/settings.model.js";

export const checkMaintenanceMode = async (req, res, next) => {
    try {
        // Exclude admin and auth routes from maintenance check
        if (req.path.startsWith('/api/admin') || req.path.startsWith('/api/auth')) {
            return next();
        }

        const settings = await Settings.findOne({ order: [['createdAt', 'DESC']] });

        if (settings?.maintenanceMode) {
            // Allow if the user is an admin
            if (req.user && req.user.role === 'admin') {
                return next();
            }

            return res.status(503).json({
                message: "Site is currently undergoing scheduled maintenance. Please check back later.",
                maintenance: true
            });
        }

        next();
    } catch (error) {
        console.error("Error in checkMaintenanceMode middleware:", error);
        next(); // Don't block the site if settings fetch fails
    }
};
