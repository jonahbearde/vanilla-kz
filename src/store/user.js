import { defineStore } from 'pinia'
import axiosClient from '../axios'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890', 6)


const useUserStore = defineStore('user', {
	state: () => {
		let user = localStorage.getItem('user')

		let steamid = localStorage.getItem('steamid')

		return {
			user: user ? JSON.parse(user) : null,
			steamid: steamid ?? '',
			loading: false
		}
	},

	actions: {
		async login(username, password) {
			this.loading = true
			try {
				const result = await axiosClient.post('/users/login', {
					name: username,
					password: password
				})

				this.user = result.data

			} catch (error) {
				return error
			} finally {
				this.loading = false
			}
		},
		async signup(username, password) {
			this.loading = true
			try {
				const result = await axiosClient.post('/users/signup', {
					id: parseInt(nanoid()),
					name: username,
					password
				})

				this.user = result.data

			} catch (error) {
				console.log(error)
			} finally {
				this.loading = false
			}
		},
		logout() {
			try {
				this.user = null

			} catch (error) {
				return error
			}
		}
	}
})

export default useUserStore