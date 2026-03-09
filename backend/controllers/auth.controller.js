import { generateToken } from "../utils/generateToken.js";
import User from "../models/sql/user.model.js";
import Settings from "../models/sql/settings.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        const settings = await Settings.findOne({ order: [['createdAt', 'DESC']] });
        if (settings && settings.allowSignups === false) {
            return res.status(403).json({ message: "Signups are currently disabled by the administrator." });
        }

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findOne({ where: { email } });

        if (user) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            // generate jwt token here
            generateToken(newUser.id, res);

            res.status(201).json({
                _id: newUser.id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                role: newUser.role,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user.id, res);

        res.status(200).json({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            role: user.role,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullName, specialty, bio, profilePic } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.fullName = fullName || user.fullName;
        user.specialty = specialty || user.specialty;
        user.bio = bio || user.bio;
        user.profilePic = profilePic || user.profilePic;

        await user.save();

        res.status(200).json({
            _id: user.id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            specialty: user.specialty,
            bio: user.bio,
            role: user.role,
        });
    } catch (error) {
        console.log("Error in updateProfile controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
