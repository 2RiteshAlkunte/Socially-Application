const cloudinary = require("../config/cloudinary");
const Post = require("../models/Post");

const uploadBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "threew-social-posts",
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(buffer);
  });

const createPost = async (req, res) => {
  try {
    const text = (req.body.text || "").trim();

    if (!text && !req.file) {
      return res.status(400).json({ message: "A post must contain text or an image." });
    }

    let imageUrl = "";

    if (req.file) {
      const result = await uploadBuffer(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const post = await Post.create({
      author: {
        userId: req.user._id,
        username: req.user.username,
      },
      text,
      imageUrl,
    });

    return res.status(201).json({ post });
  } catch (error) {
    console.error("Create post error:", error);
    return res.status(500).json({ message: "Unable to create post." });
  }
};

const getPosts = async (req, res) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 5, 1), 20);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Post.countDocuments(),
    ]);

    return res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + posts.length < total,
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);
    return res.status(500).json({ message: "Unable to load posts." });
  }
};

const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const userId = req.user._id.toString();
    const index = post.likes.findIndex((like) => like.userId.toString() === userId);

    let liked;

    if (index >= 0) {
      post.likes.splice(index, 1);
      liked = false;
    } else {
      post.likes.push({
        userId: req.user._id,
        username: req.user.username,
      });
      liked = true;
    }

    await post.save();

    return res.json({
      liked,
      likes: post.likes,
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error("Like error:", error);
    return res.status(500).json({ message: "Unable to update like." });
  }
};

const addComment = async (req, res) => {
  try {
    const text = (req.body.text || "").trim();

    if (!text) {
      return res.status(400).json({ message: "Comment cannot be empty." });
    }

    if (text.length > 500) {
      return res.status(400).json({ message: "Comment cannot exceed 500 characters." });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    post.comments.push({
      userId: req.user._id,
      username: req.user.username,
      text,
    });

    await post.save();

    const comment = post.comments[post.comments.length - 1];

    return res.status(201).json({
      comment,
      commentsCount: post.comments.length,
    });
  } catch (error) {
    console.error("Comment error:", error);
    return res.status(500).json({ message: "Unable to add comment." });
  }
};

module.exports = {
  createPost,
  getPosts,
  toggleLike,
  addComment,
};
