import Video from "../models/sql/videos.model.js";

export const uploadVideoController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file uploaded!" });
    }

    // Save video file information to the database
    const newVideo = await Video.create({ video: req.file.path });

    res.status(201).json({
      message: "Video uploaded successfully!",
      video: newVideo,
    });
  } catch (error) {
    console.error("Error in uploadVideoController:", error.message);
    res.status(500).json({ error: "Internal Server Error at uploadVideoController" });
  }
};
