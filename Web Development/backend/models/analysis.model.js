import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        patientId: {
            type: String,
            default: "Anonymous"
        },
        videoPath: {
            type: String,
            required: true,
        },
        metrics: {
            ejectionFraction: Number,
            simpsonEF: Number,
            gls: Number,
            edVolume: Number,
            esVolume: Number,
        },
        diagnosis: {
            problem: String,
            cause: String,
            cure: String,
            prognosticInsight: String,
        },
    },
    { timestamps: true }
);

const Analysis = mongoose.model("Analysis", analysisSchema);

export default Analysis;
