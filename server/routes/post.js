const express = require("express")
const { createPost, getPosts, updatePost, deletePost } = require("../controllers/post")
const verifyToken = require("../middleware/auth")
const router = express.Router()

//@route POST api/posts
//@desc Create post
//@access private
router.route("/").post(verifyToken, createPost)

//@route GET api/posts
//@desc Get posts
//@access private
router.route("/").get(verifyToken, getPosts);

//@route PUT api/posts
//@desc Update posts
//@access private
router.route("/:id").put(verifyToken, updatePost)

//@route DELETE api/posts
//@desc Deslste post
//@access private
router.route("/:id").delete(verifyToken, deletePost);
module.exports = router