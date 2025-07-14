/** Proxima sprite
 *  - Persistencia dos dados usando IndexDB
 *  - Evitar expanções infinitas
 *  - Injeção de API
 */

import Api from "../Api.js";
import { RepositoryHelper } from "../appUtils.js";
import { Pokemon } from "../Pokemon.js";

export class PokemonRepository{
    private _pokemonIdCache: Map<number, Pokemon> = new Map()
    private _pokemonNameCache: Map<string, Pokemon> = new Map()
  

    async getPokemon (searchValue: string){
        const identifier = searchValue.trim()
        const cached = this.getFromCache(identifier)
        if(cached) return cached

        try{
          return await this.fetchFromAPI(identifier)
        }catch(error){
          throw new Error(`Erro ao buscar Pokémon com identificador "${searchValue}"`)
        }
    }
    
    private getFromCache(identifier: string): Pokemon | undefined {
      const isPositiveInteger = RepositoryHelper.isPositiveInteger(identifier)
      if(isPositiveInteger){
        const id = parseInt(identifier)
        if(this.pokemonIdCache.has(id)){
          return this.pokemonIdCache.get(id)
        }
      }else {
        const name = identifier.toLowerCase()
        if(this.pokemonNameCache.has(name)){
          return this.pokemonNameCache.get(name)
        }
      }
    }

    private async fetchFromAPI(identifier: string){
      const pokemon = await Api.getPokemon(identifier)
      if(!pokemon) return undefined
      
      this.saveOnCache(pokemon)
      return pokemon
    }

    private saveOnCache(pokemon:Pokemon){
      this._pokemonIdCache.set(pokemon.id, pokemon);
      this._pokemonNameCache.set(pokemon.name.toLowerCase(), pokemon);
    }

    get pokemonIdCache():Map<number, Pokemon>{
        return this._pokemonIdCache
    }
    get pokemonNameCache(): Map<string, Pokemon>{
        return this._pokemonNameCache
    }


}