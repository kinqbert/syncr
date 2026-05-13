import "./taskDeadlineCalendar.css";

import type { EventContentArg, EventInput } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import {
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

import { theme } from "@/lib/theme";
import { useSidebarStore } from "@/store/useSidebarStore";

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
  const isSidebarOpen = useSidebarStore((state) => state.isOpen);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const calendarRef = useRef<FullCalendar>(null);
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  const calendarView = isMobile
    ? "dayGridThreeDay"
    : isTablet
      ? "dayGridWeek"
      : "dayGridMonth";

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const updateCalendarSize = () => {
      calendarRef.current?.getApi().updateSize();
    };

    const frameId = window.requestAnimationFrame(updateCalendarSize);
    const transitionEndId = window.setTimeout(updateCalendarSize, 260);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(transitionEndId);
    };
  }, [isLoading, isSidebarOpen]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const calendarApi = calendarRef.current?.getApi();

    if (!calendarApi || calendarApi.view.type === calendarView) {
      return;
    }

    calendarApi.changeView(calendarView);
    calendarApi.updateSize();
  }, [calendarView, isLoading]);

  useEffect(() => {
    const calendarContainer = calendarContainerRef.current;

    if (!calendarContainer || isLoading) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      calendarRef.current?.getApi().updateSize();
    });

    resizeObserver.observe(calendarContainer);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isLoading]);

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
        <Box
          ref={calendarContainerRef}
          className="syncr-calendar"
          height="100%"
          minHeight={0}
        >
          <FullCalendar
            ref={calendarRef}
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
              right: isMobile
                ? "dayGridThreeDay,dayGridDay"
                : isTablet
                  ? "dayGridWeek,dayGridThreeDay"
                  : "dayGridMonth,dayGridWeek",
            }}
            height="100%"
            initialView={calendarView}
            plugins={[dayGridPlugin, interactionPlugin]}
            views={{
              dayGridThreeDay: {
                buttonText: "3 days",
                duration: { days: 3 },
                type: "dayGrid",
              },
            }}
          />
        </Box>
      )}
    </Paper>
  );
};
