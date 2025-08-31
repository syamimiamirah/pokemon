import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import PokemonDetail from '../views/PokemonDetail.vue'

const routes = [
  { path: '/pokemon', name: 'Home', component: Home },
  { path: '/pokemon/:id', name: 'PokemonDetail', component: PokemonDetail, props: true },
]

const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === 'production' ? '/pokemon/' : '/'),
  routes,
})

export default router
