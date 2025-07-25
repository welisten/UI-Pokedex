import { setNavigationControlsKeys, removeControlsKeysEvent, createElement, RepositoryHelper } from "../src/script/appUtils";


describe("tests of setNavigationControlsKeys and removeControlsKeysEvents function", () => {
  let nextFunction: () => void 
  let prevFunction: () => void 
  describe("setNavigationControlsKeys", () => {

    beforeEach(() => {
      document.body.innerHTML = "<div id = 'pokedex'></div>"
      nextFunction =  jest.fn()
      prevFunction =  jest.fn()
    })
    afterEach(() => {
      removeControlsKeysEvent(prevFunction, nextFunction)
    })

    test("should trigger next function on ArrowRight key", () => {
      setNavigationControlsKeys(prevFunction, nextFunction)

      const event = new KeyboardEvent("keydown", {key: "ArrowRight"})
      document.dispatchEvent(event)

      expect(nextFunction).toHaveBeenCalled()
      expect(prevFunction).not.toHaveBeenCalled()

    });
    test("should trigger previous function on ArrowLeft key", () => {
      setNavigationControlsKeys(prevFunction, nextFunction)

      const event = new KeyboardEvent("keydown", {key: "ArrowLeft"})
      document.dispatchEvent(event)

      expect(prevFunction).toHaveBeenCalled()
      expect(nextFunction).not.toHaveBeenCalled()

    });
    test("should ignore other keys", () => {
      setNavigationControlsKeys(prevFunction, nextFunction)

      const eventUp = new KeyboardEvent("keydown", {key: "ArrowUp"})
      const eventDown = new KeyboardEvent("keydown", {key: "ArrowDown"})

      document.dispatchEvent(eventUp)
      document.dispatchEvent(eventDown)

      expect(prevFunction).not.toHaveBeenCalled()
      expect(nextFunction).not.toHaveBeenCalled()
    });
    test("should return and ignore functions in case there is not pokedex", () => {
      document.body.innerHTML = ""
      setNavigationControlsKeys(prevFunction, nextFunction)

      const eventLeft = new KeyboardEvent("keydown", {key: "ArrowLeft"})
      const eventRight = new KeyboardEvent("keydown", {key: "ArrowRight"})

      document.dispatchEvent(eventLeft)
      document.dispatchEvent(eventRight)

      expect(prevFunction).not.toHaveBeenCalled()
      expect(nextFunction).not.toHaveBeenCalled()

    })
  })
  
  describe("removeControlsKeysEvents", () => {
    nextFunction =  jest.fn()
    prevFunction =  jest.fn()
    test("should not throw if there's no navigationControlsHandler", () => {
      expect(() => removeControlsKeysEvent(prevFunction, nextFunction)).not.toThrow(new Error)
    })
  })
});


describe("tests of createElement function", () => {
  test("should create an element with clas and id correctly", () => {
    const element: HTMLDivElement = createElement("div", "teste", "teste")
    expect(element).toBeInstanceOf(HTMLDivElement)
    expect(element.id).toBe("teste")
    expect(element.className).toBe("teste")
  })

  test("should create an element with  more than one clas and one id correctly", () => {
    const element: HTMLDivElement = createElement("div", "teste1 teste2", "teste")
    expect(element).toBeInstanceOf(HTMLDivElement)
    expect(element.id).toBe("teste")
    expect(element.classList).toMatchObject({"0": "teste1", "1": "teste2"})
  })

  test("should create an element with no class and no Id correctly", () => {
    const element: HTMLDivElement = createElement("div")
    expect(element).toBeInstanceOf(HTMLDivElement)
    expect(element.id).toBe("")
    expect(element.className).toBe("")
  })
})

describe("test of class RepositoryHelper", () => {
  describe("static method isPositiveInteger", () => {
    test("should return true if receive a string of positive and integer number", () => {
      const calling = (num: string) => RepositoryHelper.isPositiveInteger(num)
      expect(calling("10")).toBe(true)
    })
    test("should return false if receive a NaN string", () => {
      const calling = (num: string) => RepositoryHelper.isPositiveInteger(num)
      expect(calling("ola")).toBe(false)
    })
    test("should return false if receive a negative integer number string", () => {
      const calling = (num: string) => RepositoryHelper.isPositiveInteger(num)
      expect(calling("-5")).toBe(false)
    })
    test("should return false if receive a not integer number string", () => {
      const calling = (num: string) => RepositoryHelper.isPositiveInteger(num)
      expect(calling("5.5")).toBe(false)
    })
  })
})