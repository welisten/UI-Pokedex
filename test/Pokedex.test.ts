import * as utils from './../src/script/appUtils'
import { imagesSrc, PokemonType } from "../src/script/Data";
import { Pokemon } from "../src/script/Pokemon";
import { PopUpAdapter } from "../src/script/PopupAside";
import Pokedex from "./../src/script/logic/Pokedex"
import '@testing-library/jest-dom'


describe("Pokedex", () => {
  let pokedex: Pokedex
  let pokedexScreen: HTMLDivElement
  const mockPopupFather = document.createElement("div")
  const popup = new PopUpAdapter(mockPopupFather)
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
    document.body.innerHTML = ""
    pokedexScreen = document.createElement("div")
    pokedexScreen.setAttribute("id", "pokedexScreen")
    
    document.body.appendChild(pokedexScreen)
    document.body.appendChild(mockPopupFather)
  })

  describe("pokedex construction", () => {
    let initialId: number | undefined

    test("should create a pokedex with initialId undefiden", () => {
      initialId = undefined
      const attempt = () => pokedex = new Pokedex(initialId, popup)

      expect(attempt).not.toThrow()
      expect(pokedex.currentPokemonId).toBe(1)
    })

    test("should create a pokedex with initialId less then 1", () => {
      initialId = -1
      pokedex = new Pokedex(initialId, popup)

      expect(pokedex.currentPokemonId).not.toBe(initialId)
      expect(pokedex.currentPokemonId).toBe(1)
    })

    test("should create a pokedex with initialId bigger than lastPkmId ", () => {
      initialId = 1030
      pokedex = new Pokedex(initialId, popup)

      expect(pokedex.currentPokemonId).not.toBe(initialId)
      expect(pokedex.currentPokemonId).toBe(pokedex.lastPokemonId)
    })

    test("shold set currentPokemonId property correctly", () => {
        pokedex = new Pokedex(undefined, popup)

        expect(pokedex.currentPokemonId).toBe(1)
        pokedex.currentPokemonId = 2
        expect(pokedex.currentPokemonId).toBe(2)
    })
  })
  
  beforeEach(() => {
    pokedex = new Pokedex(1, popup)
  })

  describe("init method", () => {
    test("should call all functions correctly", () => {
      jest.spyOn(pokedex, "buildPokedex")
      jest.spyOn(pokedex, "setPokedexElements")
      jest.spyOn(pokedex.popupMessege, "popup")
      
      pokedex.init()

      expect(pokedex.buildPokedex).toHaveBeenCalledTimes(1)
      expect(pokedex.buildPokedex).toHaveBeenCalledWith("pokedexScreen")
      expect(pokedex.setPokedexElements).toHaveBeenCalledTimes(1)
      expect(pokedex.popupMessege.popup).toHaveBeenCalledTimes(2)
      expect(pokedex.popupMessege.popup).toHaveBeenCalledWith("Procure pelo Pokemon desejado na barra de pesquisas")
      expect(pokedex.popupMessege.popup).toHaveBeenCalledWith("Voce também pode pesquisar através do número de identificação do Pokemon")

      jest.restoreAllMocks()
    });
  })

  describe("buildPokedex method", () => {
    test("should call the building elements function correctly", () => {
      const buildPkdexDisplay = jest.spyOn(pokedex as any, "buildPkdexDisplay")      
      const buildPkdexControls = jest.spyOn(pokedex as any, "buildPkdexControls")      

      pokedex.buildPokedex("pokedexScreen")
      expect(buildPkdexDisplay).toHaveBeenCalledWith("pokedexScreen")
      expect(buildPkdexControls).toHaveBeenCalledWith("pokedexScreen")

    });
  })

  describe("BuildPkdexDisplay private method", () => {
    test("should throw in case there is no mainFather_El", () => {
      const attemp = () => pokedex["buildPkdexDisplay"]("randomId")
      expect(attemp).toThrow("Elemento pai da pokedex não foi encontrado")
    })

    test("should call building pokedex functions correctly", () => {
      const buildPkdexTopInterface = jest.spyOn(pokedex as any, "buildPkdexTopInterface")
      const buildPkdexDataInterface = jest.spyOn(pokedex as any, "buildPkdexDataInterface")

      pokedex["buildPkdexDisplay"]("pokedexScreen")
      expect(buildPkdexTopInterface).toHaveBeenCalledTimes(1)
      expect(buildPkdexDataInterface).toHaveBeenCalledTimes(1)
      jest.restoreAllMocks()
    })

    test("should append topInterface and dataInterface in pokedex_El that must to be on mainFather_El correctly", () => {
      pokedex["buildPkdexDisplay"]("pokedexScreen")
     
      const topInterface_El = pokedexScreen.querySelector("#top")
      const dataInterface_El = pokedexScreen.querySelector("#data")
      
      expect(topInterface_El).toBeDefined()
      expect(dataInterface_El).toBeDefined()
      expect(pokedex.pokedexEl.contains(topInterface_El))
      expect(pokedex.pokedexEl.contains(dataInterface_El))
      expect(pokedexScreen.contains(pokedex.pokedexEl))

    })
  })

  describe("BuildPkdexControls private method", () => {
    test("should throw in case there is no mainFather_El", () => {
      const attemp = () => pokedex["buildPkdexControls"]("randomId")
      expect(attemp).toThrow("Elemento pai da pokedex não foi encontrado")
    })

    test("should build controlls buttons icons and append in their buttons", () => {
      pokedex["buildPkdexControls"]("pokedexScreen")

      const prevBtnIcon = pokedex.btnPrevEl.querySelector("i.fa-solid.fa-chevron-left")
      const nextBtnIcon = pokedex.btnNextEl.querySelector("i.fa-solid.fa-chevron-right")

      expect(prevBtnIcon).toBeDefined()
      expect(nextBtnIcon).toBeDefined()
    })

    test("should append the created elements correctly", () => {
      pokedex["buildPkdexControls"]("pokedexScreen")

      expect(pokedex.controllers).toBeDefined()
      expect(pokedex.controllers.contains(pokedex.btnPrevEl)).toBe(true)
      expect(pokedex.controllers.contains(pokedex.btnNextEl)).toBe(true)
      expect(pokedexScreen.contains(pokedex.controllers)).toBe(true)
    })
  })

  describe("buildPkdexTopInterface private method", () => {
    let top_El: HTMLDivElement | null
    let topBar_El: HTMLDivElement | null
    let searchBar_El: HTMLDivElement | null
    let glassIcon_El: HTMLElement | null
    let pokeImagePlaceholder_El: HTMLDivElement | null

    test("should create top elements", () => {
      top_El = pokedex["buildPkdexTopInterface"]()

      expect(top_El).toBeInstanceOf(HTMLDivElement)
      expect(top_El).toHaveAttribute("id", "top")
    })

    test("should create topBar elements", () => {
      top_El = pokedex["buildPkdexTopInterface"]()
      topBar_El = top_El.querySelector("div#top-bar")

      expect(topBar_El).toBeDefined()
    })

    test("should create searchBar elements", () => {
      top_El = pokedex["buildPkdexTopInterface"]()
      searchBar_El = top_El.querySelector("div.searchBar")

      expect(searchBar_El).toBeDefined()
    })

    test("should create glassIcon elements", () => {
      top_El = pokedex["buildPkdexTopInterface"]()
      glassIcon_El = top_El.querySelector("i.fa-solid.fa-magnifying-glass")
      
      expect(glassIcon_El).toBeDefined()
    })
    
    test("should create pokeImagePlaceholder elements", () => {
      top_El = pokedex["buildPkdexTopInterface"]()
      pokeImagePlaceholder_El = top_El.querySelector("div#poke-image-placeholder")

      expect(pokeImagePlaceholder_El).toBeDefined()
    })

    test("should set the correct attributes for elements", () => {
      pokedex["buildPkdexTopInterface"]()

      expect(pokedex.searchEl).toHaveAttribute("type", "text")
      expect(pokedex.searchEl).toHaveAttribute("value", "bulbasaur")
      expect(pokedex.pokemonImageEl).toHaveAttribute("src", imagesSrc.default)
      expect(pokedex.pokemonImageEl).toHaveAttribute("alt", "bulbasaur")
      expect(pokedex.pokemonIdNumberEl.innerText).toBe("#001")
    })

    test("should correctly append all elements", () => {
      top_El = pokedex["buildPkdexTopInterface"]()
      
      topBar_El = top_El.querySelector("div#top-bar")
      searchBar_El = top_El.querySelector("div.searchBar")
      glassIcon_El = top_El.querySelector("i.fa-solid.fa-magnifying-glass")
      pokeImagePlaceholder_El = top_El.querySelector("div#poke-image-placeholder")

      expect(top_El.contains(topBar_El)).toBe(true)
      expect(top_El.contains(pokeImagePlaceholder_El)).toBe(true)
      expect(pokeImagePlaceholder_El!.contains(pokedex.pokemonImageEl)).toBe(true)
      expect(topBar_El!.contains(searchBar_El)).toBe(true)
      expect(topBar_El!.contains(pokedex.pokemonIdNumberEl)).toBe(true)
      expect(searchBar_El!.contains(pokedex.searchEl)).toBe(true)
      expect(searchBar_El!.contains(glassIcon_El)).toBe(true)
    })
  })

  describe("buildPkdexDataInterface private method", () => {
    test("should create data element", () => {
      const dataEl = pokedex["buildPkdexDataInterface"]()

      expect(dataEl).toBeInstanceOf(HTMLDivElement)
      expect(dataEl).toHaveAttribute("id", "data")
    })

    test("should append types in their container", () => {
      jest.spyOn(pokedex.pokedexHelper, "buildTypes")
      const dataEl = pokedex["buildPkdexDataInterface"]()
     
      expect(pokedex.pokedexHelper.buildTypes).toHaveBeenCalledTimes(1)
      expect(pokedex.typesContainerEl).not.toBeEmptyDOMElement()
      expect(pokedex.typesContainerEl.children).toHaveLength(2)
      expect(pokedex.typesContainerEl.children[0]).toBeInstanceOf(HTMLSpanElement)
      expect(pokedex.typesContainerEl.children[1]).toBeInstanceOf(HTMLSpanElement)
      expect(dataEl.contains(pokedex.typesContainerEl)).toBe(true)
      
      jest.restoreAllMocks()
    })

    test("should set baseSTatsTitleEl's attribute correctly", () => {
      pokedex["buildPkdexDataInterface"]()

      expect(pokedex.baseStatsTitleEl.innerText).toBe("base stats")
      expect(pokedex.baseStatsTitleEl).toHaveStyle("color: var(--pokemonTypeColor);")
    })

    test("shoud append all stats row element correctly", () => {
      const dataEl = pokedex["buildPkdexDataInterface"]()
      const statsEl = dataEl.querySelector("div#stats")

      expect(statsEl).toBeDefined()
      expect(statsEl).not.toBeEmptyDOMElement()
      expect(statsEl?.children).toHaveLength(6)
      expect(pokedex.statDescList).toHaveLength(6)
      expect(pokedex.statNumberList).toHaveLength(6)
      expect(pokedex.statInnerBarList).toHaveLength(6)
      expect(pokedex.statOuterBarList).toHaveLength(6)
    })

    test("shoud append all created elements correctly", () => {
      const dataEl = pokedex["buildPkdexDataInterface"]()
      const statsEl = dataEl.querySelector("div#stats")

      expect(dataEl.contains(statsEl)).toBe(true)
      expect(dataEl.contains(pokedex.baseStatsTitleEl)).toBe(true)
    })
  })

  describe("setPkedexElements method", () => {
    beforeEach(() => {
      pokedex.buildPokedex("pokedexScreen")
    })

    test("should call all functions correctly", () => {
      const setPkdexDisplayElements = jest.spyOn(pokedex as any, "setPkdexDisplayElements")
      const setPkdexControlsElements = jest.spyOn(pokedex as any, "setPkdexControlsElements")
      pokedex.setPokedexElements()

      expect(setPkdexDisplayElements).toHaveBeenCalledTimes(1)
      expect(setPkdexControlsElements).toHaveBeenCalledTimes(1)

    })
  })

  describe("setPkdexDisplayElements private elements", () => {
    const pkmName = "pikachu"
    let loadPokemon: jest.SpyInstance
   
    beforeEach(() => {
      loadPokemon = jest.spyOn(pokedex as any, "loadPokemon").mockResolvedValue(mockPokemon)
      pokedex.buildPokedex("pokedexScreen")
      pokedex.searchEl.value = pkmName
    })

    afterEach(() => {
      jest.resetAllMocks()
      jest.restoreAllMocks()
    })

    test("should call function to validate search element value", () => {
      jest.spyOn(pokedex.pokedexHelper, "validateSearchValue")
      pokedex["setPkdexDisplayElements"]()

      pokedex.searchEl.dispatchEvent(new Event("change"))
      expect(pokedex.pokedexHelper.validateSearchValue).toHaveBeenCalledTimes(1)
      expect(pokedex.pokedexHelper.validateSearchValue).toHaveBeenCalledWith(pkmName, pokedex.lastPokemonId)
      
    })

    test("should catch, verify and popup an error thrown by validating function", () => {
      pokedex.pokedexHelper.validateSearchValue = jest.fn((pokemonIdentifier: string, lastPokemonId: number) => {throw new Error("Identificador fora do intervalo permitido")})
      jest.spyOn(pokedex.popupMessege, "popup")
      
      const attempt = () => {
        pokedex["setPkdexDisplayElements"]()
        pokedex.searchEl.dispatchEvent(new Event("change"))
      }

      expect(attempt).not.toThrow()
      expect(pokedex.popupMessege.popup).toHaveBeenCalledTimes(1)
      expect(pokedex.searchEl.value).toBe("")

    })

    test("should load pokemon data and if it is defined call rendering method.", async() => {
      const renderPokemon = jest
        .spyOn(pokedex as any, "renderPokemon")

      pokedex["setPkdexDisplayElements"]()
      pokedex.searchEl.dispatchEvent(new Event("change"))

      expect(loadPokemon).toHaveBeenCalledTimes(1)
      expect(loadPokemon).toHaveBeenCalledWith(pkmName)
      await expect(loadPokemon).resolves.toMatchObject(mockPokemon)
      
      expect(renderPokemon).toHaveBeenCalledTimes(1)
      expect(renderPokemon).toHaveBeenCalledWith(mockPokemon)
    })

    test("should not throw if the API throw an error", async () => {
      jest
        .spyOn(pokedex.pokedexHelper, "validateSearchValue")
        .mockImplementation(() => { throw new Error("") })

      jest
        .spyOn(pokedex.popupMessege, "popup")
        .mockImplementation(() => {})

      pokedex["setPkdexDisplayElements"]()
      pokedex.searchEl.dispatchEvent(new Event("change"))

      expect(pokedex.popupMessege.popup).not.toHaveBeenCalled()  
      expect(pokedex.searchEl.value).not.toBe("")  
    })

    test("should not throw if the API returns undefined", async () => {
      loadPokemon = jest
        .spyOn(pokedex as any, "loadPokemon")
        .mockResolvedValue(undefined)

      const renderPokemon = jest
        .spyOn(pokedex as any, "renderPokemon")

      pokedex["setPkdexDisplayElements"]()
      pokedex.searchEl.dispatchEvent(new Event("change"))

      expect(loadPokemon).toHaveBeenCalledTimes(1)
      await expect(loadPokemon).resolves.toBeUndefined()
      expect(renderPokemon).not.toHaveBeenCalled()  
    })

  })

  describe("setPkdexControlsKeys private elements", () => {
    beforeEach(() => {
      jest.spyOn(global.console, "error")
      .mockImplementation(() => {})
    })
    afterAll(() => {
      jest.resetAllMocks()
      jest.restoreAllMocks()
    })

    test("should add an event listener on btnNextElement correctly", () => {
      jest.spyOn(pokedex.pokedexHelper, "callNextPokemonFn")
      jest.spyOn(pokedex.pokemonRepository, "getPokemon")

      pokedex["setPkdexControlsElements"]()
      pokedex.btnNextEl.dispatchEvent(new Event("click"))

      expect(pokedex.pokedexHelper["callNextPokemonFn"]).toHaveBeenCalledTimes(1)
      expect(pokedex.pokemonRepository["getPokemon"]).toHaveBeenCalledTimes(1)
    })

    test("should add an event listener on btnPrevElement correctly", () => {
      jest.spyOn(pokedex.pokedexHelper, "callPreviousPokemonFn")
      jest.spyOn(pokedex.pokemonRepository, "getPokemon")

      pokedex["setPkdexControlsElements"]()
      pokedex.btnPrevEl.dispatchEvent(new Event("click"))

      expect(pokedex.pokedexHelper["callPreviousPokemonFn"]).toHaveBeenCalledTimes(1)
      expect(pokedex.pokemonRepository["getPokemon"]).toHaveBeenCalledTimes(1)
    })
    
    test("should call setNavigationControlsKeys function correctly", async () => {
      const prevSpy = jest.spyOn(pokedex.pokedexHelper, "callPreviousPokemonFn").mockResolvedValue(undefined)
      const nextSpy = jest.spyOn(pokedex.pokedexHelper, "callNextPokemonFn").mockResolvedValue(undefined)
      
      const setNavspy = jest.spyOn(utils, "setNavigationControlsKeys")
      
      pokedex["setPkdexControlsElements"]()
      
      const [prevCB, nextCB] = setNavspy.mock.calls[0]
      
      await prevCB(new Event(""))
      await nextCB(new Event(""))

      expect(setNavspy).toHaveBeenCalledTimes(1)
      expect(setNavspy).toHaveBeenCalledWith(prevCB, nextCB)
      expect(prevSpy).toHaveBeenCalledTimes(1)
      expect(nextSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe("loadPokemon private async method", () => {
    beforeEach(() => {
      jest  
        .spyOn(global.console, "error")
        .mockImplementation(() => {})
    })
    afterEach(() => {
      jest.resetAllMocks()
      jest.restoreAllMocks()
    })
    test("should load and return a pokemon data", async () => {
      jest
        .spyOn(pokedex.pokemonRepository, "getPokemon")
        .mockResolvedValue(mockPokemon)

      const pkmData = await pokedex["loadPokemon"](mockPokemon.name)

      expect(pkmData).toEqual(mockPokemon)
    })

    test("should popup an not throw when pokemon repository returns undefined", async () => {
      jest
        .spyOn(pokedex.pokemonRepository, "getPokemon")
        .mockResolvedValue(undefined)

      jest.spyOn(pokedex.popupMessege, "popup")

      const attempt = async () => await pokedex["loadPokemon"](mockPokemon.name)

      await expect(attempt).resolves.not.toThrow()
      expect(attempt).resolves.toBeUndefined()
      expect(pokedex.popupMessege.popup).toHaveBeenCalledTimes(1)
      expect(pokedex.popupMessege.popup).toHaveBeenCalledWith(
        `Pokémon não encontrado.`,
        true,
        true
      )
      expect(pokedex.searchEl.value).toBe("")

    })

    test("should catch, log and popup errors when they are thrown, but not propagated them.", async () => {
      jest
        .spyOn(pokedex.pokemonRepository, "getPokemon")
        .mockRejectedValue(new Error("erro aleatório"))

      jest
        .spyOn(pokedex.popupMessege, "popup")
      
      
      const attempt = async () => await pokedex["loadPokemon"](mockPokemon.name)
      
      await expect(attempt).resolves.not.toThrow()
      expect(attempt).resolves.toBeUndefined()
      expect(console.error).toHaveBeenCalledTimes(1)
      expect(console.error).toHaveBeenCalledWith(new Error("erro aleatório"))
      expect(pokedex.popupMessege.popup).toHaveBeenCalledTimes(1)
      expect(pokedex.popupMessege.popup).toHaveBeenCalledWith(
        `Erro ao buscar Pokémon. Verifique sua conexão ou tente mais tarde.`,
        true,
        true
      )
      expect(pokedex.searchEl.value).toBe("")

    })

    test("should handle missing Pokémon identifier gracefully", async () => {
      jest
        .spyOn(pokedex.pokemonRepository, "getPokemon")
        .mockRejectedValue(new Error(`Erro ao buscar Pokémon com identificador "${mockPokemon.name}"`))

      jest
        .spyOn(pokedex.popupMessege, "popup")

      const attempt = async () => await pokedex["loadPokemon"](mockPokemon.name)
      
      await expect(attempt).resolves.not.toThrow()
      expect(attempt).resolves.toBeUndefined()
      expect(pokedex.popupMessege.popup).toHaveBeenCalledTimes(1)
      expect(pokedex.popupMessege.popup).toHaveBeenCalledWith(
        `Pokémon não encontrado.`,
        true,
        true
      )
      expect(pokedex.searchEl.value).toBe("")

    })
  })

  describe("renderPokemon private method", () => {
    const mockSameTypePkm = {
      id: 2,
      name: "ivysaur",
      types: [
        { type: { name: "grass" } },
        { type: { name: "poison" } }
      ],
      sprites: {
        other: {
          home: {
            front_default: "ivysaur.png"
          }
        }
      },
      stats: [
        { base_stat: 60, stat: { name: "hp" } }
      ]
    } as unknown as Pokemon

    beforeEach(() => {
      jest.spyOn(pokedex as any, "isSameType")
      jest.spyOn(pokedex.popupMessege, "updateInfoBallonsColors")

      pokedex.buildPokedex("pokedexScreen")
    })

    afterEach(() => {
      jest.resetAllMocks
      jest.restoreAllMocks()
    })

    test("should render pokemon when pokemon type is iqual last one.", () => {
      jest.spyOn(pokedex as any, "renderPokemon")
      jest.spyOn(pokedex as any, "updatePokedexTop")
      jest.spyOn(pokedex as any, "updatePokedexData")
      
      pokedex["renderPokemon"](mockSameTypePkm)

      expect(pokedex.currentPokemonId).toBe(mockSameTypePkm.id)
      expect(pokedex.lastPokemonType).toBe("grass")
      expect(pokedex["updatePokedexTop"]).toHaveBeenCalledTimes(1)
      expect(pokedex["updatePokedexData"]).toHaveBeenCalledTimes(1)
      expect(pokedex["updatePokedexTop"]).toHaveBeenCalledWith(mockSameTypePkm)
      expect(pokedex["updatePokedexData"]).toHaveBeenCalledWith(mockSameTypePkm, mockSameTypePkm.types[0].type.name)
      expect(pokedex.popupMessege.updateInfoBallonsColors).not.toHaveBeenCalled()
      expect(pokedex["isSameType"]).toHaveBeenCalledTimes(1)
      expect(pokedex["isSameType"]).toHaveBeenCalledWith(mockSameTypePkm.types[0].type.name)
      expect(pokedex["isSameType"]).toHaveReturnedWith(true)
    })

    test("should update popup's ballons and css variables only when type is diferent last one.", () => {
      pokedex["renderPokemon"](mockPokemon)

      const pkmType = mockPokemon.types[0].type.name

      expect(pokedex["isSameType"]).toHaveBeenCalledTimes(1)
      expect(pokedex["isSameType"]).toHaveBeenCalledWith(pkmType)
      expect(pokedex["isSameType"]).toHaveReturnedWith(false)
      expect(pokedex.popupMessege.updateInfoBallonsColors).toHaveBeenCalledTimes(1)
      expect(pokedex.popupMessege.updateInfoBallonsColors).toHaveBeenCalledWith(pkmType)
      expect(document.body).toHaveStyle(`--pokemonTypeColor: rgb(var(--${pkmType}))`)
    });
  })

  describe("isSameType private method", () => {
    let pkmType: PokemonType
    test("should return true when it is called with the same lastPokemonType value", () => {
      pkmType = "grass"

      expect(pokedex.lastPokemonType).toBe(pkmType)
      const result = pokedex["isSameType"](pkmType)
      expect(result).toBe(true)
    })
    test("should return false when it is called with different value of lastPokemonType value", () => {
      pkmType = "water"

      expect(pokedex.lastPokemonType).not.toBe(pkmType)
      const result = pokedex["isSameType"](pkmType)
      expect(result).toBe(false)
    })
  })

  describe("updatePokedexTop private method", () => {
    test("should update pokedexTop elements", () => {
      pokedex.buildPokedex("pokedexScreen")
      pokedex["updatePokedexTop"](mockPokemon)

      expect(pokedex.pokemonIdNumberEl.innerHTML).toBe("#" + mockPokemon.id.toString().padStart(3, "0"))
      expect(pokedex.pokemonImageEl.src).toBe("http://localhost/" + mockPokemon.sprites.other!.home.front_default)
    })
  })

  describe("updatePokedexData private method", () => {
    let pokemonType: PokemonType
    mockPokemon.stats = [
      { "base_stat": 35 },
      { "base_stat": 55 },
      { "base_stat": 40 },
      { "base_stat": 50 },
      { "base_stat": 50 },
      { "base_stat": 90 }
    ]

    beforeEach(() => {
      pokemonType = mockPokemon.types[0].type.name as PokemonType
      pokedex.init()
    })

    test("should update typesContainerEl propertie correctly", () => {
      const lastValue = pokedex.typesContainerEl.innerHTML

      expect(pokedex.typesContainerEl.innerHTML).toBe(lastValue)
      
      pokedex["updatePokedexData"](mockPokemon, pokemonType)
      
      expect(pokedex.typesContainerEl.innerHTML).not.toBe(lastValue)
      expect(pokedex.typesContainerEl.children).toHaveLength(1)

      const newTypeEl = pokedex.typesContainerEl.children[0]
      
      expect(newTypeEl).toBeInstanceOf(HTMLSpanElement)
      expect(newTypeEl).toHaveClass("type")
      expect(newTypeEl).not.toHaveStyle("background-color: rgb(var(--${type}))")
      expect(newTypeEl.innerHTML).toBe(pokemonType)
    })

    test("should handle when pokemon data has more than one type", () => {
      const mockTwoTypePkm = {
        id: 2,
        name: "ivysaur",
        types: [
          { type: { name: "grass" } },
          { type: { name: "poison" } }
        ],
        sprites: {
          other: {
            home: {
              front_default: "ivysaur.png"
            }
          }
        },
        stats: [
            { base_stat: 55, stat: { name: "hp" } }
        ]
      } as unknown as Pokemon

      pokedex["updatePokedexData"](mockTwoTypePkm, "grass")
      
      const newTypesElArry = pokedex.typesContainerEl.children
      
      expect(newTypesElArry).toHaveLength(2)
      expect(newTypesElArry[0]).toHaveClass("type")
      expect(newTypesElArry[0]).toBeInstanceOf(HTMLSpanElement)
      expect(newTypesElArry[1]).toHaveClass("type")
      expect(newTypesElArry[0]).toBeInstanceOf(HTMLSpanElement)
      expect(newTypesElArry[0].innerHTML).toBe("grass")
      expect(newTypesElArry[1].innerHTML).toBe("poison")
      expect(newTypesElArry[0]).not.toHaveStyle("background-color: rgb(var(--poison))")
      expect(newTypesElArry[1]).toHaveStyle("background-color: rgb(var(--poison))")
    })
    
    test("should update stats correctly", () => {
      const stats = mockPokemon.stats

      
      pokedex["updatePokedexData"](mockPokemon, pokemonType)
      
      expect(stats.length).toBe(6)
      for(let i = 0; i < stats.length; i ++){
        expect(pokedex.statNumberList[i].innerHTML).toBe(
          stats[i].base_stat
          .toString()
          .padStart(3, "0")
        )
        expect(pokedex.statInnerBarList[i]).toHaveStyle(`width: ${stats[i].base_stat + "%"}`)
        expect(pokedex.statOuterBarList[i]).toHaveStyle(`background-color: rgba(var(--${pokemonType}) / var(--alphaType))`)
      
      }
    })
  })

  describe("removeListeners private method", () => {
    beforeEach(() => {
      pokedex.init()
      jest.spyOn(pokedex.pokedexHelper, "callPreviousPokemonFn").mockImplementation(async () => {})
      jest.spyOn(pokedex.pokedexHelper, "callNextPokemonFn").mockImplementation(async () => {})
    })

    afterEach(() => {
      jest.resetAllMocks()
      jest.restoreAllMocks()
    })

    test("should remove btns events", () => {
      expect(pokedex.pokedexHelper.callPreviousPokemonFn).not.toHaveBeenCalled()
      expect(pokedex.pokedexHelper.callNextPokemonFn).not.toHaveBeenCalled()

      pokedex.btnPrevEl.dispatchEvent(new Event("click"))
      expect(pokedex.pokedexHelper.callPreviousPokemonFn).toHaveBeenCalledTimes(1)
      pokedex.btnNextEl.dispatchEvent(new Event("click"))
      expect(pokedex.pokedexHelper.callNextPokemonFn).toHaveBeenCalledTimes(1)
      
      pokedex["removeListeners"]()
      
      pokedex.btnPrevEl.dispatchEvent(new Event("click"))
      expect(pokedex.pokedexHelper.callPreviousPokemonFn).not.toHaveBeenCalledTimes(2)
      pokedex.btnNextEl.dispatchEvent(new Event("click"))
      expect(pokedex.pokedexHelper.callNextPokemonFn).not.toHaveBeenCalledTimes(2)
    
    })
  })
})
