import React from "react";
import List from "@mui/material/List";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Chip, Tooltip } from "@mui/material";

import Sidebar from "./Sidebar";
import PlantCard from "../PlantCard";

import { appWidth, navHeight } from "./Utility";

export default function DrawerComponent({
  sortFunc,
  plants,
  client,
  toggleDate,
  setToggleDate,
  setEditPlant,
}) {
  return (
    <Drawer
      sx={{
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: appWidth,
          boxSizing: "border-box",
          backgroundColor: "#afd1a3",
          borderColor: "#2e7d32",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <List
        sx={{
          p: 0,
          height: `calc(${navHeight - 2}vh + 1px)`,
          minHeight: `calc(${navHeight - 2}vh + 1px)`,
        }}
      >
        <ListItem sx={{ p: 0, pt: "2vh", height: "100%" }}>
          <ListItemText
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h4> 🏊 Watering Due 🏊</h4>
          </ListItemText>
        </ListItem>
      </List>
      <Divider
        sx={{
          height: "calc(4vh)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&::before, &::after": {
            borderColor: "#2e7d32",
          },
        }}
      >
        <Tooltip title={sortFunc.tooltip}>
          <Chip
            label={sortFunc.tooltip}
            icon={sortFunc.icon}
            color="success"
            variant="outlined"
          ></Chip>
        </Tooltip>
      </Divider>
      <Sidebar
        plants={plants}
        sortFunc={sortFunc}
        client={client}
        toggleDate={toggleDate}
        setToggleDate={setToggleDate}
      >
        <PlantCard
          client={client}
          toggleDate={toggleDate}
          setToggleDate={setToggleDate}
          setEditPlant={setEditPlant}
        />
      </Sidebar>
    </Drawer>
  );
}
