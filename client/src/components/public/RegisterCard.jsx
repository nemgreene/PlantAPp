import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

export default function RegisterCard({ client }) {
  const [formValues, setFormValues] = useState({});
  const [flagged, setFlagged] = useState({});

  const handleChange = (e) => {
    setFormValues((p) => ({ ...p, [e.target.name]: e.target.value }));
  };
  const handleFocus = (e) => {
    setFlagged((p) => ({ ...p, [e.target.name]: false }));
  };

  const handleSubmit = () => {
    const dict = ["email", "password", "password2"];
    const flaggedObj = {};
    if (formValues.password !== formValues.password2) {
      flaggedObj.msg = "Passwords do not match";
    }
    dict.forEach((v, i) => {
      if (!formValues[v]) {
        flaggedObj[v] = true;
        flaggedObj.msg = "Please fill out all the forms";
      }
    });
    setFlagged(flaggedObj);
    if (Object.keys(flaggedObj).length === 0) {
      client.register(formValues);
    }
  };

  useEffect(() => {
    if (flagged.msg) {
      client.modalHandler(400, flagged.msg);
    }
  }, [flagged.msg, client]);
  return (
    <Box>
      <Grid
        container
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item lg={4}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography sx={{ mb: 3, mt: 1 }} variant="h4" component="div">
                Register
              </Typography>
              <TextField
                onFocus={handleFocus}
                onChange={handleChange}
                sx={{ width: 1, mb: 1 }}
                required
                id="outlined-basic"
                label="Email"
                variant="outlined"
                name="email"
                multiline
                error={flagged.email}
                value={formValues.email || ""}
              />
              <TextField
                onFocus={handleFocus}
                onChange={handleChange}
                sx={{ width: 1, mb: 1 }}
                required
                label="Password"
                name="password"
                error={flagged.password}
                type="password"
              />
              <TextField
                onFocus={handleFocus}
                onChange={handleChange}
                sx={{ width: 1, mb: 1 }}
                required
                id="outlined-password-input"
                label="Confirm Password"
                name="password2"
                type="password"
                error={flagged.password2}
              />
              <CardActions sx={{ pl: 0, pr: 0 }}>
                <Button
                  onClick={handleSubmit}
                  sx={{ width: 1, p: 1.5 }}
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
