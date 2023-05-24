import { defineStore } from 'pinia'
import axiosClient from '../axios'

const useMapStore = defineStore('maps', {
	state: () => {
		return {
			maps: [],
			tpDistribution: [],
			proDistribution: [],
			wrs: [],
			uncompleted: []
		}
	},
	getters: {
		mapSet() {
			return new Set(this.maps.map(map => map.id))
		},
		mapMap() {
			return new Map(this.maps.map(map => [map.id, map]))
		},
		tpTierMap() {
			return new Map(this.maps.map(map => [map.id, map.tpTier]))
		},
		proTierMap() {
			return new Map(this.maps.map(map => [map.id, map.proTier]))
		},
		tpMapsCount() {
			return this.tpDistribution.length > 0 ? this.tpDistribution.reduce(((sum, e) => sum + e)) : 0
		},
		proMapsCount() {
			return this.proDistribution.length > 0 ? this.proDistribution.reduce(((sum, e) => sum + e)) : 0
		},
		feasible() {
			return this.uncompleted.filter(map => map.type === 2)
		},
		impossible() {
			return this.uncompleted.filter(map => map.type === 0 || map.type === 1)
		}
	},
	actions: {
		async fetchMaps() {
			try {
				const result = await axiosClient.get('/maps')
				this.maps = result.data
			} catch (error) {
				return error
			}
		},
		async fetchUncompleted() {
			try {
				const result = await axiosClient.get('/uncompleted')

				this.uncompleted = result.data
			} catch (error) {
				return error
			}
		},
		async getDistribution() {
			try {
				const result = await axiosClient.get(`/maps/distribution`)

				this.tpDistribution = result.data.tp
				this.proDistribution = result.data.pro
			} catch (error) {
				return error
			}
		},
		async fetchWrs() {
			try {
				const result = await axiosClient.get('/wrs')

				this.wrs = result.data

				const tpWrMap = new Map(this.wrs.filter(wr => wr.has_teleports).map(wr => [wr.map_id, wr.time]))
				const proWrMap = new Map(this.wrs.filter(wr => !wr.has_teleports).map(wr => [wr.map_id, wr.time]))

				if (!this.maps) await this.fetchMaps()

				// add wrs to each map
				for (let map of this.maps) {
					map.tpWr = tpWrMap.get(map.id) ?? 999999.0
					map.proWr = proWrMap.get(map.id) ?? 999999.0

				}


			} catch (error) {
				return error
			}
		}
	}
})

export default useMapStore