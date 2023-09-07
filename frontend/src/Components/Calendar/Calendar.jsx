import React, {Component} from 'react';
import {DayPilot, DayPilotCalendar, DayPilotNavigator} from "@daypilot/daypilot-lite-react";
import "./CalendarStyles.css";
import "./Modal_rounded.css";

const styles = {
    wrap: {
        display: "flex", justifyContent: "center"
    }, left: {
        marginRight: "10px"
    }, main: {
        flexGrow: "1"
    }
};

function formatDate(date) {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1; // Month is zero-based, so add 1 to get the correct value
    const day = newDate.getDate();
    return year.toString() + "-" + month.toString().padStart(2, '0') + "-" + day.toString().padStart(2, '0');
}

export default class Calendar extends Component {

    constructor(outsideProp) {
        super(outsideProp);
        this.calendarRef = React.createRef();
        this.state = {
            viewType: "Week",
            data: this.props.events,
            durationBarVisible: false,
            eventMoveHandling: "Disabled",
            eventResizeHandling: "Disabled",
            onEventClick: async args => {
                const dp = this.calendar;
                const outsideSlotsText = this.props.slots;
                const outsideSlotsIds = this.props.timeSlotsIds;
                const outsideSlots = this.props.timeSlots;
                if (args.e.data.status === "RESERVED") {
                    const modal = DayPilot.Modal.alert(`This timeslot is reserved!`, {
                        theme: "modal_rounded", okText: "OK"
                    });
                }

                if (args.e.data.status === "PENDING") {
                    const modal = DayPilot.Modal.alert(`This timeslot has pending status!`, {
                        theme: "modal_rounded", okText: "OK"
                    });
                }
                if (args.e.data.status === "SELECTED") {
                    const modal = DayPilot.Modal.confirm(`Do you want to remove '${args.e.text()}' timeslot?`, {
                        theme: "modal_rounded", okText: "Yes", cancelText: "No"
                    }).then(function (insideArgsRemove) {
                        if (!insideArgsRemove.canceled) {
                            const e = args.e;
                            e.data.status = "FREE";
                            e.data.backColor = "#6aa84f";
                            dp.events.update(e);
                            if (outsideProp.length === 1) {
                                outsideProp.setSlots([]);
                            } else {
                                let modifiedArray = outsideSlotsText.filter(item => item !== formatDate(e.data.start.value) + " -- " + e.data.text);
                                outsideProp.setSlots([...modifiedArray]);
                            }
                            if (outsideSlotsIds.length === 1) {
                                outsideProp.setTimeSlots([]);
                                outsideProp.setTimeSlotsIds([]);
                            } else {
                                let modifiedArrayIds = outsideSlotsIds.filter(slotId => slotId !== e.data.id);
                                let modifiedArraySlots = outsideSlots.filter(slot => slot !== e.data);
                                outsideProp.setTimeSlots([...modifiedArraySlots]);
                                outsideProp.setTimeSlotsIds([...modifiedArrayIds]);
                            }
                        }
                    });
                }

                if (args.e.data.status === "FREE") {
                    const modal = DayPilot.Modal.confirm(`Do you reserve '${args.e.text()}' timeslot'?'`, {
                        theme: "modal_rounded", okText: "Yes", cancelText: "No"
                    }).then(function (insideArgs) {
                        if (!insideArgs.canceled) {
                            const e = args.e;
                            e.data.status = "SELECTED";
                            e.data.backColor = "#f1c232";
                            dp.events.update(e);
                            if (outsideSlotsText.length === 0) {
                                outsideProp.setSlots([formatDate(e.data.start.value) + " -- " + e.data.text]);
                            } else {
                                let slotsArray = outsideSlotsText;
                                slotsArray.push(formatDate(e.data.start.value) + " -- " + e.data.text);
                                outsideProp.setSlots([...slotsArray]);
                            }
                            if (outsideSlotsIds.length === 0) {
                                outsideProp.setTimeSlots([e.data]);
                                outsideProp.setTimeSlotsIds([e.data.id]);
                            } else {
                                let slotsArrayIds = outsideSlotsIds;
                                let slotArraySlots = outsideSlots;
                                slotsArrayIds.push(e.data.id);
                                slotArraySlots.push(e.data);
                                outsideProp.setTimeSlotsIds([...slotsArrayIds]);
                                outsideProp.setTimeSlots([...slotArraySlots]);
                            }
                        }
                    });
                }
            }
        }
    }

    get calendar() {
        return this.calendarRef.current.control;
    }

    componentDidMount() {
        let events = this.props.events;
        const startDate = new Date();
        this.calendar.update({startDate, events});
    }

    render() {
        return (<div style={styles.main}>
                <div style={styles.wrap}>
                    <DayPilotNavigator
                        selectMode={"week"}
                        showMonths={1}
                        skipMonths={1}
                        startDate={new Date()}
                        events={this.props.events}
                        onTimeRangeSelected={args => {
                            this.calendar.update({
                                startDate: args.day,
                                events: this.props.events
                            });
                        }}
                    />
                </div>
                <div style={styles.main}>
                    <DayPilotCalendar
                        {...this.state}
                        ref={this.calendarRef}
                    />
                </div>
            </div>

        );
    }
}


