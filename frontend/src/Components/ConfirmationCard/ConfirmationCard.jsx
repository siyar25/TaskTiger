import React, {useEffect, useState} from "react";
import "./ConfirmationCard.css";
import {useNavigate} from "react-router-dom";

export default function ConfirmationCard({details}) {
    const navigate = useNavigate();
    const duration = calculateTotalDurations(details?.timeslots);
    const timeSlotIds = details?.timeSlotsIds;

    const [user, setUser] = useState(null);
    const [client, setClient] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const [selectedJob, setSelectedJob] = useState(details?.jobs[0]);
    const [id, setId] = useState(null);
    const handleInputChange = (e) => {
        const {name, value} = e.target;

        switch (name) {
            case "client":
                setClient(value);
                break;
            case "address":
                setAddress(value);
                break;
            case "description":
                setDescription(value);
                break;
            case "message":
                setMessage(value);
                break;
            case "job":
                setSelectedJob(value);
                break;
            default:
                break;
        }
    };

    function calculateTotalDurations(timeslotsArray) {
        let durationSum = 0;
        for (let timeslot of timeslotsArray) {
            const start = new Date(timeslot.start.value);
            const end = new Date(timeslot.end.value);
            const diffInMs = end - start;
            const diffInHours = diffInMs / (1000 * 60 * 60); // convert milliseconds to hours
            durationSum += diffInHours;
        }
        return durationSum;
    }

    function getTotalCost(duration, hourlyWage) {
        return duration * hourlyWage;
    }

    const isLoggedIn =
        localStorage.getItem("token") !== null &&
        localStorage.getItem("token") !== "null";

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
                setMessage(`Hi! My name is ${user?.firstName} ${user?.lastName}. I am looking forward to working with you!`);
                calculateTotalDurations(details.timeslots);
            } catch (error) {
                console.log(error);
            }

        }

        fetchData();
    }, []);

    const goBack = () => {
        navigate(-1);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const duration = calculateTotalDurations(details?.timeslots);
        const res = await fetch(`api/reservation`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                client: user.id,
                tasker: details.tasker.id,
                description: description,
                workType: selectedJob,
                duration: duration,
                address: address,
                message: message.length === 0 ? `Hi! My name is ${user?.firstName} ${user?.lastName}. I am looking forward to working with you!` : message
            }),
        });
        try {
            const reservationId = await res.json();
            await fetch(`/api/timeslots/reservation/add`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    timeSlotIds: timeSlotIds,
                    reservationId: reservationId
                }),
            });

            navigate(`/reservation/${reservationId}`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="confirmation-card">
            <div className="confirmation-card-title">Confirmation Details:</div>
            <div className="confirmation-card-details">
                <div className="confirmation-details-line">
                    <div className="confirmation-details-nameTag">Client:</div>
                    <div
                        className="confirmation-details-parameter"
                        style={{fontSize: "1.25rem"}}
                    >
                        <b>{user?.firstName + " " + user?.lastName}</b>
                    </div>
                </div>
                <div className="confirmation-details-line">
                    <div className="confirmation-details-nameTag">Job:</div>
                    <div className="confirmation-details-parameter">
                        <select
                            defaultValue={details?.jobs[0]}
                            name="job"
                            id="confirmation-details-parameter-select"
                            onChange={handleInputChange}
                        >
                            {details?.jobs.map((job, index) => {
                                return (
                                    <option key={job + index} value={job}>
                                        {job.replaceAll("_", " ")}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
                <div className="confirmation-details-line">
                    <div className="confirmation-details-nameTag">Timeslots:</div>
                </div>
                <div className="confirmation-details-parameter">
                    {details?.timeslotsLabels ? details?.timeslotsLabels
                        .map((slotLabel, i) => {
                            return (
                                <li
                                    key={i}
                                >
                                    {slotLabel} </li>
                            );
                        }) : "-"}
                </div>
                <div className="confirmation-details-line">
                    <div className="confirmation-details-nameTag">Total slot(s) duration:</div>
                    <div className="confirmation-details-parameter">{duration} hour(s)</div>
                </div>
                <div className="confirmation-details-line">
                    <div className="confirmation-details-nameTag">Address:</div>
                    <input
                        name="address"
                        onChange={handleInputChange}
                        type={"text"}
                        className="confirmation-details-parameter"
                    ></input>
                </div>
                <div className="confirmation-details-line">
                    <div className="confirmation-details-nameTag">Description:</div>
                    <textarea
                        name="description"
                        onChange={handleInputChange}
                        className="confirmation-details-parameter"
                    ></textarea>
                </div>
                <div className="confirmation-details-line">
                    <div className="confirmation-details-nameTag">Message:</div>
                    <input
                        name="message"
                        onChange={handleInputChange}
                        type={"text"}
                        className="confirmation-details-parameter"
                    ></input>
                </div>
                <div className="confirmation-details-selectedPeopleBox">
                    <div className="confirmation-details-taskerContainer">
                        <div className="confirmation-details-taskerTagAndName">
                            <div className="confirmation-details-taskerTag">Tasker:</div>
                            <div className="confirmation-details-taskerName">
                                {details?.tasker.firstName + " " + details?.tasker.lastName}
                            </div>
                            <div className="confirmation-details-line-justWage">
                                <div>(Hourly Wage: ${details?.tasker.taskerInfo.hourlyWage})</div>
                            </div>
                        </div>
                    </div>
                    <hr id="hr"/>
                    <div className="confirmation-details-line-price">
                        <div className="confirmation-details-line-price">
                            <div>${details?.tasker.taskerInfo.hourlyWage}x{`${calculateTotalDurations(details?.timeslots)} hour(s)`}</div>
                        </div>
                        <div className>${getTotalCost(calculateTotalDurations(details?.timeslots), details?.tasker.taskerInfo.hourlyWage)}</div>
                    </div>
                    <div className="confirmation-details-line-total">
                        <div className="confirmation-details-nameTag">Total (USD):</div>
                        <div className="confirmation-details-line-total-priceValue">
                            ${getTotalCost(calculateTotalDurations(details?.timeslots), details?.tasker.taskerInfo.hourlyWage)}
                        </div>
                    </div>
                </div>
                <div>
                    <button
                        className="buttonBack"
                        onClick={goBack}
                    >
                        Back
                    </button>
                    <button
                        className="buttonSubmit"
                        type={"submit"}
                        onClick={(e) => handleSubmit(e)}
                    >
                        Send request to Tasker(s)
                    </button>
                </div>

            </div>
        </div>
    )
        ;
}
