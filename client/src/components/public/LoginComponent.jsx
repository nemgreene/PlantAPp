import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class LoginComponent extends Component {
  constructor(props) {
    super(props);

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      email: "root@root",
      password: "root",
      flagged: false,
      cookie: document.cookie,
    };
  }

  onChangeEmail(e) {
    this.setState({ email: e.target.value });
  }
  onChangePassword(e) {
    this.setState({ password: e.target.value });
  }

  async onSubmit() {
    this.setState((p) => ({ ...p, flagged: false }));

    const res = await this.props.client.login({
      email: this.state.email,
      password: this.state.password,
    });
    if (!res.data) {
      this.setState((p) => ({ ...p, flagged: true }));
      return;
    }
    const { accessToken, refreshToken, _id } = res.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user_id", _id);
    this.props.setCredentials({ accessToken, refreshToken, _id });
    this.props.client.redirect("./dash");
  }

  render() {
    return (
      <div className="row mt-5">
        <div className="col-md-6 m-auto">
          <div className="card card-body">
            <h1 className="text-center mb-3">
              <i className="fas fa-sign-in-alt"></i> Login
            </h1>
            <div>
              {this.state.flagged ? (
                <div
                  className="alert alert-warning alert fade show"
                  role="alert"
                >
                  <strong>Sorry!</strong> Please try again
                </div>
              ) : null}
            </div>
            <form>
              <div className="form-group">
                <label className="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter Email"
                  value={this.state.email}
                  onChange={this.onChangeEmail}
                />
              </div>
              <div className="form-group">
                <label className="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter Password"
                  value={this.state.password}
                  onChange={this.onChangePassword}
                />
              </div>
            </form>
            <button
              onClick={this.onSubmit}
              className="btn btn-primary btn-block"
            >
              Login
            </button>
            <br />
            <p className="lead mt-4">
              No Account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
