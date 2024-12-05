import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUsersForSidebar } from "../controllers/userController.js";
import bcrypt from "bcryptjs";

const router = express.Router();
import User from "../models/user.js";

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, password,email } = req.body;
  try {
    // Check if email already exists (optional)
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword});
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error code
        return res.status(400).json({ error: 'Username already exists' });
      }

      console.log(error);
      
      // Generic error response for other issues
      res.status(500).json({ error: 'User creation failed' });
    }
});
// Sign-In Route
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // If login is successful, just respond with success message
    const userData = { username: user.username, email: user.email };
    res.status(200).json({ message: 'Sign-In successful', user: userData  });
  } catch (error) {
    res.status(500).json({ error: 'Sign-In failed' });
  }
});

router.get("/", /*protectRoute,*/ getUsersForSidebar);

export default router;
