import axios from 'axios'

const API_BASE_URL = 'https://vnl-stats-backend.onrender.com/api/v1'
// const API_BASE_URL = ' http://localhost:1337/api/v1'

const axiosClient = axios.create({
	baseURL: API_BASE_URL
})

axiosClient.interceptors.request.use(config => {
	config.headers.Authorization = `Bearer `
	return config
})

export default axiosClient


