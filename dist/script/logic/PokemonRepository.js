/** Proxima sprite
 *  - Persistencia dos dados usando IndexDB
 *  - Evitar expanções infinitas
 *  - Injeção de API
 */
import Api from "../Api.js";
import { RepositoryHelper } from "../appUtils.js";
export class PokemonRepository {
    constructor() {
        this._pokemonIdCache = new Map();
        this._pokemonNameCache = new Map();
    }
    async getPokemon(searchValue) {
        const identifier = searchValue.trim();
        const cached = this.getFromCache(identifier);
        if (cached)
            return cached;
        try {
            return await this.fetchFromAPI(identifier);
        }
        catch (error) {
            throw new Error(`Erro ao buscar Pokémon com identificador "${searchValue}"`);
        }
    }
    getFromCache(identifier) {
        const isPositiveInteger = RepositoryHelper.isPositiveInteger(identifier);
        if (isPositiveInteger) {
            const id = parseInt(identifier);
            if (this.pokemonIdCache.has(id)) {
                return this.pokemonIdCache.get(id);
            }
        }
        else {
            const name = identifier.toLowerCase();
            if (this.pokemonNameCache.has(name)) {
                return this.pokemonNameCache.get(name);
            }
        }
    }
    async fetchFromAPI(identifier) {
        const pokemon = await Api.getPokemon(identifier);
        if (!pokemon)
            return undefined;
        this.saveOnCache(pokemon);
        return pokemon;
    }
    saveOnCache(pokemon) {
        this._pokemonIdCache.set(pokemon.id, pokemon);
        this._pokemonNameCache.set(pokemon.name.toLowerCase(), pokemon);
    }
    get pokemonIdCache() {
        return this._pokemonIdCache;
    }
    get pokemonNameCache() {
        return this._pokemonNameCache;
    }
}
