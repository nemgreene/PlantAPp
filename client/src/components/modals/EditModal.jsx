import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function EditModal({ plant, open, handleClose, client }) {
  const [plantDescription, setPlantDescription] = useState();
  const [waterFrequency, setWaterFrequency] = useState(7);
  const [plantPriority, setPlantPriority] = useState(1);
  const [imgToggle, setImgToggle] = useState(false);
  const [plantImage, setPlantImage] = useState();

  const changeRange = (e) => {
    setWaterFrequency(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPlant = {
      plantDescription,
      waterFrequency,
      plantPriority,
      dateWatered: plant.dateWatered,
      plantImage: plantImage,
    };
    const res = await client.editPlant({ ...plant, ...newPlant });
    if (res.status === 200) {
      handleClose();
    }
  };
  useEffect(() => {
    if (plant) {
      setPlantDescription(plant.plantDescription);
      setWaterFrequency(plant.waterFrequency);
      setPlantPriority(plant.plantPriority);
      setPlantImage(plant.plantImage);
    }
  }, [plant]);

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
          Edit Plant
        </Typography>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Plant Name*
              </Typography>
            </Form.Label>
            <Form.Control
              value={plantDescription}
              onChange={(e) => setPlantDescription(e.target.value)}
              required
              type="text"
            />
            <Form.Label>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {waterFrequency === 1
                  ? "Water Every Day"
                  : `Water Every ${waterFrequency} Days:`}
              </Typography>
            </Form.Label>
            <Form.Range
              max={30}
              min={1}
              value={waterFrequency}
              onChange={changeRange}
              variant="success"
            />
          </Form.Group>
          <InputGroup className="mb-3">
            <Tooltip title="Highest priority plants displayed first">
              <InputGroup.Text sx={{ width: 1 / 4 }}>Priority:</InputGroup.Text>
            </Tooltip>
            <Tooltip title="High Priority">
              <Button
                color="success"
                variant={plantPriority === 0 ? "contained" : "outlined"}
                sx={{ width: 1 / 4 }}
                onClick={() => setPlantPriority(0)}
                aria-label="High"
              >
                😱
              </Button>
            </Tooltip>
            <Tooltip title="Medium Priority">
              <Button
                color="success"
                variant={plantPriority === 1 ? "contained" : "outlined"}
                sx={{ width: 1 / 4 }}
                onClick={() => setPlantPriority(1)}
                aria-label="Medium"
              >
                😋
              </Button>
            </Tooltip>
            <Tooltip title="Low Priority">
              <Button
                color="success"
                variant={plantPriority === 2 ? "contained" : "outlined"}
                sx={{ width: 1 / 4 }}
                onClick={() => setPlantPriority(2)}
                aria-label="Low"
              >
                🤠
              </Button>
            </Tooltip>
          </InputGroup>

          <FormGroup>
            <Form.Label>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Picture (Optional)
              </Typography>
            </Form.Label>
            <InputGroup>
              <Button
                variant={!imgToggle ? "contained" : "outlined"}
                sx={{ width: 1 / 2 }}
                color="success"
                onClick={() => setImgToggle((p) => false)}
              >
                Image Url
              </Button>
              <Button
                disabled
                variant={imgToggle ? "contained" : "outlined"}
                sx={{ width: 1 / 2 }}
                color="success"
                onClick={() => setImgToggle((p) => true)}
              >
                Upload File
              </Button>
            </InputGroup>
          </FormGroup>
          <br />
          <Form.Group>
            {!imgToggle ? (
              <Tooltip title="Upload Image Url">
                <Form.Control
                  type="text"
                  value={plantImage}
                  onChange={(e) => setPlantImage(e.target.value)}
                />
              </Tooltip>
            ) : (
              <Form.Control type="file" disabled />
            )}
          </Form.Group>
          <br />
          <Button
            sx={{ width: 1 }}
            color="success"
            variant="outlined"
            type="submit"
          >
            Submit
          </Button>
        </Form>
      </Box>
    </Modal>
  );
}
