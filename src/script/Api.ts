
/** Proxima sprite
 *  - O "as Promise<Pokemon>" força o tipo, mas seria mais seguro validar a estrutura com um schema ou Zod/IoTs,
 *  se for crítico.
 * 
 *  - Expor tipos de erro mais específicos (PokemonNotFound, NetworkError) para quem consome.
 *  - Retry automático: se a API falhar por instabilidade, não há tentativas de reenvio.
 *  - tempo de timeout: se a requisição travar, o fetch fica indefinidamente aberto.
 *     seria interessante ter um timeout controlado.
 */
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
        } catch(erro: any) {
            throw new Error(`Não foi possível recuperar o pokemon ${pokemonName} da API:<br>${erro.message}`)
        }
    }

    static async getPokemon(userPokemonName: string){
        const apiPokemonName = this.handleDoubleName(userPokemonName)
        const pokemonData = await this.fetchApi(apiPokemonName)
        return pokemonData
    }
    
    private static handleDoubleName(name: string){
        const apiPokemonName = name.toLowerCase().replace(/\s+/g, '-')
        return apiPokemonName
    }
}