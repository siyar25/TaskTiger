import React from "react";
import "./UserCard.css";
import userImage from "../../Images/handyman-janos.jpg";

export default function UserCard({ user, state, setState }) {
  const userId = user?.id;

  async function deleteUserById() {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("User deleted successfully:", result);
        setState(!state);
        return result;
      } else {
        console.error("Error deleting user:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      return null;
    }
  }

  return user ? (
    <div className="user-card">
      <img src={userImage} className="user-card-image" alt={"user-janos.jpg"} />
      <div className="user-card-details">
        <div className="user-name">{user.lastName + " " + user.firstName}</div>
        <div className="user-name">{user.userName}</div>
        <div className="user-name">{user.registrationDate}</div>
        <div>{user.istasker}</div>
        <div className="userCard-buttonContainer">
          <button onClick={() => deleteUserById()}>DELETE</button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
