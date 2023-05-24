import {defineStore} from 'pinia'
import axiosClient from '../axios'

const useNewsStore = defineStore('news', {
	state: () => {
		return {
			newsList: []
		}
	},
	getters: {
		tags(){
			let list = Array.from(new Set(this.newsList.map(news => news.tag)))

			list.push('all')
			
			return list
		}
	},
	actions: {
		async fetchNews() {
			try {
				const result = await axiosClient.get('/articles')
				this.newsList = result.data

			} catch (error) {
				return error
			}
		}
	}
})

export default useNewsStore