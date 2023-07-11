import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";

import { sortObj, appWidth, drawerWidth } from "./Utility/Utility";
import EditModal from "./modals/EditModal";

import PlantCard from "./PlantCard";
import AddCard from "./AddCard";
import NavBar from "./Utility/NavBar";
import DrawerComponent from "./Utility/DrawerComponent";
import SpeedDialComponent from "./Utility/SpeedDialComponent";

export default function Dashboard({ client }) {
  const [plants, setPlants] = useState([]);
  const [toggleDate, setToggleDate] = useState(false);
  const [sortFunc, setSortFunc] = useState(sortObj.wateringDesc);
  const [editPlant, setEditPlant] = useState(undefined);
  const [open, setOpen] = useState(false);
  // Handle Edit modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditPlant(undefined);
  };
  // Get all plants for user
  const fetchPlants = async () => {
    const res = await client.getAllPlants();
    if (res.data) {
      setPlants(res.data);
    }
  };
  // Bind to client for later access
  client.fetchPlants = fetchPlants;

  useEffect(() => {
    // Onload get all plants
    client.fetchPlants();
  }, [sortFunc, client]);

  useEffect(() => {
    // Handle Edit modal open/close
    if (editPlant) handleOpen();
    else {
      handleClose();
    }
  }, [editPlant]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: drawerWidth,
          ml: appWidth,
        }}
      >
        <NavBar client={client} />
      </AppBar>
      <DrawerComponent
        sortFunc={sortFunc}
        plants={plants}
        client={client}
        toggleDate={toggleDate}
        setToggleDate={setToggleDate}
        setEditPlant={setEditPlant}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: appWidth,
        }}
      >
        <SpeedDialComponent sortObj={sortObj} setSortFunc={setSortFunc} />
        <Toolbar />
        <EditModal
          handleClose={handleClose}
          open={open}
          client={client}
          plant={editPlant}
        />
        <Grid container className="justify-content-left" spacing={4}>
          <Grid item xs={12} md={6} lg={3}>
            <AddCard client={client} />
          </Grid>
          {plants.sort(sortFunc.exec).map((plant, i) => {
            return (
              <Grid item xs={12} md={6} lg={3} key={i}>
                <PlantCard
                  plant={plant}
                  client={client}
                  toggleDate={toggleDate}
                  setToggleDate={setToggleDate}
                  setEditPlant={setEditPlant}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}
