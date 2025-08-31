import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/HomeView.vue"
import PokemonDetail from "../views/PokemonDetail.vue"

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/pokemon/:id", name: "PokemonDetail", component: PokemonDetail, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
