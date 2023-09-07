import React, {useEffect, useState} from "react";
import "./TaskersPage.css";
import HandymanHorizontalCard from "../../Components/HandymanCard/HandymanHorizontalCard";
import {useNavigate} from "react-router-dom";
import Calendar from "../../Components/Calendar/Calendar.jsx";

export default function TaskersPage() {
    const [filterCountry, setFilterCountry] = useState("");
    const [filterCounty, setFilterCounty] = useState("");
    const [filterCity, setFilterCity] = useState("");
    const [filterStreet, setFilterStreet] = useState("");
    const [filterStreetNr, setStreetNr] = useState("");
    const [filterWage, setFilterWage] = useState(5);

    const [filterSkills, setFilterSkills] = useState([]);
    const [taskers, setTaskers] = useState(null);
    const [skills, setSkills] = useState([]);
    const [users, setUsers] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const [slotLabels, setSlotLabels] = useState([])
    const [timeSlotsIds, setTimeSlotsIds] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);

    const [selectedUser, setSelectedUser] = useState(null);
    const [filterMessage, setFilterMessage] = useState("");

    const [oneUserTimeTable, setOneUserTimeTable] = useState(null);

    const filteredTaskersLength = taskers ? taskers.filter((tasker) => tasker.id !== user.id).length : 0; //hiba

    useEffect(() => {
        async function fetchData() {
            const response = await fetch("/api/users/tasker/all");
            const data = await response.json();
            setUsers(data);
        }

        async function fetchSkills() {
            const res = await fetch("/api/users/skills");
            const data = await res.json();
            setSkills(data);
        }

        fetchData();
        fetchSkills();
    }, []);

    useEffect(() => {
    }, [slotLabels]);

    async function fetchTimetableByTaskerId(tasker) {
        const response = await fetch(`/api/timeslots/tasker/${tasker.id}`);
        const data = await response.json();
        setOneUserTimeTable([data]);
    }

    const handleCheckbox = (e) => {
        const isChecked = e.target.checked;
        const value = e.target.value;
        isChecked
            ? setFilterSkills([...filterSkills, value])
            : setFilterSkills(
                filterSkills.filter((filterValue) => filterValue !== value)
            );
    };

    async function setTaskerToTimeTable(tasker) {
        setSelectedUser(tasker);
        await fetchTimetableByTaskerId(tasker);
        setSlotLabels([]);
    }

    async function handleConfirmationBtn(tasker) {

        await fetch(`/api/timeslots/statusBySlotIds`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                timeSlotIds: timeSlotsIds,
                timeSlotStatusType: "PENDING",
            }),
        });

        const dataToSend = {
            tasker: tasker,
            jobs: tasker?.taskerInfo.skills,
            timeslotsLabels: slotLabels,
            timeslots: timeSlots,
            timeSlotsIds: timeSlotsIds
        };
        navigate("/confirmation", {state: {data: dataToSend}});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch(`/api/users/worktype`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(filterSkills),
        });

        try {
            const data = await res.json();
            if (filterSkills.length === 0) {
                setTaskers(users)
            } else {
                setTaskers(data);
            }
        } catch (error) {
            console.log(error);
        }
        setFilterMessage("No taskers match the selected criteria.");
    };

    useEffect(() => {
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

    return (
        <div className="taskers-page">
            <div className="taskers-page-sidebar">
                <div className="taskers-page-sidebar-calendar">
                    <div className="taskers-page-sidebar-calendar-title">
                        {selectedUser ? selectedUser.firstName + " " + selectedUser.lastName + "'s" : ""} Timetable:
                    </div>
                    <div>
                        {oneUserTimeTable ? oneUserTimeTable.map((timeTable, i) => {
                                return (
                                    <div key={i}>
                                        <Calendar
                                            timeSlots={timeSlots}
                                            setTimeSlots={setTimeSlots}
                                            timeSlotsIds={timeSlotsIds}
                                            setTimeSlotsIds={setTimeSlotsIds}
                                            slots={slotLabels}
                                            setSlots={setSlotLabels}
                                            events={timeTable}
                                        >
                                        </Calendar>
                                        <div>
                                            Selected:
                                            {slotLabels.length > 0 ? slotLabels.map((slot, i) => {
                                                    return (
                                                        <li key={i}>
                                                            {slot}
                                                        </li>
                                                    );
                                                })
                                                : " - "}
                                        </div>
                                        <input
                                            name={`confirm`}
                                            type={"submit"}
                                            id="filter-submit-btn"
                                            value={`Confirm ${selectedUser.firstName}'s reservation`}
                                            onClick={() => handleConfirmationBtn(selectedUser)}
                                        />
                                    </div>
                                );
                            })
                            : "Choose a Tasker to see the available timeslots!"}
                    </div>
                </div>
            </div>
            <div className="taskers-page-main">
                <form
                    className="taskers-page-form"
                    id="taskers-page-form"
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <div className="taskers-page-main-filter">
                        <div className="taskers-page-main-filter-title">
                            Filter Taskers:
                        </div>
                        {/*<div className="taskers-page-main-filter-address">*/}
                        {/*    <div className="taskers-page-main-filter-address-text">*/}
                        {/*        by Address:{" "}*/}
                        {/*    </div>*/}
                        {/*    <input*/}
                        {/*        name="country"*/}
                        {/*        placeholder="Country"*/}
                        {/*        onInput={(e) => setFilterCountry(e.target.value)}*/}
                        {/*    ></input>*/}
                        {/*    <input*/}
                        {/*        name="county"*/}
                        {/*        placeholder="County"*/}
                        {/*        onInput={(e) => setFilterCounty(e.target.value)}*/}
                        {/*    ></input>*/}
                        {/*    <input*/}
                        {/*        name="city"*/}
                        {/*        placeholder="City"*/}
                        {/*        onInput={(e) => setFilterCity(e.target.value)}*/}
                        {/*    ></input>*/}
                        {/*    <input*/}
                        {/*        name="street"*/}
                        {/*        placeholder="Street"*/}
                        {/*        onInput={(e) => setFilterStreet(e.target.value)}*/}
                        {/*    ></input>*/}
                        {/*    <input*/}
                        {/*        name="nr"*/}
                        {/*        placeholder="Nr."*/}
                        {/*        onInput={(e) => setStreetNr(e.target.value)}*/}
                        {/*    ></input>*/}
                        {/*</div>*/}
                        <div className="taskers-page-main-filter-skills">
                            <div className="taskers-page-main-filter-skills-text">
                                by Skills:{" "}
                            </div>
                            {skills
                                ? skills.map((skill) => {
                                    return (
                                        <div className="skill-div" key={skill}>
                                            <input
                                                name="skill-1"
                                                value={skill}
                                                type={"checkbox"}
                                                id={skill}
                                                className={"skills-checkbox"}
                                                checked={filterSkills.includes(skill)}
                                                onChange={(e) => handleCheckbox(e)}
                                            ></input>
                                            <label htmlFor={skill} id={skill + "-label"}>
                                                {skill.replaceAll("_", " ")}
                                            </label>
                                        </div>
                                    );
                                })
                                : null}
                        </div>
                        {/*<div className="taskers-page-main-filter-wage">*/}
                        {/*    <div className="taskers-page-main-filter-wage-text">*/}
                        {/*        by Hourly wage :{" "}*/}
                        {/*    </div>*/}
                        {/*    <input*/}
                        {/*        name="wage"*/}
                        {/*        type={"range"}*/}
                        {/*        id={"filter-wage"}*/}
                        {/*        min={5}*/}
                        {/*        defaultValue={5}*/}
                        {/*        onChange={(e) => setFilterWage(e.target.value)}*/}
                        {/*    />*/}
                        {/*    <div id="filter-wage-value">{filterWage}$</div>*/}
                        {/*</div>*/}
                        <input
                            name="filter"
                            type={"submit"}
                            id="filter-submit-btn"
                            value={"filter"}
                        />
                    </div>
                </form>
                <div className="taskers-page-main-list">
                    {taskers && filteredTaskersLength > 0 ? taskers
                        .filter((tasker) => tasker.id !== user.id)
                        .map((tasker, i) => {
                            return (
                                <div
                                    key={tasker.id}
                                    className={"taskers-page-main-list-card"}
                                >
                                    <HandymanHorizontalCard
                                        firstName={tasker.firstName}
                                        lastName={tasker.lastName}
                                        skills={tasker?.taskerInfo?.skills}
                                        hourlyWage={tasker?.taskerInfo?.hourlyWage}
                                        handleShowTableButton={() => setTaskerToTimeTable(tasker)}
                                        keyId={tasker.id}
                                    />
                                </div>
                            );
                        }) : filterMessage}
                </div>
            </div>
        </div>
    )
        ;
}





