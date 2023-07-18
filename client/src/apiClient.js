import axios from "axios";
import moment from "moment";
// const baseUrl = "http://localhost:5000";
const baseUrl = "";

export default class ApiClient {
  constructor(
    credentialsProvider,
    logoutHandler,
    modalHandler,
    redirectHandler,
    credentialsManager
  ) {
    this.credentialsProvider = credentialsProvider;
    this.logoutHandler = logoutHandler;
    this.modalHandler = modalHandler;
    this.redirectHandler = redirectHandler;
    this.credentialsManager = credentialsManager;
  }
  // Base api call with
  // Handles errors
  // Displays success message in modal
  // Displays error message in modal if err is present
  // Callback if included

  async apiCall(
    method = "get",
    url = "/",
    payload = {},
    successMessage = undefined,
    callback = undefined
  ) {
    try {
      console.log("Base Url:", baseUrl);
      // try to make the request
      const res = await axios({
        method,
        url: `${baseUrl}${url}`,
        ...payload,
      });
      // trigger modal if success message and successful
      if (successMessage) {
        this.modalHandler(res.status, successMessage);
      }
      if (callback) {
        // trigger callback if callback and successful
        // also exposes the response data to the callback if needed
        try {
          callback(res);
        } catch (err) {
          this.modalHandler(
            err?.response?.staus || "404",
            err?.response?.data?.error || "Callback Error"
          );
        }
      }
      return res;
    } catch (err) {
      // if 498, access token has expired, throw error to be handled in authenticatedApi call
      if (err?.response?.status === 498) {
        throw new Error("498");
      }
      // else alery user to error
      this.modalHandler(
        err.response?.staus || "404",
        err.response?.data.error || "Sorry something went wrong"
      );
      this.logoutHandler();
      return {};
    }
  }

  // Added to base api call, this method add credentials in the headers of this request
  // and includes logic for token expiry error
  async authenticatedCall(method, url, payload, successMessage, callback) {
    // verify credentials exist
    const { accessToken, refreshToken, _id } = this.credentialsProvider();
    if (!accessToken || !refreshToken || !_id) {
      this.redirect("/login");
      return { message: "Missing Credentials" };
    }
    try {
      // send along the base request with escalated credentials
      const res = await this.apiCall(
        method,
        `/user${url}`,
        {
          headers: {
            accessToken,
            refreshToken,
            userId: _id,
          },
          ...payload,
        },
        successMessage,
        callback
      );
      return { ...res };
    } catch (error) {
      if (error.message === 498) {
        // token expired
        const { accessToken, refreshToken, _id } = this.credentialsProvider();
        // get updated access token based off refresh token
        const updatedCredentials = await this.apiCall(
          "get",
          "/token",
          {
            data: {
              accessToken,
              refreshToken,
            },
            headers: {
              accessToken,
              refreshToken,
            },
          },
          successMessage,
          callback
        );
        // extract payload
        const [updateA, updateR] = [
          updatedCredentials?.data?.accesstoken,
          updatedCredentials?.data?.refreshtoken,
        ];
        // once credentials have been uplaoded, resend request with updated credentials
        const res = await this.authenticatedCall(method, url, {
          ...payload,
          headers: {
            accessToken: updateA,
            refreshToken: updateR,
            userId: _id,
          },
          successMessage,
          callback,
        });
        return res;
      }
      return {};
    }
  }

  redirect(url) {
    // inherited from react-router-dom, exposes a function to redirect programmatically from client
    this.redirectHandler(url);
  }
  // methods exposed to the app to handle the various CRUD functionalities
  async logout() {
    const { accessToken, refreshToken } = this.credentialsProvider();
    this.apiCall(
      "delete",
      `/token`,
      { headers: { accessToken, refreshToken } },
      "Logged out!",
      () => {
        this.logoutHandler();
        this.redirect("/");
      }
    );
  }

  async login({ email, password }) {
    return await this.apiCall(
      "post",
      `/login`,
      {
        data: {
          email,
          password,
        },
      },
      "Logged In!",
      undefined
    );
  }

  async register(newUser) {
    return await this.apiCall(
      "post",
      `/register`,
      { data: { ...newUser } },
      undefined,
      async (res) => {
        // after registry, extract the data from the request
        const { email, password } = res.data;
        // log in with the credentials
        const userCredentials = await this.apiCall("post", `/login`, {
          email,
          password,
        });
        // extract token credentials
        const { accessToken, refreshToken, _id } = userCredentials.data;
        // elevate to
        this.credentialsManager(accessToken, refreshToken, _id);
        this.modalHandler(200, `Welcome ${email}`);
        this.redirect("/");
      }
    );
  }

  async getAllPlants() {
    const { accessToken, refreshToken, _id } = this.credentialsProvider();
    if (accessToken && refreshToken && _id) {
      return await this.authenticatedCall("get", "/plants");
    } else {
      return {};
    }
  }
  async getOverview() {
    return await this.authenticatedCall("get", "/overview");
  }

  async addPlant(plant) {
    return await this.authenticatedCall(
      "post",
      "/plants/add",
      { data: plant },
      "Plant Added!",
      () => this.fetchPlants()
    );
  }
  async addAlertPlant(plant) {
    plant.dateWatered = new Date(
      moment(plant.dateWatered).subtract(10, "days").calendar()
    );
    return await this.authenticatedCall(
      "post",
      "/plants/add",
      { data: plant },
      "Plant Added! 👌",
      () => this.fetchPlants()
    );
  }
  async waterPlant(plant) {
    plant.dateWatered = new Date();

    return await this.authenticatedCall(
      "post",
      "/plants/water",
      { data: plant },
      "Plant Watered! 💯",
      () => this.fetchPlants()
    );
  }
  async deletePlant(plant) {
    return await this.authenticatedCall(
      "delete",
      "/plants/delete",
      { data: plant },
      "Plant Deleted 💥",
      () => this.fetchPlants()
    );
  }
  async editPlant(plant) {
    return await this.authenticatedCall(
      "post",
      "/plants/update",
      { data: plant },
      "Plant Updated 🧨",
      () => this.fetchPlants()
    );
  }
}
