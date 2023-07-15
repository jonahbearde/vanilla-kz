import axios from 'axios'
import { vnlApiBaseUrl } from './constants'


const axiosClient = axios.create({
	baseURL: vnlApiBaseUrl
})

axiosClient.interceptors.request.use(config => {
	config.headers.Authorization = `Bearer `
	return config
})

export default axiosClient


