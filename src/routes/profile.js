// Backend: profile.routes.js (Updated)
import express from "express";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

// Allowed fields for profile edit
const ALLOWED_EDIT_FIELDS = ["userName", "about", "photoUrl", "firstName", "lastName"];

// Validation helper
const validateEditProfileData = (req) => {
  const keys = Object.keys(req.body);
  
  // Check if all keys are allowed
  const isValid = keys.every((key) => ALLOWED_EDIT_FIELDS.includes(key));
  
  // Additional validations
  if (req.body.userName && req.body.userName.trim().length < 3) {
    return false;
  }
  
  if (req.body.about && req.body.about.length > 160) {
    return false;
  }
  
  return isValid && keys.length > 0;
};

// GET /profile/view - Get current user profile
router.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user data (excluding sensitive fields)
    res.status(200).json({
      _id: user._id,
      userName: user.userName,
      email: user.email,
      about: user.about,
      photoUrl: user.photoUrl,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("Profile view error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /profile/edit - Update user profile
router.patch("/edit", userAuth, async (req, res) => {
  try {
    // Validate request
    if (!validateEditProfileData(req)) {
      return res.status(400).json({ message: "Invalid edit request" });
    }

    const loggedInUser = req.user;

    // Update allowed fields
    Object.keys(req.body).forEach((key) => {
      if (ALLOWED_EDIT_FIELDS.includes(key)) {
        loggedInUser[key] = req.body[key];
      }
    });

    await loggedInUser.save();

    // Return updated user
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        _id: loggedInUser._id,
        userName: loggedInUser.userName,
        about: loggedInUser.about,
        photoUrl: loggedInUser.photoUrl,
      },
    });
  } catch (err) {
    console.error("Profile edit error:", err);
    res.status(400).json({ message: err.message || "Failed to update profile" });
  }
});

export default router;