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
        catch (_a) {
            throw new Error(`Não foi possível recuperar o pokemon ${pokemonName} da API`);
        }
    }
    static async getPokemon(userPokemonName) {
        const pokemonNameApi = this.handleDoubleName(userPokemonName);
        const pokemonData = await this.fetchApi(pokemonNameApi);
        return pokemonData;
    }
    static handleDoubleName(name) {
        const pokemonNameApi = name.toLowerCase().replace(/\s+/g, '-');
        return pokemonNameApi;
    }
}
Api.url = 'https://pokeapi.co/api/v2/pokemon/';
export default Api;
