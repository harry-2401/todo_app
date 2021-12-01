const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/auth");
const verifyToken = require("../middleware/auth");

//@route POST api/auth/register
//@desc Register user
//@access public
router.route("/register").post(register);

//@route POST api/auth/login
//@desc Login user
//@access public
router.route("/login").post(login);

//@route POST api/auth/forgotpassword
//@desc send email
//@access public
router.route("/forgotpassword").post(forgotPassword);

//@route POST api/auth/resetpassword
//@desc send email
//@access public
router.route("/resetpassword").put(resetPassword);

//@route POST api/auth/changepassword
//@desc change password
//@access private
router.route("/changepassword").put(verifyToken ,changePassword);
module.exports = router;
