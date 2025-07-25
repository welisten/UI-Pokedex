import { PokedexHelper } from "../src/script/appUtils";
import { IPopup } from "../src/script/PopupAside";

describe("tests of Class PokedexHelper", () => {
  const fakePopup = { popup: jest.fn()} as unknown as IPopup
  const pokedexHelper = new PokedexHelper(fakePopup)
  const lastPokemonId = 1025
  const pkmName =  "pikachu"
  const getPokemon = jest.fn().mockReturnValue({name: pkmName})
  let currentPokemonId = 25
  let search: HTMLInputElement

  test("should build stat row elements correctly", () => {
    const name = "ATK"
    const value = 45
    const resultado = pokedexHelper.buildStatRow(name, value)
    
    expect(resultado.row).toBeInstanceOf(HTMLDivElement)
    expect(resultado.desc).toBeInstanceOf(HTMLDivElement)
    expect(resultado.inneBar).toBeInstanceOf(HTMLDivElement)
    expect(resultado.outerBar).toBeInstanceOf(HTMLDivElement)
    expect(resultado.number).toBeInstanceOf(HTMLDivElement)

    expect(resultado.desc.innerText).toBe(name)
    expect(resultado.number.innerText).toBe(`0${value}`)
    expect(resultado.inneBar.style.width).toBe(`${value}%`)

    expect(resultado.row.contains(resultado.desc)).toBe(true)
    expect(resultado.row.contains(resultado.number)).toBe(true)
    expect(resultado.row.contains(resultado.outerBar)).toBe(true)
    expect(resultado.outerBar.contains(resultado.inneBar)).toBe(true)
  });

  test("should build type elements with correct styles", () => {
    const types = ["grass","fire"]
    const resultado: HTMLSpanElement[] = pokedexHelper.buildTypes(types)

    expect(resultado[0]).toBeInstanceOf(HTMLSpanElement)
    expect(resultado[0].innerText).toBe(types[0])
    expect(resultado[0].style.backgroundColor).toBe(`var(--pokemonTypeColor)`)

    expect(resultado[1]).toBeInstanceOf(HTMLSpanElement)
    expect(resultado[1].innerText).toBe(types[1])
    expect(resultado[1].style.backgroundColor).toBe(`rgb(var(--${types[1]}))`)

  
  });

  test("should validate search value in allowed range", () => {
    let value:string
    const tentativa = () => pokedexHelper.validateSearchValue(value, lastPokemonId)
    
    value  = "25"
    expect(tentativa).not.toThrow()

    value = "pikachu"
    expect(tentativa).not.toThrow()

    value = "1025"
    expect(tentativa).not.toThrow()
  });

  test("should throw on invalid search value", () => {
    let value:string
    const tentativa = () => pokedexHelper.validateSearchValue(value, lastPokemonId)
    
    value  = "0"
    expect(tentativa).toThrow("Identificador fora do intervalo permitido")
    
    value  = "1026"
    expect(tentativa).toThrow("Identificador fora do intervalo permitido")

  }); 

  test("should call previous Pokemon function", async () => {
    search = document.createElement('input')
    search.type = "text"
    
    const previousFn = jest.fn()
    search.addEventListener("change", previousFn)
    
    await pokedexHelper.callPreviousPokemonFn(
      currentPokemonId,
      lastPokemonId,
      getPokemon,
      search
    )

    expect(previousFn).toHaveBeenCalled()
    expect(getPokemon).toHaveBeenCalledTimes(1)
    expect(getPokemon).toHaveBeenCalledWith((currentPokemonId - 1).toString())
    expect(search.value).toBe(pkmName)
  });

  test("should call next Pokemon function", async () => {
    search = document.createElement('input')
    search.type = "text"
    
    const nextFn = jest.fn()
    search.addEventListener("change", nextFn)
    
    await pokedexHelper.callNextPokemonFn(
      currentPokemonId,
      lastPokemonId,
      getPokemon,
      search
    )

    expect(nextFn).toHaveBeenCalled()
    expect(getPokemon).toHaveBeenCalledWith((currentPokemonId + 1).toString())
  });

  test("should log and popup an erro if getPokemon's API function fail in callNextPokemon", async () => {
    console.error = jest.fn()
    const rejectedValue = {messege: "API"}
    const mockGetPokemon = jest.fn().mockRejectedValue(rejectedValue)
    await pokedexHelper.callNextPokemonFn(
      currentPokemonId,
      lastPokemonId,
      mockGetPokemon,
      search
    )
    expect(mockGetPokemon).toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith(rejectedValue)
    expect(pokedexHelper.popupMessege.popup).toHaveBeenCalledWith(
      `Erro ao buscar Pokémon. Verifique sua conexão ou tente mais tarde.`,
      true,
      true
    )

  })
  test("should log and popup an erro if getPokemon's API function fail in callPreviousPokemon", async () => {
    console.error = jest.fn()
    const rejectedValue = {messege: "API"}
    const mockGetPokemon = jest.fn().mockRejectedValue(rejectedValue)
    
    await pokedexHelper.callPreviousPokemonFn(
      currentPokemonId,
      lastPokemonId,
      mockGetPokemon,
      search
    )
    expect(mockGetPokemon).toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith(rejectedValue)
    expect(pokedexHelper.popupMessege.popup).toHaveBeenCalledWith(
      `Erro ao buscar Pokémon. Verifique sua conexão ou tente mais tarde.`,
      true,
      true
    )

  })
  test("should call last pokemon if call previous pokemon of first one", async () => {
    currentPokemonId = 1 // first one
    await pokedexHelper.callPreviousPokemonFn(currentPokemonId, lastPokemonId, getPokemon, search)
    expect(getPokemon).toHaveBeenCalledWith(lastPokemonId.toString())
  })
  test("should call fist pokemon if call next pokemon of last one", async () => {
    currentPokemonId = lastPokemonId// last one
    await pokedexHelper.callNextPokemonFn(currentPokemonId, lastPokemonId, getPokemon, search)
    expect(getPokemon).toHaveBeenCalledWith("1")
  })
});
