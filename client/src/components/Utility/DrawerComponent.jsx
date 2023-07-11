import React from "react";
import List from "@mui/material/List";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Chip, Tooltip } from "@mui/material";

import Sidebar from "./Sidebar";
import PlantCard from "../PlantCard";

import { appWidth } from "./Utility";

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
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Divider />
      <List>
        <ListItem>
          <ListItemText
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
            }}
          >
            <h4> 🏊 Watering Due 🏊</h4>
          </ListItemText>
        </ListItem>
      </List>
      <Divider>
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
