import "./taskDeadlineCalendar.css";

import type { EventContentArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router";

type TaskDeadlineCalendarProps = {
  events: EventInput[];
  isLoading: boolean;
};

const renderEventContent = (eventInfo: EventContentArg) => {
  return (
    <Stack className="syncr-calendar-event" direction="row">
      <Box className="syncr-calendar-event-dot" component="span" />
      <Stack className="syncr-calendar-event-copy" minWidth={0}>
        <Typography className="syncr-calendar-event-title" component="span">
          {eventInfo.event.title}
        </Typography>
        <Typography className="syncr-calendar-event-meta" component="span">
          {eventInfo.event.extendedProps.meta}
        </Typography>
      </Stack>
    </Stack>
  );
};

export const TaskDeadlineCalendar = ({
  events,
  isLoading,
}: TaskDeadlineCalendarProps) => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      {isLoading ? (
        <Stack alignItems="center" height="100%" justifyContent="center">
          <CircularProgress size={28} />
        </Stack>
      ) : (
        <Box className="syncr-calendar" height="100%" minHeight={0}>
          <FullCalendar
            dayMaxEvents={3}
            eventClick={(eventInfo) => {
              eventInfo.jsEvent.preventDefault();

              if (eventInfo.event.url) {
                navigate(eventInfo.event.url);
              }
            }}
            eventContent={renderEventContent}
            events={events}
            firstDay={1}
            headerToolbar={{
              center: "title",
              left: "prev,next today",
              right: "dayGridMonth,dayGridWeek",
            }}
            height="100%"
            initialView="dayGridMonth"
            plugins={[dayGridPlugin, interactionPlugin]}
          />
        </Box>
      )}
    </Paper>
  );
};
