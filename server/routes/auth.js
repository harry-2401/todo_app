const express = require('express')
const router = express.Router()
const {register, login} = require("../controllers/auth")

//@route POST api/auth/register
//@desc Register user
//@access public
router.route("/register").post(register)

//@route POST api/auth/login
//@desc Login user
//@access public
router.route("/login").post(login)

module.exports = router