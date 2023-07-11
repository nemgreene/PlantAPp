import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import HistoryIcon from "@mui/icons-material/History";
import UpdateIcon from "@mui/icons-material/Update";
import moment from "moment";

const needsWatering = (a, b) => {
  return [
    moment(a.dateWatered)
      .add(a.waterFrequency + 1, "days")
      .isBefore(moment()),
    moment(b.dateWatered)
      .add(b.waterFrequency + 1, "days")
      .isBefore(moment()),
  ];
};
export const sortObj = {
  priorityDesc: {
    icon: <NotificationsNoneIcon />,
    title: "Priority",
    tooltip: "Lowest Priority First",
    exec: (a, b) => {
      return b.plantPriority - a.plantPriority;
    },
  },
  priorityAsc: {
    icon: <NotificationsActiveIcon />,
    title: "Priority",
    tooltip: "Highest Priority First",
    exec: (a, b) => {
      return a.plantPriority - b.plantPriority;
    },
  },
  dateDesc: {
    icon: <HistoryIcon />,
    title: "Date",
    tooltip: "Most Recent Watered First",
    exec: (a, b) => {
      return new Date(b.dateWatered) - new Date(a.dateWatered);
    },
  },
  dateAsc: {
    icon: <UpdateIcon />,
    title: "Date",
    tooltip: "Least Recent Watered First",
    exec: (a, b) => {
      return new Date(a.dateWatered) - new Date(b.dateWatered);
    },
  },
  wateringAsc: {
    icon: <PriorityHighIcon />,
    title: "Date",
    tooltip: "Needs Watering First",
    exec: (a, b) => {
      const [needsA, needsB] = needsWatering(a, b);
      if (needsA && !needsB) {
        return -1;
      } else if (!needsA && needsB) {
        return 1;
      } else return a.plantPriority - b.plantPriority;
    },
  },
  wateringDesc: {
    icon: <LowPriorityIcon />,
    title: "Date",
    tooltip: "Watered Last",
    exec: (a, b) => {
      const [needsA, needsB] = needsWatering(a, b);
      if (needsA && !needsB) {
        return 1;
      } else if (!needsA && needsB) {
        return -1;
      } else return a.plantPriority - b.plantPriority;
    },
  },
};

const large = "20vw";
const med = "33vw";
const smallWidth = "33vw";
const extraSmall = "50vw";

export const appWidth = { xs: extraSmall, s: smallWidth, md: med, lg: large };

export const drawerWidth = {
  xs: `calc(100% - ${extraSmall})`,
  s: `calc(100% - ${smallWidth})`,
  md: `calc(100% - ${med})`,
  lg: `calc(100% - ${large})`,
};
