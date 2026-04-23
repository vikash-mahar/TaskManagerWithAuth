import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:5001/api"
  baseURL:"https://taskmanagerwithauths.onrender.com/api"
});

export default API;