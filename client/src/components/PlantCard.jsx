import Card from "react-bootstrap/Card";
import Moment from "react-moment";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import WarningIcon from "@mui/icons-material/Warning";
import moment from "moment";

const priorityEmojis = ["😱", "😋", "🤠"];
function PlantCard({ plant, client, toggleDate, setToggleDate, setEditPlant }) {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [needsWatering, setNeedsWatering] = useState(false);

  const waterPlant = async () => {
    client.waterPlant(plant);
  };

  useEffect(() => {
    return async () => {
      if (deleteConfirm) {
        client.deletePlant(plant);
      }
    };
  }, [deleteConfirm, client, plant]);
  useEffect(() => {
    if (plant) {
      setNeedsWatering(
        moment(plant.dateWatered)
          .add(plant.waterFrequency + 1, "days")
          .isBefore(moment())
      );
    }
  }, [plant]);

  return (
    <Card className="h-100">
      <Card.Img variant="top" src={plant.plantImage} />
      <Card.Body>
        <Card.Title>
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            {plant.plantDescription}
          </Typography>
        </Card.Title>
        <Card.Subtitle>
          <Chip
            sx={{ mt: 1, width: 0.475, ml: 0.25 }}
            variant="extended"
            size="medium"
            color="success"
            aria-label="add"
            label={`Priority: ${priorityEmojis[plant.plantPriority]}`}
          ></Chip>
          <Chip
            sx={{ mt: 1, width: 0.475, ml: 0.75 }}
            variant="extended"
            size="medium"
            color="success"
            aria-label="add"
            label={`Freq: ${plant.waterFrequency}`}
          ></Chip>
          <Button
            sx={{ width: 1, mt: 1, fontSize: ".65rem" }}
            variant="outlined"
            color="success"
            onClick={() => setToggleDate((p) => !p)}
          >
            <Typography variant="p">
              <span>
                Last Watered:&nbsp;
                {toggleDate ? (
                  <Moment format="DD/MM/YY">
                    {new Date(plant.dateWatered)}
                  </Moment>
                ) : (
                  <Moment fromNow>{plant.dateWatered}</Moment>
                )}
              </span>
            </Typography>
          </Button>
        </Card.Subtitle>
        <Button
          sx={{ width: 1, mt: 1 }}
          variant="contained"
          color={needsWatering ? "error" : "success"}
          onClick={() => {
            waterPlant();
          }}
        >
          {needsWatering ? "Needs Watering 😭" : "Watered 👍"}
        </Button>
        <ButtonGroup sx={{ width: 1, mt: 1 }} aria-label="button group">
          <Button
            onClick={() => setEditPlant(plant)}
            color="warning"
            sx={{ width: 0.5, fontSize: ".9rem" }}
          >
            Edit
          </Button>
          <Button
            onClick={() => setDeleteConfirm((p) => !p)}
            color="error"
            sx={{ width: 0.5, fontSize: ".9rem" }}
          >
            {!deleteConfirm ? (
              "Delete"
            ) : (
              <>
                <WarningIcon sx={{ fontSize: ".9rem", pb: 0.1, pl: 0.1 }} />
                Confirm?
              </>
            )}
          </Button>
        </ButtonGroup>
      </Card.Body>
    </Card>
  );
}

export default PlantCard;
