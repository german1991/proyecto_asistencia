import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import React from 'react';


function Calendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/turnos") 
      .then((response) => response.json())
      .then((data) => {
        const formattedEvents = data.map((turno) => ({
          title: turno.name,
          start: turno.date,
        }));
        setEvents(formattedEvents);
      });
  }, []);

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events} 
    />
  );
}

export default Calendar;
