import React, { useEffect, useState } from "react";
import "./MyProfile.css";
import profileImage from "../../Images/handyman-janos.jpg";
import ReservationCard from "../../Components/ReservationCard/ReservationCard";
import { useNavigate } from "react-router-dom";

export default function MyProfile() {
  const [user, setUser] = useState(null);
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
        user.role.name === "ROLE_ADMIN" ? navigate("/adminpage") : null;
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const getAge = (birthDate) => {
    const thisDate = new Date();
    const dob = new Date(birthDate);
    const thisYear = thisDate.getFullYear();
    const dobYear = dob.getFullYear();
    return thisDate > dob ? thisYear - dobYear - 1 : thisYear - dobYear;
  };

  return user ? (
    <div className="myprofile-page">
      <div className="myprofile-name">
        {user.firstName + " " + user.lastName}
      </div>
      <div className="myprofile-details">
        <div className="myprofile-user-details">
          <div className="myprofile-image-div">
            <img src={profileImage} className="myprofile-image" />
          </div>
          <div className="myprofile-user-info">
            <div className="myprofile-user-info-title">
              {user.tasker ? "TASKER" : "CLIENT"}
            </div>
            <div className="myprofile-user-info-text">
              <ul>
                <li>{user.username}</li>
                <li>{getAge(user.dob)}</li>
                <li>{user.gender.replaceAll("_", " ")}</li>
                <li>
                  member since {new Date(user.registrationDate).getFullYear()}
                </li>
                {/* <li>tasks given out: 14</li> */}
              </ul>
            </div>
          </div>
          <div className="myprofile-user-intro">
            <div className="myprofile-user-intro-title">ABOUT ME</div>
            <div className="myprofile-user-intro-text">
              {user.shortIntroduction}
            </div>
          </div>
        </div>
        <div className="myprofile-reservation-container">
          <div className="myprofile-reservation-container-title">
            Your upcoming tasks 📅
          </div>
          <ReservationCard
            userReservations={
              user.tasker ? user.taskerInfo.reservations : user.reservations
            }
          />
        </div>
      </div>
    </div>
  ) : null;
}
