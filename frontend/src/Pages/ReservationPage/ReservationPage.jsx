import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import MessageComponent from "../../Components/MessageComponent/MessageComponent";
import "./ReservationPage.css";

function getAgeDifferenceFromNow(pastDate) {
    let date1 = new Date(pastDate);
    let dateNow = new Date();
    let diffInMs = dateNow - date1;
    let diffInYears = diffInMs / (1000 * 60 * 60 * 24 * 365.25);
    diffInYears = diffInYears.toFixed(0);
    return diffInYears;
}

function ReservationPage() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [reservation, setReservation] = useState(null);
    const [user, setUser] = useState(null);
    const [tasker, setTasker] = useState(null);
    const [client, setClient] = useState(null);
    const [otherUserId, setOtherUserId] = useState(0);
    const [otherUser, setOtherUser] = useState(null);
    const [status, setStatus] = useState(null);
    const [ratings, setRatings] = useState({});
    const [hoverRatings, setHoverRatings] = useState([0, 0]);
    const [thankYou, setThankYou] = useState("");

    const isLoggedIn =
        localStorage.getItem("token") !== null &&
        localStorage.getItem("token") !== "null";

    async function fetchReservation() {
        const res = await fetch(`/api/reservation/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        try {
            const data = await res.json();
            setReservation(data);
            setTasker(data.taskerId);
            setClient(data.clientId);
            setOtherUserId(
                user?.id === data.taskerId ? data.clientId : data.taskerId
            );
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchReview() {
        const res = await fetch(`/api/review/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        try {
            const data = await res.json();
            data.forEach((reviewData) => {
                ratings[reviewData.workType] = reviewData.reviewValue;
            });
            Object.keys(ratings).length !== 0
                ? setThankYou("Thank you for rating our partner! Have a nice day!")
                : null;
        } catch (error) {
            console.log(error);
        }
    }

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
                user.reservations.map(reserved => reserved.id == id) ? null : navigate("/")
            } catch (error) {
                console.log(error);
            }
        }

        async function fetchOtherUser() {
            const res = await fetch(`/api/users/${otherUserId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            try {
                const data = await res.json();
                setOtherUser(data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchData();
        fetchReservation();
        fetchOtherUser();
        fetchReview();
    }, [id, otherUserId]);

    const clickHandler = async (e) => {
        setStatus(e.target.value);
        const res = await fetch(`/api/reservation/modify/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                reservationStatus: e.target.value,
            }),
        });
        try {
            const isTrue = await res.json();
            if (isTrue) {
                fetchReservation();
            }
        } catch (error) {
            console.log(error);
        }

        if (e.target.value === "CONFIRMED") {
            await fetch(`/api/timeslots/reservation/set`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    reservationId: id,
                    timeSlotStatusType: "RESERVED"
                }),
            });
        }
        if (e.target.value === "CANCELLED") {
            await fetch(`/api/timeslots/reservation/set`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    reservationId: id,
                    timeSlotStatusType: "FREE"
                }),
            });
        }
    }

    function isCurrentUserTasker() {
        return !user?.tasker;
    }

    function renderButtons(status, clickHandler) {
        switch (status) {
            case "PENDING":
                return (
                    <>
                        <button
                            onClick={(e) => clickHandler(e)}
                            value={"CONFIRMED"}
                            className="reservation-detail-confirm"
                        >
                            CONFIRM RESERVATION
                        </button>
                        {" "}
                        <button
                            onClick={(e) => clickHandler(e)}
                            value={"CANCELLED"}
                            className="reservation-detail-cancel"
                        >
                            CANCEL RESERVATION
                        </button>
                        {" "}
                    </>
                );
            case "CONFIRMED":
                return (
                    <>
                        <button
                            onClick={(e) => clickHandler(e)}
                            value={"COMPLETED"}
                            className="reservation-detail-completed"
                            disabled={!isCurrentUserTasker()}
                        >
                            COMPLETE RESERVATION
                        </button>
                        {" "}
                        <button
                            onClick={(e) => clickHandler(e)}
                            value={"CANCELLED"}
                            className="reservation-detail-cancel"
                        >
                            CANCEL RESERVATION
                        </button>
                    </>
                );
            case "COMPLETED":
                return (
                    <>
                        <div>Reservation completed</div>
                        <div>Please review our partner:</div>
                        <div className="review-skills">
                            {otherUser?.taskerInfo.skills.map((skill, skillIndex) => {
                                return (
                                    <div className="review-skill" key={skill}>
                                        <b>{skill.replaceAll("_", " ")}: </b>
                                        <div className="review-stars">
                                            {[1, 2, 3, 4, 5].map((starIndex) => (
                                                <span
                                                    key={starIndex}
                                                    className={
                                                        starIndex <= ratings[skill]
                                                            ? "star star-selected"
                                                            : "star"
                                                    }
                                                    onClick={() => handleStarClick(skill, starIndex)}
                                                >
                          ⭐
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                            {thankYou.length === 0 ? (
                                <div className="review-send" onClick={() => handleReview()}>
                                    Send review
                                </div>
                            ) : (
                                thankYou
                            )}
                        </div>
                    </>
                );
            default:
                return null;
        }
    }

    const handleStarClick = (skill, starIndex) => {
        if (thankYou.length !== 0) {
            return;
        }
        const newRating = {};
        newRating[skill] = starIndex;
        setRatings((ratings) => ({
            ...ratings,
            ...newRating,
        }));
    };

    function handleReview() {
        Object.keys(ratings).forEach(async (key) => {
            const res = await fetch(`/api/review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    reviewed: otherUserId,
                    reviewer: user?.id,
                    reviewValue: ratings[key],
                    workType: key,
                    description: "Default review description.",
                    reservationId: id,
                }),
            });
        });
        setThankYou("Thank you for rating our partner! Have a nice day!");
        return;
    }

    return reservation && otherUser ? (
        <div className="reservationPage_container">
            <div className="reservationPage_container_reservationDetails">
                <h2>Details:</h2>
                <hr/>
                <div className="reservation-detail">
                    <b>Address:</b> {reservation?.address}
                </div>
                <div
                    className="reservation-detail"
                    style={{
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
                    }}
                >
                    <b>Status:</b> {reservation?.reservationStatus}
                </div>
                <div className="reservation-detail">
                    <b>Type of work:</b> {reservation?.workType.replaceAll("_", " ")}
                </div>
                <div className="reservation-detail">
                    <b>Duration:</b> {`${reservation?.duration} hour(s)`}
                </div>
                <div className="reservation-detail">
                    <b>Description:</b> {reservation?.description}
                </div>
                <div className="reservation-detail">
                    <b>Total cost:</b> {`${tasker === otherUserId ? reservation?.duration * otherUser?.taskerInfo?.hourlyWage : reservation?.duration * user?.taskerInfo?.hourlyWage} $`}
                </div>
                {renderButtons(reservation?.reservationStatus, clickHandler)}

                <hr/>
                
                <div className="partner-info" style={{fontWeight: "bold", fontSize: "1.2rem", textAlign: "center"}}>{isCurrentUserTasker() ? "TASKER INFO:" : "YOUR CLIENT:"}</div>

                <table className="reservationPage_container_reservationDetails_table">
                    <tbody>
                    <tr>
                        <td style={{fontWeight: "bold", textAlign: "left"}}>
                            First Name:
                        </td>
                        <td>{otherUser?.firstName}</td>
                    </tr>
                    <tr>
                        <td style={{fontWeight: "bold", textAlign: "left"}}>
                            Last Name:
                        </td>
                        <td>{otherUser?.lastName}</td>
                    </tr>
                    <tr>
                        <td style={{fontWeight: "bold", textAlign: "left"}}>Email:</td>
                        <td>{otherUser?.email}</td>
                    </tr>
                    <tr>
                        <td style={{fontWeight: "bold", textAlign: "left"}}>
                            Phone Number:
                        </td>
                        <td>{otherUser?.phoneNumber}</td>
                    </tr>
                    <tr>
                        <td style={{fontWeight: "bold", textAlign: "left"}}>Gender:</td>
                        <td>{otherUser?.gender.replaceAll("_", " ")}</td>
                    </tr>
                    <tr>
                        <td style={{fontWeight: "bold", textAlign: "left"}}>
                            Age:
                        </td>
                        <td>{getAgeDifferenceFromNow(otherUser?.dob)}</td>
                    </tr>
                    {isCurrentUserTasker() ? (
                        <>
                            <tr>
                                <td style={{fontWeight: "bold", textAlign: "left"}}>
                                    Hourly Wage:
                                </td>
                                <td>{otherUser?.taskerInfo?.hourlyWage} $</td>
                            </tr>
                            <tr>
                                <td style={{fontWeight: "bold", textAlign: "left"}}>
                                    Skills:
                                </td>
                                <td>
                                    <ul>
                                        {otherUser?.taskerInfo?.skills.map((skill, index) => (
                                            <li key={index}>{skill.replaceAll("_", " ")}</li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        </>
                    ) : null}
                    </tbody>
                </table>
            </div>
            <MessageComponent
                reservationId={id}
                currentUserId={user?.id}
                otherUserId={otherUserId}
                isCompleted={reservation?.reservationStatus === "COMPLETED"}
            />
        </div>
    ) : (
        <></>
    );
}

export default ReservationPage;
