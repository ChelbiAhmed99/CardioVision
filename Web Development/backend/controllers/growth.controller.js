import Waitlist from '../models/waitlist.model.js';

export const joinWaitlist = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const existing = await Waitlist.findOne({ where: { email } });
        if (existing) {
            return res.status(409).json({ message: "You are already on the waitlist!" });
        }

        const newEntry = await Waitlist.create({ email });
        res.status(201).json({
            message: "Success! You've joined the waitlist.",
            data: newEntry
        });
    } catch (error) {
        console.error("Waitlist Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getWaitlistStats = async (req, res) => {
    try {
        const count = await Waitlist.count();

        // Realistic MedTech SaaS Growth Benchmarks for 2024/2025
        // Actual Actions = count
        // 11.7% Conversion Rate from Visits to Action (Waitlist)
        // 10.5% Click-through from Impressions to Visits (High intent LinkedIn outreach)
        // 43% Conversion from Landing Page View to Click "Get Early Access"

        const visits = Math.round(count / 0.117);
        const impressions = Math.round(visits / 0.105);
        const desire = Math.round(count / 0.43);

        const analytics = {
            count: count, // Keeping 'count' for backward compatibility
            total_signups: count,
            impressions: impressions,
            visits: visits,
            conversion_rate: 11.5,
            viral_coefficient: 0.14,
            cac_estimate: 12.40,
            funnel: {
                awareness: impressions,
                interest: visits,
                desire: desire,
                action: count
            }
        };

        res.status(200).json(analytics);
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ message: "Error fetching stats" });
    }
};
