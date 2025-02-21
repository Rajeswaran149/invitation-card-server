const Card = require("../models/card");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

exports.updateAndSendCard = async (req, res) => {
  try {
    const { userText, userEmail } = req.body;
    
    // Ensure the uploaded file has a unique name
    const uploadedFileName = req.file.filename;  // Get the unique filename from multer
    const imagePath = path.join(__dirname, "..", "uploads", uploadedFileName); // Use the unique path

    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    // Create a new card document in the database with a unique file path
    const newCard = new Card({
      userEmail,
      userMessage: userText,
      cardPath: imagePath,
    });

    await newCard.save();

    // Set up nodemailer transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email with attachment (the uploaded card)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Your Personalized Card",
      text: "Here is your updated card!",
      attachments: [
        {
          filename: uploadedFileName,  // Use the unique filename for the attachment
          path: imagePath,             // The unique path to the uploaded file
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).send("Error sending email");
      }
      console.log("Email sent:", info);
      res.status(200).send("Card sent successfully");
    });
  } catch (error) {
    console.error("Error in updateAndSendCard controller:", error);
    res.status(500).send("Server error occurred");
  }
};
