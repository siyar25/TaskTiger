import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Register from "../../Components/Auth/Register";
import HandymanCard from "../../Components/HandymanCard/HandymanCard";
import Title from "../../Components/Title";
import "./HomePage.css";
import Loading from "../../Components/Loading/Loading.jsx";
import { fetchData } from "../../util/fetch";

export default function HomePage() {
  const [users, setUsers] = useState(null);
  const [user, setUser] = useState(null);
  const isLoggedIn =
    localStorage.getItem("token") !== null &&
    localStorage.getItem("token") !== "null";
  const navigate = useNavigate();

  useEffect(() => {
    isLoggedIn ? navigate("/myprofile") : null;

    async function fetchUsers() {
      const res = await fetch("/api/users/tasker/all");

      try {
        const users = await res.json();

        setUsers(users);
      } catch (error) {
        console.log(error);
        setUsers(null);
      }
    }
    fetchUsers();
    fetchData("/api/users/tasker/all","", "GET", "","","");
  }, []);

  return (
    <div className="home-page">
      {users ? (
        <>
          <Title titleClass={"title"} subTitleClass={"sub-title"} />
          <div className="home-container">
            <div className="home-description">
              <div className="description-text">
                <div className="description-text-title">
                  Everyday life made easier
                </div>
                When life gets busy, you don't have to tackle it alone.
                <br />
                Get time back for what you love without breaking the bank.
                <br />
                <br />
                🌟 Choose your Tasker by reviews, skills, and price
                <br />
                📅 Schedule when it works for you — as early as today
                <br />
                💬 Chat, pay, tip, and review all through one platform
                <br />
              </div>
              <div className="handyman-cards">
                {users.map((currentUser) => {
                  return (
                    <HandymanCard
                      lastName={currentUser.lastName}
                      firstName={currentUser.firstName}
                      hourlyWage={currentUser?.taskerInfo?.hourlyWage}
                      skills={currentUser?.taskerInfo?.skills}
                      key={currentUser.id}
                    />
                  );
                })}
                ;
              </div>
            </div>
            <Register />
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}
