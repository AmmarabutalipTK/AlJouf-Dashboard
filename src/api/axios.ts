import axios from "axios";


export const api = axios.create({
  baseURL: "http://localhost:3006",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
// import axios from "axios";



// import axios from "axios";


// export const api = axios.create({
//   baseURL: "https://aljouf.takarubdev.com/api",
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });
// import axios from "axios";

// export const api = axios.create({
//   baseURL: "/api",
// });