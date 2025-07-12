const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt=require('jsonwebtoken');
const jwt_sec="5592495355924953";

// Middleware to parse JSON body 
app.use(express.json());



const mongoUrl = "mongo_url";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.log(e);
  });

require("./UserDetail");
const User = mongoose.model("UserInfo");

app.get("/", (req, res) => {
  res.send({ status: "Started" });
});

app.post("/register", async (req, res) => {
  console.log("hello");
  
  const {
    name,
    email,
    mobile,
    password,
    healthConditions,
    allergies,
    age,
    weight,
    height,
    gender,
    activityLevel,
    goal,
  } = req.body;
  
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.send({ status: "error", data: "User already exists" });
    }

    await User.create({
      name,
      email,
      mobile,
      password,
      healthConditions,
      allergies,
      age,
      weight,
      height,
      gender,
      activityLevel,
      goal,
    });

    res.send({ status: "ok", data: "User created" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.send({ status: "error", data: error.message || error });
  }
});


app.post("/login-user", async (req, res) => {
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: "Email and password required" });
    }

    const oldUser = await User.findOne({ email: email });

    if (!oldUser) {
      return res.status(404).send({ data: "User doesn't exist!" });
    }

    if (password === oldUser.password) {
      const token = jwt.sign({ email: oldUser.email }, jwt_sec);
      return res.send({
        status: "ok",
        user: {
          name: oldUser.name,
          email: oldUser.email,
          mobile: oldUser.mobile,
          healthConditions: oldUser.healthConditions,
          allergies: oldUser.allergies, // Include allergies in response
        },
        token: token,
      });
    } else {
      return res.status(401).send({ status: "error", data: "Invalid password" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send({ status: "error", message: "Server error" });
  }
});




require("./FoodHistory");
const FoodHistory = mongoose.model("FoodHistory");

app.post("/save-food-history", async (req, res) => {
  const { email, foodName, nutrition, quantity } = req.body;

  try {
    const updateResult = await User.updateOne(
      { email: email },
      {
        $push: {
          foodHistory: {
            foodName,
            nutrients: nutrition,
            quantity,
            timestamp: new Date(),
          },
        },
      }
    );

    res.send({ status: "ok", data: updateResult });
  } catch (err) {
    console.error("Failed to update user's food history:", err);
    res.status(500).send({ status: "error", message: "Could not update history" });
  }
});




app.put("/update-user/:email", async (req, res) => {
  const { email } = req.params; // Original email
  const updatedData = req.body;

  try {
    // Check if email is being changed
    if (updatedData.email && updatedData.email !== email) {
      // Check if new email already exists
      const existingUser = await User.findOne({ email: updatedData.email });
      if (existingUser) {
        return res.status(400).send({ 
          status: "error", 
          message: "Email already exists" 
        });
      }
    }

    const user = await User.findOneAndUpdate(
      { email: email }, // Find by original email
      { $set: updatedData },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ status: "error", message: "User not found" });
    }

    res.send({ status: "ok", data: user });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send({ status: "error", message: "Could not update user" });
  }
});


app.get("/user-history/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).send({ status: "error", message: "User not found" });

    res.send({ status: "ok", data: user.foodHistory || [] });
  } catch (err) {
    console.error("Error fetching user history:", err);
    res.status(500).send({ status: "error", message: "Could not fetch history" });
  }
});


const nodemailer = require('nodemailer');

// Transporter setup (use a real SMTP in production)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'karimmerchaoui27@gmail.com',
    pass: 'lalou2003',
  },
});

const crypto = require('crypto');

// Generates a 4-digit numeric code
function generateResetCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

app.post("/request-password-reset", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return res.status(404).send({ status: "error", message: "User not found" });

  const code = generateResetCode(); // 4-digit code
  const expiry = Date.now() + 60 * 1000; // 1 minute from now

  user.resetCode = code;
  user.resetCodeExpiry = expiry;
  await user.save();
    
  // Send email with just the code
  
  await transporter.sendMail({
    from: 'karimmerchaoui27@gmail.com',
    to: email,
    subject: "Your Password Reset Code",
    text: `Your password reset code is: ${code}. It will expire in 1 minute.`,
  });

  res.send({ status: "ok", message: "Reset code sent to email" });
});





app.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(404).send({ status: "error", message: "User not found" });

  if (user.resetCode !== code)
    return res.status(400).send({ status: "error", message: "Invalid code" });

  if (Date.now() > user.resetCodeExpiry)
    return res.status(400).send({ status: "error", message: "Code expired" });

  user.password = newPassword;
  user.resetCode = undefined;
  user.resetCodeExpiry = undefined;
  await user.save();

  res.send({ status: "ok", message: "Password updated successfully" });
});

  

app.listen(5001, () => {
  console.log("Node js server started.");
});
