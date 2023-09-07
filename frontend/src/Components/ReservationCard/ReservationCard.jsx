import React, { useState } from "react";
import "./ReservationCard.css";
import handymanImage from "../../Images/handyman-janos.jpg";
import { useNavigate } from "react-router-dom";

export default function ReservationCard({ userReservations }) {
  const [reservations, setReservations] = useState(userReservations);
  const navigate = useNavigate();

  function deleteReservation(e, reservationId) {
    e.stopPropagation();
    
    async function reservationDelete() {
      const res = await fetch(`/api/reservation/${reservationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      
      try {
        const success = await res.json();
        console.log(success)
      } catch (error) {
        console.log(error);
      }
    }
    reservationDelete();
  }

  return reservations ? (
    reservations.length === 0 ? (
      <div className="reservations-empty">No upcoming reservations.</div>
    ) : (
      reservations.map((reservation) => {
        return (
          <div className="reservation-container" key={reservation.id} onClick={() => navigate(`/reservation/${reservation.id}`)}>
            <div className="reservation-card">
              <div className="reservation-card-date">
                Your reservation at: 2023.01.12 - 15:00
              </div>
              <div className="reservation-card-info">
                <div className="reservation-card-image-div">
                  <img
                    src={handymanImage}
                    alt="tasker-image"
                    className="reservation-card-image"
                  />
                </div>
                <div className="reservation-card-info-details">
                  <div className="reservation-card-status" style={{
            color:
              reservation?.reservationStatus === "PENDING"
                ? "darkorange"
                : reservation?.reservationStatus === "CONFIRMED"
                ? "darkblue"
                : reservation?.reservationStatus === "COMPLETED"
                ? "darkgreen"
                : reservation?.reservationStatus === "CANCELLED"
                ? "darkred"
                : "black",
          }}>
                    {reservation?.reservationStatus}
                  </div>
                  <div className="reservation-card-task">
                    {reservation?.workType.replaceAll("_", " ")}
                  </div>

                  <div className="reservation-card-id">
                    reservation code: {reservation.id}
                  </div>
                </div>
              </div>
            </div>
            <div className="reservation-interaction" onClick={(e, reservationId) => deleteReservation(e, reservation.id)}>❌</div>
          </div>
        );
      })
    )
  ) : (
    ""
  );
}
