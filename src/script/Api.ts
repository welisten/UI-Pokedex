import { Pokemon } from "./Pokemon"

export default class Api {
    private static url: string = 'https://pokeapi.co/api/v2/pokemon/'

    private static async fetchApi(pokemonName:string): Promise<Pokemon>{
        try{
            const response = await fetch(this.url + pokemonName)
            if(response.ok){
                return response.json() as Promise<Pokemon>
            }  else{
                throw new Error(`API respondeu com status ${response.status}`)
            }
        } catch {
            throw new Error(`Não foi possível recuperar o pokemon ${pokemonName} da API`)
        }
    }

    static async getPokemon(userPokemonName: string){
        const pokemonNameApi = this.handleDoubleName(userPokemonName)
        const pokemonData = await this.fetchApi(pokemonNameApi)
        return pokemonData
    }
    
    private static handleDoubleName(name: string){
        const pokemonNameApi = name.trim().toLowerCase().replace(/\s+/g, '-')
        return pokemonNameApi
    }
}