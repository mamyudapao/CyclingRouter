import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api/",
  timeout: 1000,
  withCredentials: true,
});

if (process.browser && localStorage.getItem("persist:root") !== null) {
  axiosInstance.defaults.headers.common["Authorization"] =
    "Bearer " +
    ` ${JSON.parse(localStorage.getItem("persist:root")!).accessToken}`;
  console.log(localStorage.getItem("persist:root"));
}

export default axiosInstance;
