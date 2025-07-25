import { ok } from "assert";
import Api from "../src/script/Api";
import { Pokemon } from "../src/script/Pokemon";
import { json } from "stream/consumers";

global.fetch = jest.fn();

describe("Api", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    const mockPokemon: Pokemon = {
        id: 25,
        name: "pikachu",
        types: [{ type: { name: "electric" } }],
        sprites: {
        other: { home: { front_default: "pikachu.png" } }
        },
        stats: [
            { base_stat: 55, stat: { name: "hp" } }
        ]
    } as unknown as Pokemon;

    const apiUrl = 'https://pokeapi.co/api/v2/pokemon/'
    
    test("should fetch a Pokemon and return valid JSON", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => mockPokemon
        })
        const pokemonName = "pikachu"
        await expect(Api.getPokemon(pokemonName)).resolves.toEqual(mockPokemon)
        expect(global.fetch).toHaveBeenCalled()
        expect(global.fetch).toHaveBeenCalledWith(apiUrl + pokemonName)
    });

    test("should handle names with spaces and format correctly", async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({ok: true, json: async() => mockPokemon})
        const pokemonName = "Mr Mime"

        const resultado = await Api.getPokemon(pokemonName)

        expect(global.fetch).toHaveBeenCalledTimes(1)
        expect(global.fetch).toHaveBeenCalledWith(apiUrl + "mr-mime")
        expect(resultado).toEqual(mockPokemon)

    });

    test("should throw error when API returns non-200", async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: "Not Found"
        })
        const pokemonName = "pikachu"
        const tentativa = () => Api.getPokemon(pokemonName)
        await expect(tentativa).rejects.toThrow(
            `Não foi possível recuperar o pokemon ${pokemonName} da API:<br>API respondeu com status 404`
        )
    });

    test("should throw error when network request fails", async () => {
        global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network Error"))
        await expect(Api.getPokemon("pikachu")).rejects.toThrow(
            `Não foi possível recuperar o pokemon pikachu da API:<br>Network Error`
        )
    });
});



