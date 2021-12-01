const pool = require("../database");
const {
  SELECT_USER,
  INSERT_USER,
  SELECT_USER_BY_EMAIL,
  UPDATE_PASSWORD,
  SELECT_USER_BY_ID,
} = require("../database/query");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const Token = require("../models/Token");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../utils/sendMail");

const register = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email)
    return res.status(400).josn({
      success: false,
      message: "Missing username, password and/or email",
    });
  try {
    //check for exsiting user
    //@see SELECT_USER @in query.js
    const { rows } = await pool.query(SELECT_USER, [username]);

    if (rows[0])
      return res
        .status(400)
        .json({ success: false, message: "Username already taken!" });

    const hashPassword = await argon2.hash(password);
    console.log(hashPassword);

    const newUser = {
      username,
      password: hashPassword,
      email,
    };

    const response = await pool.query(INSERT_USER, [
      newUser.username,
      newUser.password,
      newUser.email,
    ]);

    const accessToken = jwt.sign(
      { userId: response.rows[0].id },
      process.env.SECRET_JWT,
      { expiresIn: "2h" }
    );
    res.status(200).json({
      success: true,
      message: "User created successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .josn({ success: false, message: "Missing username and/or password" });
  try {
    //check for exsiting user
    //@see SELECT_USER @in query.js
    const { rows } = await pool.query(SELECT_USER, [username]);

    if (!rows[0]) {
      return res
        .status(400)
        .json({ success: false, message: "Inccorect username or password" });
    }
    const user = rows[0];

    //username found
    const passwordValid = await argon2.verify(user.password.trim(), password);
    if (!passwordValid)
      return res
        .status(400)
        .json({ success: false, message: "Inccorect username or password" });

    const accessToken = jwt.sign({ userId: user.id }, process.env.SECRET_JWT, {
      expiresIn: "2h",
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ success: false, message: "Missing email" });

  try {
    //@see SELECT_USER_BY_EMAIL @in query.js
    const { rows } = await pool.query(SELECT_USER_BY_EMAIL, [email]);

    if (!rows[0])
      return res.status(200).json({
        success: true,
      });

    const resetToken = uuidv4();

    const hashedResetToken = await argon2.hash(resetToken);
    await Token.findOneAndDelete({ user: rows[0].id });

    await new Token({
      user: rows[0].id,
      token: hashedResetToken,
    }).save();

    const resetUrl = `http://localhost:3000/resetpassword?token=${resetToken}&userId=${rows[0].id}`;
    const message = `
      <h1>Bạn có yêu cầu thay đổi mật khẩu ^.^</h1>
      <h2>Nếu như không phải bạn yêu cầu thay đổi mật khẩu thì hãy bỏ qua gmail này. Nếu như bạn muốn thay đổi mật khẩu hãy click vào link bên dưới (sau 15 phút link sẽ không còn giá trị sử dụng)</h2>
      <a href=${resetUrl} clicktacking=off>${resetUrl}</a>
    `;

    await sendEmail({
      to: email,
      html: message,
    });

    return res.status(200).json({ success: true, data: "email sent" });
  } catch (error) {
    console.log(error);
  }
};

const resetPassword = async (req, res) => {
  const { token, userId } = req.query;
  if (!token || !userId) {
    return (
      res.status(400),
      json({ success: false, message: "Token or userId is not valid!" })
    );
  }
  try {
    //@see SELECT_USER_BY_ID @in query.js
    const { rows } = await pool.query(SELECT_USER_BY_ID, [userId]);

    //check user data (postgresql)
    if (!rows[0])
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    const user = rows[0];
    //check token
    const resToken = await Token.findOne({ user: user.id });

    if (!resToken)
      return res
        .status(400)
        .json({ success: false.valueOf, message: "Token expired" });

    const tokenValid = await argon2.verify(resToken.token, token);
    if (!tokenValid) {
      return res
        .status(200)
        .json({ success: false, message: "Token is not valid" });
    }

    //get new password form body
    const { password, confirmpassword } = req.body;
    if (password !== confirmpassword)
      return res
        .status(400)
        .json({ success: false, message: "Password not match" });
    const hashedPassword = await argon2.hash(password);
    await pool.query(UPDATE_PASSWORD, [hashedPassword, user.id]);
    await Token.deleteOne({ user: user.id });
    const accessToken = jwt.sign({ userId: user.id }, process.env.SECRET_JWT, {
      expiresIn: "2h",
    });
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};

const changePassword = async (req, res) => {
  const userId = req.userId;
  const { password, confirmpassword } = req.body;
  if (password !== confirmpassword) {
    return res
      .status(400)
      .json({ success: false, message: "Password not match!" });
  }

  try {
    const hashedPassword = await argon2.hash(password);
    console.log(hashedPassword, userId);
    const { rows: user } = await pool.query(UPDATE_PASSWORD, [
      hashedPassword,
      userId,
    ]);

    if (!user[0])
      return res
        .status(200)
        .json({ success: false, message: "user not found" });
    const accessToken = jwt.sign({ userId }, process.env.SECRET_JWT, {
      expiresIn: "2h",
    });
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
};
