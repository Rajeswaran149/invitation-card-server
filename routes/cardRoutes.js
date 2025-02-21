const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const cardController = require("../controllers/cardController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, "userCard.png");
  },
});

const upload = multer({ storage });

router.post(
  "/update-and-send-card",
  upload.single("image"),
  cardController.updateAndSendCard
);

module.exports = router;
