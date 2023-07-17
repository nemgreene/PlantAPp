// import React, { Component } from "react";
// import { Link } from "react-router-dom";

// export default class LoginComponent extends Component {
//   constructor(props) {
//     super(props);

//     this.onChangeEmail = this.onChangeEmail.bind(this);
//     this.onChangePassword = this.onChangePassword.bind(this);
//     this.onSubmit = this.onSubmit.bind(this);

//     this.state = {
//       email: "root@root",
//       password: "root",
//       flagged: false,
//       cookie: document.cookie,
//     };
//   }

//   onChangeEmail(e) {
//     this.setState({ email: e.target.value });
//   }
//   onChangePassword(e) {
//     this.setState({ password: e.target.value });
//   }

//   async onSubmit() {
//     this.setState((p) => ({ ...p, flagged: false }));

//     const res = await this.props.client.login({
//       email: this.state.email,
//       password: this.state.password,
//     });
//     if (!res.data) {
//       this.setState((p) => ({ ...p, flagged: true }));
//       return;
//     }
//     const { accessToken, refreshToken, _id } = res.data;
//     localStorage.setItem("accessToken", accessToken);
//     localStorage.setItem("refreshToken", refreshToken);
//     localStorage.setItem("user_id", _id);
//     this.props.setCredentials({ accessToken, refreshToken, _id });
//     this.props.client.redirect("./dash");
//   }

//   render() {
//     return (
//       <div className="row mt-5">
//         <div className="col-md-6 m-auto">
//           <div className="card card-body">
//             <h1 className="text-center mb-3">
//               <i className="fas fa-sign-in-alt"></i> Login
//             </h1>
//             <div>
//               {this.state.flagged ? (
//                 <div
//                   className="alert alert-warning alert fade show"
//                   role="alert"
//                 >
//                   <strong>Sorry!</strong> Please try again
//                 </div>
//               ) : null}
//             </div>
//             <form>
//               <div className="form-group">
//                 <label className="email">Email</label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   className="form-control"
//                   placeholder="Enter Email"
//                   value={this.state.email}
//                   onChange={this.onChangeEmail}
//                 />
//               </div>
//               <div className="form-group">
//                 <label className="password">Password</label>
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   className="form-control"
//                   placeholder="Enter Password"
//                   value={this.state.password}
//                   onChange={this.onChangePassword}
//                 />
//               </div>
//             </form>
//             <button
//               onClick={this.onSubmit}
//               className="btn btn-primary btn-block"
//             >
//               Login
//             </button>
//             <br />
//             <p className="lead mt-4">
//               No Account? <Link to="/register">Register</Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

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
    const dict = ["email", "password"];
    const flaggedObj = {};
    dict.forEach((v, i) => {
      if (!formValues[v]) {
        flaggedObj[v] = true;
        flaggedObj.msg = "Please fill out all the forms";
      }
    });
    if (Object.keys(flaggedObj).length === 0) {
      setFlagged({});
      client.login(formValues);
    } else {
      setFlagged(flaggedObj);
    }
  };

  useEffect(() => {
    if (flagged.msg) {
      client.modalHandler(400, flagged.msg);
    }
  }, [flagged, client]);

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
                Login
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
