class Api {
    static async fetchApi(pokemonName) {
        try {
            const response = await fetch(this.url + pokemonName);
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error(`API respondeu com status ${response.status}`);
            }
        }
        catch (erro) {
            throw new Error(`Não foi possível recuperar o pokemon ${pokemonName} da API:<br>${erro.message}`);
        }
    }
    static async getPokemon(userPokemonName) {
        const apiPokemonName = this.handleDoubleName(userPokemonName);
        const pokemonData = await this.fetchApi(apiPokemonName);
        return pokemonData;
    }
    static handleDoubleName(name) {
        const apiPokemonName = name.toLowerCase().replace(/\s+/g, '-');
        return apiPokemonName;
    }
}
Api.url = 'https://pokeapi.co/api/v2/pokemon/';
export default Api;
