import jwt from "jsonwebtoken";
import User from "../models/sql/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        const user = await User.findByPk(decoded.userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            res.cookie("jwt", "", { maxAge: 0 }); // Clear stale session
            return res.status(401).json({ message: "Session expired or user not found. Please log in again." });
        }

        req.user = user;

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deserializeUser = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) return next();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) return next();

        const user = await User.findByPk(decoded.userId, {
            attributes: { exclude: ['password'] }
        });

        if (user) {
            req.user = user;
        }
        next();
    } catch (error) {
        next(); // Silently fail and continue
    }
};
