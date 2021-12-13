const pool = require("../database");
const {
  CREATE_POST,
  SELECT_ALL_POST,
  UPDATE_POST_BY_ID,
  DELETE_POST,
} = require("../database/query");

const createPost = async (req, res) => {
  const { title, description, url, status } = req.body;

  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });
  try {
    let newPost = {
      title,
      description,
      url:
        (url && url.startsWith("https://")) || url.startsWith("http://")
          ? url
          : `https://${url}`,
      status: status || "TO LEARN",
      user: req.userId,
    };
    //@see CREATE_POST @in query.js
    const { rows } = await pool.query(CREATE_POST, [
      newPost.title,
      newPost.description,
      newPost.url,
      newPost.status,
      newPost.user,
    ]);
    newPost = rows[0];

    return res
      .status(200)
      .json({ success: true, message: "Happy learning!", post: newPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};

const getPosts = async (req, res) => {
  try {
    const userId = req.userId;

    //rows <=> response data from database
    //@see SELECT_ALL_POST @in query.js
    const { rows: posts } = await pool.query(SELECT_ALL_POST, [userId]);
    const { rows: username } = await pool.query(
      `SELECT DISTINCT username FROM "users" WHERE id=$1`,
      [userId]
    );
    return res.status(200).json({
      success: true,
      posts: posts.map((post) => {
        return {
          ...post,
          user: {
            id: post.user,
            username: username[0],
          },
        };
      }),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};

const updatePost = async (req, res) => {
  const { title, description, url, status } = req.body;
  let { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: "Post not found" });
  }

  if (!title)
    return res
      .status(400)
      .json({ success: false, message: "Title is required" });
  try {
    id = parseInt(id);
    let updatePost = {
      title,
      description,
      url:
        (url && url.startsWith("https://")) || url.startsWith("http://")
          ? url
          : `https://${url}`,
      status,
    };
    //@see UPDATE_POST_BY_ID @in query.js
    const { rows: post } = await pool.query(UPDATE_POST_BY_ID, [
      updatePost.title,
      updatePost.description,
      updatePost.url,
      updatePost.status,
      id,
    ]);
    if (!post[0])
      return res.status(401).json({
        success: false,
        message: "User unauthorised to update post of post not found",
      });

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: post[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};

const deletePost = async (req, res) => {
  const postDeleteCondition = { id: req.params.id, user: req.userId };
  if (!postDeleteCondition.id) {
    return res.status(400).json({ success: false, message: "Post not found" });
  }
  try {
    //@see DELETE_POST @in query.js
    const { rows: post } = await pool.query(DELETE_POST, [
      postDeleteCondition.id,
      postDeleteCondition.user,
    ]);

    if (!post[0]) {
      return res.status(401).json({
        success: false,
        message: "User unauthorised to update post of post not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      post: post[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};

module.exports = {
  createPost,
  getPosts,
  updatePost,
  deletePost,
};
