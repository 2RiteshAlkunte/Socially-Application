const express = require("express");
const protect = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  createPost,
  getPosts,
  toggleLike,
  addComment,
} = require("../controllers/postController");

const router = express.Router();

router.get("/", getPosts);
router.post("/", protect, upload.single("image"), createPost);
router.post("/:id/like", protect, toggleLike);
router.post("/:id/comments", protect, addComment);

module.exports = router;
