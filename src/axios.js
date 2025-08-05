import axios from "axios"
import { vnlApiBaseUrl } from "./constants"

const axiosClient = axios.create({
  baseURL: vnlApiBaseUrl
})

axiosClient.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"))
  config.headers.Authorization = `Bearer ${user.token}`
  return config
})

export default axiosClient
