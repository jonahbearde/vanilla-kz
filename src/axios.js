import axios from 'axios'
import { vnlApiBaseUrl } from './constants'
import useUserStore from './store/user'

const userStore = useUserStore()

const axiosClient = axios.create({
	baseURL: vnlApiBaseUrl
})

axiosClient.interceptors.request.use(config => {
	config.headers.Authorization = `Bearer ${userStore.user.token}`
	return config
})

export default axiosClient


