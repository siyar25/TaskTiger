import React, { useState, useEffect } from "react";
import "./MessageComponent.css"

const MessageComponent = ({ reservationId, currentUserId, otherUserId, isCompleted }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [reservation, setReservation] = useState(null);
  useEffect(() => {

    async function fetchMessages() {
      try {
        const response = await fetch(
          `/api/message/${reservationId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchMessages();
  }, [reservationId]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/message/${reservationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        senderId: currentUserId,
        receiverId: otherUserId,
        createdDate: new Date().toISOString(),
        message: message,
        reservationId: reservationId,
      }),
    });
    try {
      if (response.ok) {
        const newMessage = {
          sender: { id: currentUserId },
          receiver: { id: otherUserId },
          createdDate: new Date(),
          message: message,
        };
        setMessages([...messages, newMessage]);
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="reservationPage_container_messages">
      <h2>Messages:</h2>
      <ul className="messages">
        {messages.map((msg, index) => (
          <li
            key={index}
            className={msg.senderId === currentUserId || msg.sender?.id === currentUserId ? "message-message-from-me" : "message-message-to-me"}
          >
            {msg.message}
          </li>
        ))}
      </ul>
      <div className="message-sender">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here"
        className="message-message"
        maxLength={250}
        onKeyPress={(e) => e.key === "Enter" ? sendMessage(e) : null}
        disabled={isCompleted}
      />
      <button
        onClick={(e) => {
          sendMessage(e);
        }}
        className={"message-send"}
      >
        ▶
      </button>
      </div>
    </div>
  );
};
export default MessageComponent;
