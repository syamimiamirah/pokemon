import { createRouter, createWebHashHistory } from "vue-router"
import Home from "../views/HomeView.vue"
import PokemonDetail from "../views/PokemonDetail.vue"

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/:id", name: "PokemonDetail", component: PokemonDetail, props: true }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
