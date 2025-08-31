<script setup>
import { onMounted, ref, computed } from "vue"
import { usePokemonStore } from "../stores/pokemon.js"

const store = usePokemonStore()
const search = ref("")

const filteredPokemons = computed(() => {
  if (!search.value) return store.pokemons
  return store.pokemons.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

onMounted(() => {
  store.fetchPokemons()
})
</script>

<template>
  <div class="fullscreen-container">
    <div class="content-wrapper">
      <h1 class="mb-4 text-center">Pokédex</h1>

      <div class="mb-4">
        <div class="row justify-content-center">
          <div class="col-12 col-md-6">
            <input
              type="text"
              v-model="search"
              class="form-control form-control-lg"
              placeholder="Search Pokémon by name..."
            />
          </div>
        </div>
      </div>

      <!-- Results Count -->
      <div v-if="!store.loading && !store.error" class="mb-3 text-center text-muted">
        Showing {{ filteredPokemons.length }} of {{ store.pokemons.length }} Pokémon
        <span v-if="search">(filtered by "{{ search }}")</span>
      </div>

      <!-- Loading State -->
      <div v-if="store.loading" class="alert alert-info">Loading Pokémon...</div>

      <!-- Error State -->
      <div v-if="store.error" class="alert alert-danger">{{ store.error }}</div>
      
      <!-- No Results -->
      <div v-if="!store.loading && !store.error && filteredPokemons.length === 0 && search" 
           class="alert alert-warning text-center">
        No Pokémon found matching "{{ search }}". Try a different search term.
      </div>

      <!-- Grid of Pokémon -->
      <div class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4 justify-content-center">
        <div v-for="p in filteredPokemons" :key="p.id" class="col">
          <RouterLink :to="`/pokemon/${p.id}`" class="text-decoration-none text-dark">
          <div class="card text-center shadow-sm h-100">
            <img
              :src="p.sprites.front_default"
              class="card-img-top p-3"
              alt="pokemon"
            />
            <div class="card-body">
              <h6 class="card-title text-capitalize">{{ p.name }}</h6>
              <p class="card-text small text-muted">
                #{{ p.id }} | {{ p.types.map(t => t.type.name).join(", ") }}
              </p>
              <p class="card-text small">
                Height: {{ p.height }} | Weight: {{ p.weight }}
              </p>
            </div>
          </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fullscreen-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  justify-content: center;
  align-items: flex-start;
  padding: 2rem 1rem;
  box-sizing: border-box;
  overflow-x: hidden;
  position: fixed;
  top: 0;
  left: 0;
}

.content-wrapper {
  width: 100%;
  max-width: 1400px; /* Adjust this to control maximum content width */
  margin: 0 auto;
  min-height: 100%;
}

/* Ensure cards don't get too wide on large screens */
.card {
  max-width: 200px;
  margin: 0 auto;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.card-img-top {
  transition: transform 0.3s ease;
}

.card:hover .card-img-top {
  transform: scale(1.15); /* zoom effect */
}

a {
  text-decoration: none !important;
  color: inherit;
}

a:hover {
  text-decoration: none !important;
  color: inherit; /* keep the same color on hover */
}

/* Remove any potential margin/padding from body */
:global(body) {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
</style>