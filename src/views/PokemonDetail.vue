<script setup>
import { onMounted, ref, computed } from "vue"
import { useRoute, RouterLink } from "vue-router"
import { usePokemonStore } from "../stores/pokemon.js"

const route = useRoute()
const store = usePokemonStore()
const loading = ref(true)
const error = ref(null)
const isEditing = ref(false)

// Edit form data
const editForm = ref({
  name: '',
  height: 0,
  weight: 0,
  base_experience: 0
})

// Get Pokemon from store or fetch if not available
const pokemon = computed(() => {
  // Find Pokemon in store array directly
  return store.pokemons.find(p => p.id === parseInt(route.params.id))
})

// Helper function for stat bar colors
const getStatColor = (value) => {
  if (value >= 100) return 'bg-success'
  if (value >= 70) return 'bg-warning'
  return 'bg-danger'
}

const startEdit = () => {
  if (pokemon.value) {
    editForm.value = {
      name: pokemon.value.name,
      height: pokemon.value.height,
      weight: pokemon.value.weight,
      base_experience: pokemon.value.base_experience || 0
    }
    isEditing.value = true
  }
}

const cancelEdit = () => {
  isEditing.value = false
  editForm.value = {
    name: '',
    height: 0,
    weight: 0,
    base_experience: 0
  }
}

const saveEdit = () => {
  if (pokemon.value) {
    // Find Pokemon in store and update directly
    const pokemonIndex = store.pokemons.findIndex(p => p.id === pokemon.value.id)
    
    if (pokemonIndex !== -1) {
      // Update the Pokemon in the store
      store.pokemons[pokemonIndex] = {
        ...store.pokemons[pokemonIndex],
        name: editForm.value.name,
        height: editForm.value.height,
        weight: editForm.value.weight,
        base_experience: editForm.value.base_experience,
        isEdited: true,
        lastModified: new Date().toISOString()
      }
    }
    
    isEditing.value = false
  }
}

