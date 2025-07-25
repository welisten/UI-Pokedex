import { PokemonType } from "../src/script/Data";
import { IPopup, PopUpAdapter, PopupAsideStatic } from "../src/script/PopupAside";
import '@testing-library/jest-dom'
// testes estão muitos genéricos... fazer testes específicos depois que o adapter estiver refatorado

describe("PopupAside Module", () => {
  describe("PopupAsideStatic class", () => {
    let mockFather:HTMLElement
    let isTemporary: boolean, isAlert: boolean, msg: string
    
    beforeEach(() => {
      mockFather = document.createElement("aside")
      mockFather.classList.add("informations")
      document.body.append(mockFather)
    })
    afterEach(() => {
      if(document.body.contains(mockFather)){
        mockFather.remove()
      }
    })
  
    describe("buildPopup private static method", () =>{
      test("should create and append popup ballon", () => {
        msg = "mensagem teste"
        isAlert = false
        isTemporary = false
        const ballon = PopupAsideStatic.popUp(mockFather, msg, isTemporary, isAlert)
    
        expect(mockFather.contains(ballon))
        expect(ballon.children).toHaveLength(2)// paragraf and closeBtn
        expect(ballon).not.toHaveClass("alert")
  
        const paragraf = ballon.children[0]
        const closeBtn = ballon.children[1]
    
        expect(paragraf.children).toHaveLength(1)
        expect(closeBtn.children).toHaveLength(1)
        expect(paragraf.children[0]).toBeInstanceOf(HTMLElement)
        
        expect(ballon).toBeInstanceOf(HTMLDivElement)    
        expect(paragraf).toBeInstanceOf(HTMLParagraphElement)   
        expect(closeBtn).toBeInstanceOf(HTMLAnchorElement)   
    
        expect(paragraf.textContent).toBe(msg)
    
        expect(PopupAsideStatic.ballonsMap.has(ballon)).toBe(true)
        expect(PopupAsideStatic.infoBallons_El).toContainEqual(ballon)
  
        PopupAsideStatic.infoBallons_El.pop()
        PopupAsideStatic.ballonsMap.delete(ballon)
      });
  
      test("should create a ballon with alert attribute", () => {
        isAlert =  true 
        const ballon = PopupAsideStatic.popUp(mockFather, msg, isTemporary, isAlert)
  
        expect(ballon).toHaveAttribute("alert")
        expect(ballon.children[0]).toBeInstanceOf(HTMLParagraphElement)
        expect(ballon.children[0].children[0]).toBeDefined()
        expect(ballon.children[0].children[0]).toHaveClass("fa-solid fa-bomb")
      })
  
      test("should call buidPopup with the correct paramethers", () => {
  
        const returnedBallon = document.createElement("div")
        returnedBallon.classList.add("info-ballon")
        returnedBallon.innerHTML = `
        <p>
          <i class="fa-solid fa-bomb"></i>${msg}
        </p>
        `
  
        const buildPopup = jest
          .spyOn(PopupAsideStatic as any, "buildPopup")
          .mockImplementation(() => returnedBallon)
        
        PopupAsideStatic.popUp(mockFather, msg)
        expect(buildPopup).toHaveBeenCalledTimes(1)
        expect(buildPopup).toHaveBeenCalledWith(mockFather, msg, false)
        jest.restoreAllMocks()
      })
  
      test("deve criar um popup com atributo alert se isAlert for true", () => {
        document.body.appendChild(mockFather); // necessário para passar o contains

        const result = PopupAsideStatic["buildPopup"](mockFather, "Mensagem de alerta");

        expect(result.hasAttribute("alert")).toBe(false);
      });

      test("should throw an erro if there is no valid fatherContainer", () => {
        document.body.innerHTML = ""
        mockFather = document.createElement("div")
        const tentativa = () => PopupAsideStatic.popUp(mockFather, msg)
        expect(tentativa).toThrow("Pai para o popup fornecido não foi encontrado no documento.")
      })
    })
  
    describe("animatePopup private static method", () => {
      beforeEach(() => {
        jest.useFakeTimers()
        jest.spyOn(global, "requestAnimationFrame").mockImplementation((cb: FrameRequestCallback) => {
          // Simula várias frames até o progresso ser positivo (> 0)
          for(let i = 0; i <= 10; i++) {
              cb(400 + i * 10) // timestamp crescente
          }
          return 1 // request id
        })
  
      })
      it.todo("should animate popup correctly");
  
    })
  
    describe("configurePopupExit private static method", () => {
      test("should configure close button for non-temporary popup", () => {
        isTemporary = false
        const ballon = PopupAsideStatic.popUp(mockFather, msg, isTemporary)
        const closeBtn: HTMLAnchorElement | null = ballon.querySelector(".closeBtn")
        
        expect(closeBtn).toBeDefined()
        expect(mockFather.contains(ballon)).toBeTruthy()
        jest.spyOn(global, "requestAnimationFrame")
        closeBtn!.click()
        expect(requestAnimationFrame).toHaveBeenCalled()
      });
  
      test("should automatically close temporary popup", () => {
        isTemporary = true
        jest.spyOn(global, "requestAnimationFrame")
    
        jest.useFakeTimers()
        const ballon = PopupAsideStatic.popUp(mockFather, msg, isTemporary)
        expect(mockFather.contains(ballon)).toBe(true)
        jest.runAllTimers()
        expect(mockFather.contains(ballon)).toBe(false)
  
      });
      test("should remove ballon from map after closing", () => {
        const isTemporary = true 
        
        jest.useFakeTimers()
        const ballon = PopupAsideStatic.popUp(mockFather, msg, isTemporary)
        
        expect(PopupAsideStatic.ballonsMap.has(ballon)).toBe(true)
        
        jest.runAllTimers()
        
        expect(PopupAsideStatic.ballonsMap.has(ballon)).toBe(false)
      });
      describe("setPopupCloseBtn private static method", () => {
        beforeEach(() => {
          global.requestAnimationFrame = jest.fn().mockImplementation((cb) => {
            cb(123)
            return 1
          })
        })
        afterAll(() => {
          jest.restoreAllMocks()
        })
  
        test("should call the callback takeBallonOut", () => {
          const btn = document.createElement("button")
          const mockFather:HTMLDivElement = document.createElement("div")
          
          btn.classList.add("closeBtn")
          mockFather.appendChild(btn)
          
          const takeBallonOut = jest
            .spyOn(PopupAsideStatic as any, "takeBallonOut")
            .mockImplementation(() => {})
  
          PopupAsideStatic["setPopupCloseBtns"](mockFather)
  
          btn.click()
  
          expect(takeBallonOut).toHaveBeenCalledTimes(1)
          expect(takeBallonOut).toHaveBeenCalledWith(123, mockFather)
        })
      })
    })
  
    describe("updateBallonsColors public static method", () => {
      test("should update info ballon colors", () => {
  
        let expectedType:PokemonType = "fire"  
        document.body.innerHTML = `
          <div class="info-ballon" style=""></div>
          <div class="info-ballon" style="" alert></div>
          <div class="info-ballon" style=""></div>
        `
        PopupAsideStatic.updateInfoBallonsColors(expectedType)
        const ballons = document.querySelectorAll(".info-ballon:not([alert])")
        ballons.forEach((ballon, i) => {
          expect(ballon).toHaveStyle(`background-color: rgba(var(--${expectedType}) / var(--alphaBallon))`)
        })
        
        const alertBallon = document.querySelector('.info-ballon[alert]') as HTMLDivElement;
        expect(alertBallon.style.backgroundColor).toBe('');
      });
  
      test('shoud return and do not throw if there is no ballon', () => {
      document.body.innerHTML = `<div class="other-class"></div>`;
  
      expect(() => {
        PopupAsideStatic.updateInfoBallonsColors('water');
      }).not.toThrow();
    });
  
    })
  
    test("should set _infoBallons_el correctly", () => {
      const div1: HTMLDivElement = document.createElement("div") 
      const div2: HTMLDivElement = document.createElement("div") 
      const div3: HTMLDivElement = document.createElement("div") 
  
      const divList = [div1, div2, div3]
  
      PopupAsideStatic.infoBallons_El = divList
      expect(PopupAsideStatic.infoBallons_El).toEqual(divList)
    })
  });

  describe("PopUpAdapter class", () => {
    const mockFather: HTMLElement = document.createElement("div")
    const msg = "teste"
    let popupAdapter: IPopup 
    

    test("should set up _fatherContainer correctly", () => {
      popupAdapter = new PopUpAdapter(mockFather)

      expect(popupAdapter.fatherContainer).toEqual(mockFather)
    })

    test("should call popup static method with correct paramethers",  () => {
      popupAdapter = new PopUpAdapter(mockFather)
      document.body.appendChild(mockFather)

      jest.spyOn(PopupAsideStatic, "popUp")
      popupAdapter.popup(msg)
  
      expect(PopupAsideStatic.popUp).toHaveBeenCalledTimes(1)
      expect(PopupAsideStatic.popUp).toHaveBeenCalledWith(mockFather,msg, false, false)
    })

    test("should call updateInfoBallonsColors static method with correct paramethers", () => {
      popupAdapter = new PopUpAdapter(mockFather)
      jest.spyOn(PopupAsideStatic, "updateInfoBallonsColors")
      const type = "water"
      popupAdapter.updateInfoBallonsColors(type)

      expect(PopupAsideStatic.updateInfoBallonsColors).toHaveBeenCalledTimes(1)
      expect(PopupAsideStatic.updateInfoBallonsColors).toHaveBeenCalledWith(type)
    })
  })
})

