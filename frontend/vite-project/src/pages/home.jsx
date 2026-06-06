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
        "http://localhost:3001/api/posts",
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
        "http://localhost:3001/api/posts"
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
        `http://localhost:3001/api/posts/${postId}/like`,
        {
          userId,
        }
      );

      getPosts();
    } catch (error) {
      console.error(error);
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
        `http://localhost:3001/api/posts/${postId}/comment`,
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
        `http://localhost:3001/api/posts/${postId}`,
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
          style={{
            width: "100%",
            minHeight: "100px",
            padding: "10px",
          }}
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Image URL"
          {...register("image")}
          style={{
            width: "100%",
            padding: "10px",
          }}
        />

        <br />
        <br />

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
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "20px",
              borderRadius: "10px",
              background: "#fff",
            }}
          >
            <h3>
              {post.user?.name ||
                "Unknown User"}
            </h3>

            {post.text && (
              <p>{post.text}</p>
            )}

            {post.image && (
              <img
                src={post.image}
                alt="post"
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  borderRadius: "10px",
                }}
              />
            )}

            <div
              style={{
                marginTop: "15px",
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <button
                onClick={() =>
                  handleLike(post._id)
                }
              >
                👍 Like (
                {post.likes?.length || 0})
              </button>

              <span>
                💬 Comments (
                {post.comments?.length ||
                  0}
                )
              </span>

              {localStorage.getItem(
                "userId"
              ) === post.user?._id && (
                <button
                  onClick={() =>
                    handleDelete(post._id)
                  }
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding:
                      "8px 12px",
                    borderRadius:
                      "5px",
                    cursor: "pointer",
                  }}
                >
                  🗑 Delete
                </button>
              )}
            </div>

            <div
              style={{
                marginTop: "15px",
              }}
            >
              <input
                type="text"
                placeholder="Write comment..."
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
                style={{
                  padding: "8px",
                  width: "70%",
                }}
              />

              <button
                onClick={() =>
                  handleComment(
                    post._id
                  )
                }
                style={{
                  marginLeft:
                    "10px",
                }}
              >
                Add Comment
              </button>
            </div>

            <div
              style={{
                marginTop: "15px",
              }}
            >
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
                      style={{
                        marginBottom:
                          "5px",
                      }}
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
        ))
      )}
    </div>
  );
};

export default Home;