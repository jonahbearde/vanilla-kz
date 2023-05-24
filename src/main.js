import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'


const pinia = createPinia()

// persist user data and steamid
// watch(pinia.state, (state) => {
// 	if (state.user) {
// 		console.log('new user??');
// 		localStorage.setItem('user', JSON.stringify(state.user))
// 	}

// 	if(state.steamid){
// 		localStorage.setItem('steamid', state.steamid)
// 	}
// })

const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
