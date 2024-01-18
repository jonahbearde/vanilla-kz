import { createRouter, createWebHashHistory } from 'vue-router'
import StatsView from '../views/StatsView.vue'
import LookUp from '../views/LookUp.vue'
import MapView from '../views/MapView.vue'
import MapPoolView from '../views/MapPoolView.vue'
import Possibles from '../components/mappool/Possibles.vue'
import Unfeasibles from '../components/mappool/Unfeasibles.vue'
import RecentView from '../views/RecentView.vue'
import LeaderboardsView from '../views/LeaderboardsView.vue'
import ResourcesView from '../views/ResourcesView.vue'
import About from '../views/About.vue'
import Login from '../components/Login.vue'
import SignUp from '../components/SignUp.vue'
import AdminView from '../views/AdminView.vue'
import useUserStore from '../store/user'
import SteamID from 'steamid'
import { storeToRefs } from 'pinia'



const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			redirect: '/recent'
		},
		{
			path: '/lookup',
			name: 'lookup',
			component: LookUp
		},
		{
			path: '/stats/:steamid?',
			name: 'stats',
			component: StatsView,
			meta: {
				requireId: true
			}
		},
		{
			path: '/resources',
			name: 'resources',
			component: ResourcesView
		},
		{
			path: '/map/:mapname',
			name: 'map',
			component: MapView
		},
		{
			path: '/maps',
			redirect: '/maps/possible'
		},
		{	
			path: '/maps',
			name: 'maps',
			component: MapPoolView,
			children: [
				{
					name: 'possible',
					path: 'possible',
					component: Possibles
				},
				{
					name: 'unfeasible',
					path: 'unfeasible',
					component: Unfeasibles
				}
			]
		},
		{
			path: '/recent',
			name: 'recent',
			component: RecentView
		},
		{
			path: '/leaderboards',
			name: 'leaderboards',
			component: LeaderboardsView
		},
		{
			path: '/about',
			name: 'about',
			component: About
		},
		{
			path: '/login',
			name: 'login',
			component: Login
		},
		{
			path: '/signup',
			name: 'signup',
			component: SignUp
		},
		{
			path: '/admin',
			name: 'admin',
			component: AdminView,
			meta: { requiresAuth: true }
		},
	]
})

router.beforeEach(async (to, from, next) => {
	const store = useUserStore()

	const { user, steamid } = storeToRefs(store)

	let hasAuth = user.value && (user.value.role === 'Admin' || user.value.role === 'Elon')

	if (to.matched.some(record => record.meta.requiresAuth) && !hasAuth) {
		next('/lookup');
		return;
	}

	if (to.matched.some(record => record.meta.requireId)) {
		// if a steamid exists in param
		if (to.params.steamid) {
			const sid = new SteamID(to.params.steamid);
			if (sid.isValidIndividual()) next()
			else next('/lookup') // if provided with invalid id
			return;
		} else {
			// if param has no id, use id from store instead
			if (steamid.value) {
				next({
					name: 'stats',
					params: {
						steamid: steamid.value
					}
				});
				return;
			}
			next('/lookup');
			return;
		}
	}
	next();
})

export default router
