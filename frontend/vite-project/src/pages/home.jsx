import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});

  const { register, handleSubmit, reset } = useForm();

  // Create Post
  const onSubmit = async (data) => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast.error("Please login first");
        return;
      }

      if (!data.text && !data.image) {
        toast.error("Please enter text or image");
        return;
      }

      const response = await axios.post(
        "https://own-web-main.onrender.com/api/posts",
        {
          user: userId,
          text: data.text,
          image: data.image,
        }
      );

      if (response.data.success) {
        toast.success("Post Created Successfully");
        reset();
        getPosts();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create post"
      );
    }
  };

  // Get Posts
  const getPosts = async () => {
    try {
      const response = await axios.get(
        "https://own-web-main.onrender.com/api/posts"
      );

      setPosts(response.data.posts || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load posts");
    }
  };

  // Like Post
  const handleLike = async (postId) => {
    try {
      const userId = localStorage.getItem("userId");

      await axios.post(
        `https://own-web-main.onrender.com/api/posts/${postId}/like`,
        {
          userId,
        }
      );

      getPosts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to like post");
    }
  };

  // Add Comment
  const handleComment = async (postId) => {
    try {
      const userId = localStorage.getItem("userId");
      const text = commentText[postId];

      if (!text) {
        toast.error("Enter a comment");
        return;
      }

      await axios.post(
        `https://own-web-main.onrender.com/api/posts/${postId}/comment`,
        {
          userId,
          text,
        }
      );

      toast.success("Comment Added");

      setCommentText((prev) => ({
        ...prev,
        [postId]: "",
      }));

      getPosts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add comment");
    }
  };

  // Delete Post
  const handleDelete = async (postId) => {
    try {
      const userId = localStorage.getItem("userId");

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this post?"
      );

      if (!confirmDelete) return;

      const response = await axios.delete(
        `https://own-web-main.onrender.com/api/posts/${postId}`,
        {
          data: {
            userId,
          },
        }
      );

      if (response.data.success) {
        toast.success("Post Deleted Successfully");
        getPosts();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete post"
      );
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="container">
      <ToastContainer />

      <h1>Create Post</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          placeholder="What's on your mind?"
          {...register("text")}
        />

        <input
          type="text"
          placeholder="Image URL"
          {...register("image")}
        />

        <button type="submit">
          Create Post
        </button>
      </form>

      <hr />

      <h2>Public Feed</h2>

      {posts.length === 0 ? (
        <p>No Posts Found</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="post-card"
          >
            <div className="post-header">
              <div className="avatar">
                {post.user?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </div>

              <div className="username">
                {post.user?.name ||
                  "Unknown User"}
              </div>
            </div>

            <div className="post-content">
              {post.text && (
                <p>{post.text}</p>
              )}
            </div>

            {post.image && (
              <img
                src={post.image}
                alt="post"
                className="post-image"
              />
            )}

            <div className="post-actions">
              <button
                className="like-btn"
                onClick={() =>
                  handleLike(post._id)
                }
              >
                👍 Like (
                {post.likes?.length || 0})
              </button>

              <span className="comment-count">
                💬 Comments (
                {post.comments?.length ||
                  0}
                )
              </span>

              {localStorage.getItem(
                "userId"
              ) === post.user?._id && (
                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(post._id)
                  }
                >
                  🗑 Delete
                </button>
              )}
            </div>

            <div className="comment-box">
              <div className="comment-input-area">
                <input
                  type="text"
                  placeholder="Write comment..."
                  className="comment-input"
                  value={
                    commentText[
                      post._id
                    ] || ""
                  }
                  onChange={(e) =>
                    setCommentText(
                      (prev) => ({
                        ...prev,
                        [post._id]:
                          e.target.value,
                      })
                    )
                  }
                />

                <button
                  className="comment-btn"
                  onClick={() =>
                    handleComment(
                      post._id
                    )
                  }
                >
                  Add Comment
                </button>
              </div>

              <div className="comments-list">
                <h4>Comments</h4>

                {post.comments?.length >
                0 ? (
                  post.comments.map(
                    (
                      comment,
                      index
                    ) => (
                      <div
                        key={index}
                        className="comment"
                      >
                        <strong>
                          {comment.user
                            ?.name ||
                            "User"}
                          :
                        </strong>{" "}
                        {comment.text}
                      </div>
                    )
                  )
                ) : (
                  <p>
                    No comments yet
                  </p>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;