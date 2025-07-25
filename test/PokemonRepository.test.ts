import Api from "../src/script/Api";
import { PokemonRepository } from "../src/script/logic/PokemonRepository";
import { Pokemon } from "../src/script/Pokemon";


describe("PokemonRepository", () => {
    let repo: PokemonRepository;

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

    beforeEach(() => {
        repo = new PokemonRepository()
    })

    describe("saveOnCache private method", () => {
        test("should save Pokemon to both ID and name cache", () => {
            expect(repo.pokemonIdCache.has(mockPokemon.id)).toBe(false)
            expect(repo.pokemonNameCache.has(mockPokemon.name)).toBe(false)
            
            repo["saveOnCache"](mockPokemon)
    
            expect(repo.pokemonIdCache.has(mockPokemon.id)).toBe(true)
            expect(repo.pokemonNameCache.has(mockPokemon.name)).toBe(true)
        })
    })

    describe("getFromCache private method", () => {
        test("should return Pokemon from ID cache if available", () => {
            repo["saveOnCache"](mockPokemon)
            const returnedPokemon = repo["getFromCache"](mockPokemon.id.toString())
           
            expect(returnedPokemon).toEqual(mockPokemon)
        });

        test("should return Pokemon from name cache if available", () => {
            repo["saveOnCache"](mockPokemon)
            const returnedPokemon = repo["getFromCache"](mockPokemon.name)
           
            expect(returnedPokemon).toEqual(mockPokemon)
        });

        test("should not throw if there is no available pokemon on cache, even being on ID or Name cache", () => {
            expect(() => repo["getFromCache"](mockPokemon.name)).not.toThrow()
            expect(() => repo["getFromCache"](mockPokemon.id.toString())).not.toThrow()
            
            const returnedPokemon = repo["getFromCache"](mockPokemon.name)
            expect(returnedPokemon).toBeUndefined()
        })
    })

    describe("getPokemon public async method", () => {
        
        test("should not call fetchApi or throw an Error if there is a cached pokemon", async () => {
            const getFromCache = jest.spyOn(repo as any, "getFromCache")
            const fetchFromApi = jest.spyOn(repo as any, "fetchFromAPI")
            
            repo["saveOnCache"](mockPokemon)
            const attempt = async () => await repo.getPokemon(mockPokemon.name)

            await expect(attempt).resolves.not.toThrow()
            expect(getFromCache).toHaveBeenCalledTimes(1)
            expect(getFromCache).toHaveBeenLastCalledWith(mockPokemon.name.trim())
            await expect(fetchFromApi).not.toHaveBeenCalled()
        })

        test("should call fetchFromAPI correctly and return a available pokemon", async () => {
            const fetchFromApi = jest
                .spyOn(repo as any, "fetchFromAPI")
                .mockResolvedValue(mockPokemon)
            
            const returnedValue = await repo.getPokemon(mockPokemon.name)
            expect(fetchFromApi).toHaveBeenCalledTimes(1)
            expect(fetchFromApi).toHaveBeenCalledWith(mockPokemon.name.trim())
            expect(returnedValue).toEqual(mockPokemon)
        })

        test("should handle fetchFromAPI errors throwing a new Error", async () => {
            const fetchFromApi = jest
                .spyOn(repo as any, "fetchFromAPI")
                .mockRejectedValue(new Error("Erro na API")) 
            const attempt = () => repo.getPokemon(mockPokemon.name)
            await expect(attempt).rejects.toThrow(`Erro ao buscar Pokémon com identificador "${mockPokemon.name}"`)
        })
    })

    describe("fetchFromAPI private async method", () => {
        test("should fetch from API", async() => {
            Api.getPokemon = jest.fn().mockResolvedValue(mockPokemon)
            jest.spyOn(repo as any, "saveOnCache")

            const returnedPokemon = await repo["fetchFromAPI"](mockPokemon.name)
            expect(Api.getPokemon).toHaveBeenCalled()
            expect(repo["saveOnCache"]).toHaveBeenCalledWith(returnedPokemon)
            expect(returnedPokemon).toEqual(mockPokemon)
        });
        
        test("should return and not throw if API dont return a valid pokemon", async() => {
            Api.getPokemon = jest.fn().mockResolvedValue(undefined)
            jest.spyOn(repo as any, "saveOnCache")
            
            await expect(repo["fetchFromAPI"](mockPokemon.name)).resolves.not.toThrow()
            expect(Api.getPokemon).toHaveBeenCalled()
            expect(repo["saveOnCache"]).not.toHaveBeenCalled()
        });
    })

});

describe("RepositoryHelper", () => {
  test.todo("should return true for positive integer strings");
  test.todo("should return false for non-integer strings");
});

