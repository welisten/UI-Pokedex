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
    it.todo("should return Pokemon from ID cache if available");
    it.todo("should return Pokemon from name cache if available");
    it.todo("should fetch from API if not in cache");
    it.todo("should save Pokemon to both ID and name cache");
    it.todo("should handle API fetch error correctly");
});

describe("RepositoryHelper", () => {
  it.todo("should return true for positive integer strings");
  it.todo("should return false for non-integer strings");
});

