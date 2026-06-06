import Post from "../model/post.js";

// Create Post
export const createPost = async (req, res) => {
  try {
    const { user, text, image } = req.body;

    if (!text && !image) {
      return res.status(400).json({
        success: false,
        message: "Text or image is required",
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const post = await Post.create({
      user,
      text,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("CREATE POST ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("GET POSTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Like / Unlike Post
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (like) => like.toString() !== userId
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: alreadyLiked
        ? "Post unliked"
        : "Post liked",
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error("LIKE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add Comment
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Comment is required",
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    post.comments.push({
      user: userId,
      text,
    });

    await post.save();

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      commentsCount: post.comments.length,
    });
  } catch (error) {
    console.error("COMMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("DELETE POST ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};