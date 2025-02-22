const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const cardController = require("../controllers/cardController");
const { v4: uuidv4 } = require("uuid");  

// Configure multer storage to generate unique filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = uuidv4(); 
    cb(null, `userCard_${uniqueSuffix}.png`);  
  },
});

const upload = multer({ storage });

router.post(
  "/update-and-send-card",
  upload.single("image"),
  cardController.updateAndSendCard
);

module.exports = router;
