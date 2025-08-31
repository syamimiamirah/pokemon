import { defineStore } from "pinia"

export const usePokemonStore = defineStore("pokemon", {
  state: () => ({
    pokemons: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchPokemons() {
      this.loading = true
      this.error = null
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100")
        const data = await res.json()

        // fetch details for each Pokémon
        const details = await Promise.all(
          data.results.map(async (p, index) => {
            const res = await fetch(p.url)
            return await res.json()
          })
        )

        this.pokemons = details
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    updatePokemon(updatedPokemon) {
      const index = this.pokemons.findIndex(p => p.id === updatedPokemon.id)
      if (index !== -1) {
        this.pokemons[index] = { ...this.pokemons[index], ...updatedPokemon }
      }
    }
  },
})
