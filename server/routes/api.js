import axios from "axios";

const api = axios.create({
    baseURL : `${import.meta.env.VITE_APP_BE_BASEURL}`
})

export default api;