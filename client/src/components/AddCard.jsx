import { useState } from "react";
import Card from "react-bootstrap/Card";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import AddPlantModal from "./modals/AddPlantModal";

function AddCard({ plant, client }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Card style={{ height: "100%", minHeight: "250px" }}>
      <Card.Body
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Tooltip title="Add Plant">
          <Fab
            onClick={handleOpen}
            color="success"
            variant="outlined"
            aria-label="add"
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Card.Body>
      <AddPlantModal handleClose={handleClose} open={open} client={client} />
    </Card>
  );
}

export default AddCard;