onMounted(async () => {
  try {
    // Check if Pokemon exists in store
    const existingPokemon = store.pokemons.find(p => p.id === parseInt(route.params.id))
    
    if (!existingPokemon) {
      // If not in store, fetch from API and add to store
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${route.params.id}`)
      if (!res.ok) throw new Error("Failed to fetch Pokémon")
      const pokemonData = await res.json()
      
      // Add to store array directly
      store.pokemons.push(pokemonData)
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="pokemon-detail">
    <div class="detail-wrapper">
      <RouterLink to="/" class="btn btn-secondary mb-4">Back to Pokédex</RouterLink>

      <div v-if="loading" class="alert alert-info">Loading details...</div>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <div v-if="pokemon" class="pokemon-layout">
        <!-- Left Side: Image Card -->
        <div class="image-card">
          <div class="card shadow-lg border-0 h-100">
            <div class="card-body d-flex align-items-center justify-content-center">
              <img
                :src="pokemon.sprites.other['official-artwork'].front_default"
                class="img-fluid big-pokemon"
                :alt="pokemon.name"
              />
            </div>
          </div>
        </div>

        <!-- Right Side: Details Card -->
        <div class="details-card">
          <div class="card shadow-lg border-0 h-100">
            <div class="card-body">
              <!-- Edit/View Toggle -->
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h1 v-if="!isEditing" class="text-capitalize mb-0">{{ pokemon.name }}</h1>
                <div v-if="!isEditing" class="btn-group">
                  <button @click="startEdit" class="btn btn-primary">
                    Edit Pokemon
                  </button>
                </div>
              </div>

              <!-- Edit Form -->
              <div v-if="isEditing" class="edit-form mb-4">
                <h2 class="mb-3">Edit {{ pokemon.name }}</h2>
                
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Name</label>
                    <input 
                      v-model="editForm.name" 
                      type="text" 
                      class="form-control"
                      placeholder="Pokemon name"
                    />
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Base Experience</label>
                    <input 
                      v-model.number="editForm.base_experience" 
                      type="number" 
                      class="form-control"
                      placeholder="Base experience"
                    />
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Height (decimeters)</label>
                    <input 
                      v-model.number="editForm.height" 
                      type="number" 
                      class="form-control"
                      placeholder="Height"
                    />
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Weight (hectograms)</label>
                    <input 
                      v-model.number="editForm.weight" 
                      type="number" 
                      class="form-control"
                      placeholder="Weight"
                    />
                  </div>
                </div>
                
                <div class="btn-group">
                  <button @click="saveEdit" class="btn btn-success">
                    Save Changes
                  </button>
                  <button @click="cancelEdit" class="btn btn-outline-secondary">
                    Cancel
                  </button>
                </div>
              </div>

              <!-- View Mode -->
              <div v-if="!isEditing">
                <p class="text-muted fs-5 mb-4">ID: #{{ pokemon.id }}</p>
                
                <div class="row mb-4">
                  <div class="col-md-6">
                    <h5 class="text-primary">Basic Info</h5>
                    <p><strong>Types:</strong> 
                      <span v-for="(type, index) in pokemon.types" :key="type.type.name">
                        <span class="badge bg-secondary me-1">{{ type.type.name }}</span>
                      </span>
                    </p>
                    <p><strong>Height:</strong> {{ pokemon.height / 10 }} m</p>
                    <p><strong>Weight:</strong> {{ pokemon.weight / 10 }} kg</p>
                    <p><strong>Base Experience:</strong> {{ pokemon.base_experience || 'Unknown' }}</p>
                  </div>
                  
                  <div class="col-md-6">
                    <h5 class="text-primary">Abilities</h5>
                    <div class="mb-3">
                      <span v-for="ability in pokemon.abilities" :key="ability.ability.name" 
                            class="badge bg-info me-2 mb-1">
                        {{ ability.ability.name }}
                        <small v-if="ability.is_hidden" class="ms-1">(Hidden)</small>
                      </span>
                    </div>
                  </div>
                </div>

                <h5 class="text-primary mb-3">Base Stats</h5>
                <div class="stats-container">
                  <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="stat-row mb-3">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <span class="stat-name text-capitalize">{{ stat.stat.name.replace('-', ' ') }}</span>
                      <span class="badge bg-dark">{{ stat.base_stat }}</span>
                    </div>
                    <div class="progress" style="height: 8px;">
                      <div 
                        class="progress-bar"
                        :class="getStatColor(stat.base_stat)"
                        :style="{ width: (stat.base_stat / 255 * 100) + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pokemon-detail {
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
  box-sizing: border-box;
  margin: 0;
  position: fixed;
  top: 0;
  left: 0;
}

.detail-wrapper {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  height: 100vh;
  overflow-y: auto;
  padding-top: 1rem;
}

.pokemon-layout {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
  min-height: 75vh;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .pokemon-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .detail-wrapper {
    padding: 0 1rem;
  }
}

.image-card,
.details-card {
  height: 100%;
}

.card {
  border-radius: 20px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.big-pokemon {
  max-height: 400px;
  max-width: 100%;
  object-fit: contain;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2));
}

.edit-form {
  background: rgba(248, 249, 250, 0.8);
  padding: 1.5rem;
  border-radius: 15px;
  border: 2px dashed #dee2e6;
}

.form-label {
  font-weight: 600;
  color: #495057;
}

.form-control {
  border-radius: 10px;
  border: 1px solid #ced4da;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.btn-group .btn {
  border-radius: 25px;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  margin-right: 0.5rem;
}

.stat-row {
  margin-bottom: 1rem;
}

.stat-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.progress {
  border-radius: 10px;
  background-color: #e9ecef;
}

.progress-bar {
  border-radius: 10px;
  transition: width 0.6s ease;
}

.badge {
  font-size: 0.75rem;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 25px;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  color: #333;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}
</style>