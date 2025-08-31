import { defineStore } from 'pinia'

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemons: [],
    loading: false,
    error: null
  }),

  getters: {
    getPokemonById: (state) => {
      return (id) => state.pokemons.find(pokemon => pokemon.id === id)
    },
    
    getTotalCount: (state) => state.pokemons.length,
    
    getPokemonsByType: (state) => {
      return (type) => state.pokemons.filter(pokemon => 
        pokemon.types.some(t => t.type.name === type)
      )
    }
  },

  actions: {
    async fetchPokemons() {
      this.loading = true
      this.error = null
      
      try {
        // Fetch the first 151 Pokemon (original generation)
        const promises = []
        for (let i = 1; i <= 151; i++) {
          promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${i}`))
        }
        
        const responses = await Promise.all(promises)
        const pokemonData = await Promise.all(
          responses.map(response => response.json())
        )
        
        this.pokemons = pokemonData
      } catch (err) {
        this.error = 'Failed to fetch Pokemon data'
        console.error('Error fetching Pokemon:', err)
      } finally {
        this.loading = false
      }
    },

    // Add a single Pokemon to the store
    addPokemon(pokemonData) {
      const existingIndex = this.pokemons.findIndex(p => p.id === pokemonData.id)
      if (existingIndex === -1) {
        this.pokemons.push(pokemonData)
      } else {
        // Update existing Pokemon
        this.pokemons[existingIndex] = pokemonData
      }
    },

    // Update Pokemon info (for editing)
    updatePokemon(id, updatedData) {
      const pokemonIndex = this.pokemons.findIndex(p => p.id === id)
      
      if (pokemonIndex !== -1) {
        // Create a copy of the current Pokemon
        const updatedPokemon = { ...this.pokemons[pokemonIndex] }
        
        // Update the editable fields
        updatedPokemon.name = updatedData.name || updatedPokemon.name
        updatedPokemon.height = updatedData.height || updatedPokemon.height
        updatedPokemon.weight = updatedData.weight || updatedPokemon.weight
        updatedPokemon.base_experience = updatedData.base_experience || updatedPokemon.base_experience
        
        // Add a custom flag to indicate this Pokemon has been edited
        updatedPokemon.isEdited = true
        updatedPokemon.lastModified = new Date().toISOString()
        
        // Replace the Pokemon in the array
        this.pokemons[pokemonIndex] = updatedPokemon
        
        console.log(`Updated Pokemon ${updatedPokemon.name}:`, updatedData)
      }
    },

    // Reset all edits (optional utility function)
    resetPokemonEdits() {
      this.pokemons.forEach(pokemon => {
        delete pokemon.isEdited
        delete pokemon.lastModified
      })
    },

    // Get all edited Pokemon (optional utility function)
    getEditedPokemons() {
      return this.pokemons.filter(pokemon => pokemon.isEdited)
    }
  }
})