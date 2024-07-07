"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import { EventInput } from "@fullcalendar/core/index.js";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; 

import {
  fetchTaskById,
  setTaskId,
} from "@/store/features/modals/taskModalSlice";
import useModal from "@/app/hooks/useModal";
import EventModal from "./calendar-event-modal";

const Calendar: React.FC = () => {
  const { getUserToken } = useAuth();
  const token = getUserToken() || "";

  const { open, handleOpen, handleClose } = useModal();

  const dispatch = useDispatch<AppDispatch>();

  const { tasks } = useSelector((state: RootState) => state.tasks);

  const events: EventInput[] = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: task.start,
    end: task.end,
    className: task.color,
  }));

  const handleEventClick = (clickInfo: any) => {
    const taskId = clickInfo.event.id;

    dispatch(setTaskId(taskId));
    dispatch(fetchTaskById(`${taskId}`, token));

    handleOpen();
  };

  return (
    <div>
      <FullCalendar
        height={"80vh"}
        themeSystem="bootstrap5"
        timeZone={"local"}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin ]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: "prev,today,next",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
        }}
        eventClick={handleEventClick}
        dayMaxEventRows
        displayEventEnd
        displayEventTime
      />
      <EventModal open={open} handleClose={handleClose} />
    </div>
  );
};

export default Calendar;
