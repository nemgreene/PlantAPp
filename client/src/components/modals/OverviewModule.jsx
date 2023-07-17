import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import normalizeOverview from "./normalizeOverview";
import { PieChart } from "react-minimal-pie-chart";

import { green } from "@mui/material/colors";
import moment from "moment";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderColor: "#2e7d32",
  borderRadius: "5px",
};

export default function OverviewModule({ open, handleClose, client }) {
  const [entities, setEntities] = useState({});
  const [needs, setNeeds] = useState({});

  const fetchAndNormalize = async () => {
    const res = await client.getOverview();
    if (res.data) {
      const { users, plants } = res.data;
      const { entities } = normalizeOverview(users, plants);
      setEntities(entities);
    }
  };
  const randomColor = (i) => {
    const dict = Object.keys(green).slice(2);
    return green[dict[i % dict.length]];
  };
  const needsWateringData = () => {
    const needs = entities?.plants?.allIds.filter((v, i) => {
      const targetDate = moment(entities.plants.byId[v].dateWatered).add(
        entities.plants.byId[v].waterFrequency + 1,
        "days"
      );
      const needsWatering = targetDate.isBefore(moment());
      return needsWatering;
    });
    const watered = entities?.plants?.allIds.filter((id) => {
      return needs.indexOf(id) == -1;
    });
    setNeeds([
      {
        value: needs?.length || 0,
        title: "Need Watering",
        color: randomColor(1),
      },
      {
        value: watered?.length || 0,
        title: "Watered",
        color: randomColor(3),
      },
    ]);
  };

  useEffect(() => {
    if (open) {
      fetchAndNormalize();
    }
  }, [open]);

  useEffect(() => {
    if (entities) {
      needsWateringData();
    }
  }, [entities]);
  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h4" component="h2">
          Overview Module
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography id="modal-modal-title" variant="h6" component="h3">
              All plants by Needs Watering
            </Typography>

            <PieChart
              data={needs}
              radius={45}
              lineWidth={70}
              segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
              // segmentsShift={(index) => (index === true ? 6 : 1)}
              animate
              label={({ x, y, dx, dy, dataEntry }) => (
                <text
                  dominantBaseline="central"
                  textAnchor="middle"
                  style={{
                    fill: "black",
                    pointerEvents: "none",
                    fontSize: ".4rem",
                    opacity: 0.75,
                  }}
                >
                  <tspan x={x} y={y} dx={dx} dy={dy}>
                    {dataEntry.percentage > 0
                      ? `${dataEntry.percentage.toFixed(0)}%`
                      : null}
                  </tspan>
                  <tspan
                    x={x}
                    y={y - 5}
                    dx={dx}
                    dy={dy}
                    style={{ fontSize: ".2rem" }}
                  >
                    {dataEntry.percentage > 0 ? `${dataEntry.title}` : null}
                  </tspan>
                </text>
              )}
              labelPosition={70 - 10 / 2}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography id="modal-modal-title" variant="h6" component="h3">
              All plants by users
            </Typography>
            {entities ? (
              <PieChart
                data={entities?.userPlants?.allIds.map((v, i) => {
                  return {
                    value: entities?.userPlants?.byId[v]?.length,
                    color: randomColor(i),
                    user: entities?.users?.byId[v].email,
                  };
                })}
                radius={45}
                lineWidth={70}
                segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
                // segmentsShift={(index) => (index === true ? 6 : 1)}
                animate
                label={({ x, y, dx, dy, dataEntry }) => (
                  <text
                    dominantBaseline="central"
                    textAnchor="middle"
                    style={{
                      fill: "black",
                      pointerEvents: "none",
                      fontSize: ".4rem",
                      opacity: 0.75,
                    }}
                  >
                    {/* {console.log(dataEntry)} */}
                    <tspan x={x} y={y} dx={dx} dy={dy}>
                      {dataEntry.percentage > 0
                        ? `${dataEntry.percentage.toFixed(1)}%`
                        : null}
                    </tspan>
                    <tspan
                      x={x}
                      y={y - 5}
                      dx={dx}
                      dy={dy}
                      style={{ fontSize: ".2rem" }}
                    >
                      {dataEntry.percentage > 0 ? `${dataEntry.user}` : null}
                    </tspan>
                  </text>
                )}
                labelPosition={70 - 10 / 2}
              />
            ) : null}
          </Grid>
        </Grid>
        ;
      </Box>
    </Modal>
  );
}
