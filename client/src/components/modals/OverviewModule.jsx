import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import { normalizeOverview } from "./normalizeOverview";

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
  const fetchAndNormalize = async () => {
    const res = await client.getOverview();
    if (res.data) {
      const { users, plants } = res.data;
      // Review ./OverviewModuleBrief
      // Implement in ./normalizeOverview.js
      const normalized = normalizeOverview(users, plants);
    }
  };

  useEffect(() => {
    if (open) {
      fetchAndNormalize();
    }
  }, [open]);
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
        <Typography id="modal-modal-title" variant="h6" component="h2">
          User Overview
        </Typography>
      </Box>
    </Modal>
  );
}
