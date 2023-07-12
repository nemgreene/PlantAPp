import Button from "@mui/material/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function NavBar({ client }) {
  return (
    <Navbar className="greenBackground">
      <Container>
        <Navbar.Brand>Plant App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Nav className="me-auto"></Nav>
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
