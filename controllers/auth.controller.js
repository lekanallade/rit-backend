const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../config/mailer');
const User = require('../models/user.model');

// Generate OTP helper
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ------------------ SIGNUP ------------------
exports.signup = async (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.files:", req.files);

  try {
    const {
      firstname,
      middlename,
      givenname,
      dateOfBirth,
      sex,
      cityOfBirth,
      profession,
      maritalStatus,
      detailedAddress,
      phoneNumber,
      email,
      userType,
      password
    } = req.body;

    // 1. Check if user exists
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const profilePicture = req.files['profilePicture'] ? req.files['profilePicture'][0].path : null;
    const idDocument = req.files['idDocument'] ? req.files['idDocument'][0].path : null;

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Generate Email OTP - FIXED FIELD NAMES
    const emailOtpCode = generateOTP();
    const emailOtpCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    console.log("Generated", emailOtpCode);
    console.log("Date", emailOtpCodeExpires);

    const phoneOtp = generateOTP();
    const phoneOtpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    // login

   

    // 4. Create user - FIXED FIELD NAMES
    const user = await User.create({
      firstname,
      middlename,
      givenname,
      dateOfBirth,
      sex,
      cityOfBirth,
      profession,
      maritalStatus,
      detailedAddress,
      phoneNumber,
      email,
      userType,
      password: hashedPassword,
      profilePicture,
      idDocument,
      emailOtp: emailOtpCode,
      emailOtpExpires: emailOtpCodeExpires, // FIXED: Changed from emailOtpVerified
      isEmailVerified: false,
      phoneOtp: phoneOtp,
      phoneOtpExpires: phoneOtpExpires, // FIXED: Changed from phoneOtpVerified
      isPhoneVerified: false,
    });
      console.log("User created with OTP fields:", {
      emailOtp: user.emailOtp,
      emailOtpExpires: user.emailOtpExpires,
      id: user.id
    });
    // 5. Send OTP email
    await transporter.sendMail({
      from: '"RIT App" <no-reply@rit.com>',
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${emailOtpCode}`
    });

    res.status(201).json({ message: "Signup successful. OTP sent.", userId: user.id });

  } catch (err) {
    console.error(err);
    if (err.errors) {
      // Send validation errors
      return res.status(400).json({ error: err.errors.map(e => e.message) });
    }
    res.status(500).json({ error: "Server error" });
  }
};

// ------------------ VERIFY OTP Mail ------------------
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });
    console.log("from class", user.email);
    console.log(otp)

    if (!user) return res.status(404).json({ message: "User not found" });

    // FIXED: Check the correct field name emailOtpExpires instead of emailOtpVerified
    if (String(user.emailOtp) !== String(otp) || new Date() > user.emailOtpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isEmailVerified = true;
    user.emailOtp = null;
    user.emailOtpExpires = null; // FIXED: Changed from emailOtpVerified
    await user.save();

    res.json({ message: "Email Account verified. Welcome!" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ------------------ VERIFY OTP Phonenumber ------------------
exports.verifyPhone = async (req, res) => {
  const { phone, otp } = req.body;
  const user = await User.findOne({ where: { phoneNumber: phone } });

  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.phoneOtp !== otp) return res.status(400).json({ message: "Invalid OTP" });
  if (user.phoneOtpExpires < new Date()) return res.status(400).json({ message: "OTP expired" });

  user.isPhoneVerified = true;
  user.phoneOtp = null;
  user.phoneOtpExpires = null;
  await user.save();

  res.json({ message: "Phone verified successfully" });
};

// ------------------ SIGNIN ------------------
// exports.signin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ where: { email } });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (!user.isEmailVerified) return res.status(403).json({ message: "Account not verified" });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(401).json({ message: "Invalid password" });

//     const token = jwt.sign({ id: user.id, email: user.email }, "SECRET_KEY", { expiresIn: "1h" });

//     res.json({ message: "Signin successful", token });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// };
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Invalid password" });

    // Generate JWT
    const token = jwt.sign({ id: user.id }, "SECRET_KEY", { expiresIn: "1h" });

    res.json({ message: "Signin successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ------------------ FORGOT PASSWORD ------------------
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = jwt.sign({ id: user.id }, "RESET_SECRET", { expiresIn: "15m" });

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: '"RIT App" <olalekan.allade@gmail.com>',
      to: email,
      subject: "Reset Password",
      text: `Click here to reset your password: ${resetLink}`
    });

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ------------------ RESET PASSWORD ------------------
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, "RESET_SECRET");
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};
