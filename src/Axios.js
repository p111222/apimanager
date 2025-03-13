// import axios from "axios";

// export const makeRequest = axios.create({
//     baseURL: "http://localhost:8082/api/",
//     withCredentials: true,
// });



import axios from 'axios';
const BASE_URL = 'http://localhost:8080/api';
// const BASE_URL = 'http://api.kriate.co.in:8344/api';

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    // headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});