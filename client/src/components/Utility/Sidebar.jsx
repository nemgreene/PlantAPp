import React, { useEffect, useState } from "react";
import moment from "moment";
import { List, ListItem } from "@mui/material";

export default function Sidebar({ plants, sortFunc, children }) {
  const [sidebarPlants, setSidebarPlants] = useState([...plants]);

  useEffect(() => {
    const filterPlants = () => {
      setSidebarPlants(
        plants.sort(sortFunc.exec).filter((p) => {
          const targetDate = moment(p.dateWatered).add(
            p.waterFrequency + 1,
            "days"
          );
          return targetDate.isBefore(moment());
        })
      );
    };
    filterPlants();
  }, [plants, sortFunc]);

  return (
    <List>
      {sidebarPlants.map((plant, index) => (
        <ListItem key={index}>
          {{ ...children, props: { ...children.props, plant } }}
        </ListItem>
      ))}
    </List>
  );
}
