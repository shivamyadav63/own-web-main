import React from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        "https://own-web-main.onrender.com/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        toast.error(
          result.message ||
            "Login Failed"
        );
        return;
      }

      localStorage.setItem(
        "token",
        result.token
      );

      localStorage.setItem(
        "userId",
        result.user._id
      );

      localStorage.setItem(
        "loggedInUser",
        result.user.name
      );

      toast.success(
        "Login Successful"
      );

      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("Server Error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">
          Login
        </h1>

        <form
          className="login-form"
          onSubmit={handleSubmit(
            onSubmit
          )}
        >
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter Email"
            className="login-input"
            {...register("email", {
              required:
                "Email is required",
            })}
          />

          {errors.email && (
            <p className="error">
              {
                errors.email
                  .message
              }
            </p>
          )}

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter Password"
            className="login-input"
            {...register(
              "password",
              {
                required:
                  "Password is required",
              }
            )}
          />

          {errors.password && (
            <p className="error">
              {
                errors.password
                  .message
              }
            </p>
          )}

          <button
            type="submit"
            className="login-btn"
          >
            Login
          </button>

          <p className="login-link">
            Don't have an account?{" "}
            <Link to="/signup">
              Signup
            </Link>
          </p>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;