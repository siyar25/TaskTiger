import React, { useEffect, useState } from "react";
import "./AdminPage.css";
import profileImage from "../../Images/handyman-janos.jpg";
import { useNavigate } from "react-router-dom";
import UserCard from "../../Components/UserCard/UserCard";

function AdminPage() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [deleted, setDeleted] = useState(false);

  const isLoggedIn =
    localStorage.getItem("token") !== null &&
    localStorage.getItem("token") !== "null";
  const navigate = useNavigate();

  useEffect(() => {
    !isLoggedIn ? navigate("/") : null;

    async function fetchData() {
      const res = await fetch(`/api/users/authenticate`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      try {
        const user = await res.json();
        setUser(user);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/users/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    }

    fetchData();
  }, [deleted]);
  const getAge = (birthDate) => {
    const thisDate = new Date();
    const dob = new Date(birthDate);
    const thisYear = thisDate.getFullYear();
    const dobYear = dob.getFullYear();
    return thisDate > dob ? thisYear - dobYear - 1 : thisYear - dobYear;
  };
  return user ? (
    <div className="adminPage-page">
      <div className="adminPage-name">
        {user.firstName + " " + user.lastName}
      </div>
      <div className="adminPage-details">
        <div className="adminPage-user-details">
          <div className="adminPage-image-div">
            <img src={profileImage} className="adminPage-image" />
          </div>
          <div className="adminPage-user-info">
            <div className="adminPage-user-info-title">ADMIN</div>
            <div className="adminPage-user-info-text">
              <ul>
                <li>{user.username}</li>
                <li>{getAge(user.dob)}</li>
                <li>{user.gender.replaceAll("_", " ")}</li>
                <li>
                  Admin since {new Date(user.registrationDate).getFullYear()}
                </li>
              </ul>
            </div>
          </div>
          <div className="adminPage-user-intro">
            <div className="adminPage-user-intro-title">ABOUT ME</div>
            <div className="adminPage-user-intro-text">
              {user.shortIntroduction}
            </div>
          </div>
        </div>
        <div className="adminPage-reservation-container">
          <div className="adminPage-reservation-container-title">All users</div>
          {users ? (
            users.map((user, i) => (
              <UserCard
                key={i}
                state={deleted}
                setState={setDeleted}
                user={user}
              ></UserCard>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  ) : null;
}

export default AdminPage;
