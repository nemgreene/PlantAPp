import { useState } from "react";
import OverviewModal from "../modals/OverviewModule";

import Button from "@mui/material/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function NavBar({ client }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>Plant App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Nav className="me-auto">
          <OverviewModal
            handleClose={handleClose}
            open={open}
            client={client}
          />
          <Button
            sx={{ mt: 1, mb: 1 }}
            color="success"
            variant="contained"
            onClick={() => handleOpen()}
          >
            Overview
          </Button>
        </Nav>
        <Nav>
          <Button
            sx={{ mt: 1, mb: 1 }}
            color="warning"
            variant="contained"
            onClick={() => client.logout()}
          >
            Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;
