import React, { useEffect } from "react";
import "./ConfirmationPage.css";
import { useLocation } from "react-router-dom";
import ConfirmationCard from "../../Components/ConfirmationCard/ConfirmationCard.jsx";

export default function ConfirmationPage() {
  const location = useLocation();

  const dataReceived = location.state?.data;

  return <ConfirmationCard details={dataReceived} />;
}
