import "./SignInPage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    try {
      const token = await res.text();
      localStorage.setItem("token", token);
      if (localStorage.getItem("token").includes("error")) { 
        localStorage.setItem("token", null);
        throw 403;
      }
      navigate("/myprofile");
    } catch (error) {
      console.log(error);
      setErrorMessage("Invalid username or password.");
    }
  };

  return (
    <div className="sign-in-page">
      <div className="sign-in-container">
        <div className="sign-in-title">Sign In</div>
        <form className="sign-in-form" id="sign-in-form" onSubmit={(e) => handleSubmit(e)}>
          <input
            name="username"
            placeholder="Your username"
            onInput={(e) => setUsername(e.target.value)}
            required
          ></input>

          <input
            name="password"
            type={"password"}
            placeholder="Your password"
            onInput={(e) => setPassword(e.target.value)}
            required
          />

          <input
            name="submit"
            type={"submit"}
            id="sign-in-submit-btn"
            value={"Sign in"}
          />
        </form>

        <div className="error-message">{errorMessage}</div>

        <div className="register" onClick={() => navigate("/")}>
          Don't have an account? <b>Register here</b>.
        </div>
      </div>
    </div>
  );
}
