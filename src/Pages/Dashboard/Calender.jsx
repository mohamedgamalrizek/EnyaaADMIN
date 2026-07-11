/* eslint-disable react/prop-types */
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Box,
  Divider,
  Text,
  useColorMode,
  useTheme,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { t } from "../../lib/arabicUi";

const localizer = momentLocalizer(moment);

const calendarMessages = {
  allDay: "طوال اليوم",
  previous: "السابق",
  next: "التالي",
  today: "اليوم",
  month: "شهر",
  week: "أسبوع",
  day: "يوم",
  agenda: "جدول",
  date: "التاريخ",
  time: "الوقت",
  event: "الموعد",
  noEventsInRange: "لا توجد مواعيد في هذا النطاق",
  showMore: (total) => `+${total} المزيد`,
};

const AppointmentsCalendar = ({ appointmentData }) => {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const selectedDate = new Date();
  const navigate = useNavigate();
  // Calculate start and end of the week based on selected date
  const startOfWeek = moment(selectedDate).startOf("month").toDate();

  // Convert appointment data to events format
  const events = appointmentData?.map((appointment) => ({
    id: appointment.id,
    title: `د. ${appointment.doct_f_name} ${appointment.doct_l_name} مع ${appointment.patient_f_name} ${appointment.patient_l_name} - ${t(appointment.status)}`,
    start: moment(`${appointment.date} ${appointment.time_slots}`).toDate(),
    end: moment(`${appointment.date} ${appointment.time_slots}`)
      .add(30, "minutes") // Assuming each appointment is 30 minutes long
      .toDate(),
    description: `النوع: ${t(appointment.type)}, القسم: ${appointment.dept_title}`,
    status: appointment.status,
  }));

  const handleEventClick = (event) => {
    navigate(`/appointment/${event.id}`);
  };

  return (
    <Box
      p={4}
      borderRadius="md"
      boxShadow="md"
      bg={colorMode === "dark" ? theme.colors.gray[900] : "#fff"}
    >
      <Text textAlign={"center"} fontSize={"lg"} fontWeight={"bold"}>
        {t("Appointment Calendar")}
      </Text>
      <Divider mb={5} mt={2} />

      {appointmentData && (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{
            height: 500,
            backgroundColor:
              colorMode === "dark" ? theme.colors.gray[900] : "#fff",
            color: colorMode === "dark" ? "#fff" : "#000",
            borderRadius: "8px",
            border: "none",
          }}
          defaultView="day"
          views={["week", "day", "agenda"]}
          culture="ar"
          messages={calendarMessages}
          min={
            new Date(
              startOfWeek.getFullYear(),
              startOfWeek.getMonth(),
              startOfWeek.getDate(),
              7,
              0
            )
          } // Start from 7:00 AM
          max={
            new Date(
              startOfWeek.getFullYear(),
              startOfWeek.getMonth(),
              startOfWeek.getDate(),
              18,
              0
            )
          }
          onSelectEvent={handleEventClick} // Add the onClick handler here
          components={{
            event: CustomEvent, // Use the custom event component here
          }}
        />
      )}
    </Box>
  );
};

const CustomEvent = ({ event }) => {
  const start = moment(event.start).format("hh:mm A");
  const theme = useTheme();
  const { colorMode } = useColorMode();

  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad"; // Default color

    if (event.status === "Cancelled") {
      backgroundColor = theme.colors.red[500];
    } else if (event.status === "Rejected") {
      backgroundColor = theme.colors.red[500];
    } else if (event.status === "Pending") {
      backgroundColor = theme.colors.orange[500];
    }

    return {
      backgroundColor,
      color: colorMode === "dark" ? "#fff" : "#fff",
      borderRadius: "8px",
      border: `2px solid ${backgroundColor}`,
      cursor: "pointer", // Change cursor to pointer for better UX
    };
  };

  return (
    <Box borderRadius="md">
      <Text
        fontWeight="400"
        style={eventStyleGetter(event)}
        py={"2px"}
        px={2}
        fontSize={"xs"}
      >
        {start} {event.title}
      </Text>

      {/* Hide end time by not displaying it */}
    </Box>
  );
};

export default AppointmentsCalendar;
