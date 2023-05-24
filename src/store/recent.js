import { defineStore } from 'pinia'
import axiosClient from '../axios'
import { globalApiBaseUrl } from '../constants'

const useRecentStore = defineStore('recent', {
	state: () => {
		return {
			tpWrs: [],
			proWrs: [],
			top50: [],
		}
	},

	actions: {
		async fetchTop(){

			try {
				let top = await Promise.all([
					axiosClient.get(`${globalApiBaseUrl}/records/top/recent?modes_list_string=kz_vanilla&tickrate=128&stage=0&has_teleports=true&place_top_at_least=1&limit=30`),
					axiosClient.get(`${globalApiBaseUrl}/records/top/recent?modes_list_string=kz_vanilla&tickrate=128&stage=0&has_teleports=false&place_top_at_least=1&limit=30`),
					axiosClient.get(`${globalApiBaseUrl}/records/top/recent?modes_list_string=kz_vanilla&tickrate=128&stage=0&place_top_at_least=50&limit=30`)
				])

				this.tpWrs = top[0].data
				this.proWrs = top[1].data
				this.top50 = top[2].data

			} catch (error) {
				return error
			} 
		}
	}
})

export default useRecentStore