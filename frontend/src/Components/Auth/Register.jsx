import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Input/Input";

export default function Register() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("MALE");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [isTasker, setIsTasker] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [errorMessage, setErrorMessage] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    JSON.parse(window.localStorage.getItem("user")) !== null
      ? navigate("/myprofile")
      : null;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === passwordAgain) {
      const res = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          firstName: firstName,
          lastName: lastName,
          gender: gender,
          phoneNumber: phoneNumber,
          birthDate: birthDate,
          email: email,
          isTasker: isTasker,
          password: password,
        }),
      });

      try {
        const token = await res.text();
        window.localStorage.setItem("token", token);
        if (localStorage.getItem("token").includes("error")) { 
          localStorage.setItem("token", null);
          throw "User already exists";
        }
        navigate("/myprofile");
      } catch (error) {
        setErrorMessage("Failed to register. Maybe username or email already exists?");
      }
    } else {
      setErrorMessage("Passwords don't match!");
    }
  };

  return (
    <div className="home-form">
      <div className="form-title">Register here</div>
      <form className="home-form-form" id="home-form-form" onSubmit={(e) => handleSubmit(e)}>
        <input
          name="name"
          placeholder="Your username"
          onInput={(e) => setUsername(e.target.value)}
          required
        ></input>

        <input
          name="firstName"
          placeholder="Your first name"
          onInput={(e) => setFirstName(e.target.value)}
          required
        ></input>

        <input
          name="lastName"
          placeholder="Your last name"
          onInput={(e) => setLastName(e.target.value)}
          required
        ></input>

        <input
          name="phone"
          placeholder="Your phone number"
          onInput={(e) => setPhoneNumber(e.target.value)}
          required
        ></input>

        <input
          name="dob"
          type={"date"}
          id="dob"
          onChange={(e) => setBirthDate(e.target.value)}
          required
        ></input>

        <input
          name="email"
          type={"email"}
          placeholder="Your email address"
          onInput={(e) => setEmail(e.target.value)}
          required
        />

        <input
          name="password"
          type={"password"}
          placeholder="Your password"
          onInput={(e) => setPassword(e.target.value)}
          required
        />

        <input
          name="password-again"
          type={"password"}
          placeholder="Your password again"
          onInput={(e) => setPasswordAgain(e.target.value)}
          required
        />

        <select
          name="gender"
          id="gender"
          form="home-form-form"
          onChange={(e) => setGender(e.target.value.toUpperCase())}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer_Not_To_Say">Prefer not to say</option>
        </select>

        <div className="isTasker-checkbox">
          <input
            name="isTasker"
            type={"checkbox"}
            id="isTasker"
            onChange={(e) => setIsTasker(e.target.checked)}
          ></input>
          <label htmlFor="isTasker" id="isTasker-label">
            I want to be a Tasker!
            <br />
            <span style={{ fontSize: "0.7rem", color: "rgb(68,68,68)" }}>
              This way you will be able to receive tasks and earn money! You can
              specify your expertise on your profile page.
            </span>
          </label>
        </div>

        <input
          name="submit"
          type={"submit"}
          id="submit-btn"
          value={"Register"}
        />
      </form>
      <div className="error-message">{errorMessage}</div>

      <div className="sign-in" onClick={() => navigate("/signin")}>
        Already have an account? <b>Sign&nbsp;in</b>.
      </div>
    </div>
  );
}
