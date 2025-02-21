const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const cardController = require("../controllers/cardController");
const { v4: uuidv4 } = require("uuid");  // Import UUID for unique filenames

// Configure multer storage to generate unique filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4();  // Generate a unique suffix
    cb(null, `userCard_${uniqueSuffix}.png`);  // Use the unique filename
  },
});

const upload = multer({ storage });

router.post(
  "/update-and-send-card",
  upload.single("image"),
  cardController.updateAndSendCard
);

module.exports = router;
