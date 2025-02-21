const Card = require("../models/card");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

exports.updateAndSendCard = async (req, res) => {
  try {
    const { userText, userEmail } = req.body;
    const imagePath = path.join(__dirname, "..", "uploads", "userCard.png");

    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const newCard = new Card({
      userEmail,
      userMessage: userText,
      cardPath: imagePath,
    });

    await newCard.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Your Personalized Card",
      text: "Here is your updated card!",
      attachments: [
        {
          filename: "userCard.png",
          path: imagePath,
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
