const pool = require("../database");
const { SELECT_USER, INSERT_USER } = require("../database/query");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .josn({ success: false, message: "Missing username and/or password" });
  try {
    //check for exsiting user
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
    };

    const response = await pool.query(INSERT_USER, [
      newUser.username,
      newUser.password,
    ]);

    const accessToken = jwt.sign(
      { userId: response.rows[0].id },
      process.env.SECRET_JWT,
      { expiresIn: "1d" }
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
      expiresIn: "1d",
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

module.exports = { register, login };
