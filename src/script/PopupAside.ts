import { createElement } from "./appUtils.js"
import { PokemonType } from "./Data.js"

export interface IPopup {
    fatherContainer: HTMLElement,
    popup(
        msg: string, 
        isTemporary?: boolean,
        isAlert?:boolean
        ): void;
    updateInfoBallonsColors(pkmType: PokemonType):void;
}

export class PopupAsideStatic{
    public static time = 500
    private static _infoBallons_El: HTMLDivElement[] = [] 
    private static _ballonsMap: Map<HTMLDivElement, number> = new Map()


    static popUp(fatherContainer:HTMLElement, msg: string, isTemporary: boolean = false, isAlert:boolean = false){
        const popupBallon = this.buildPopup(fatherContainer, msg, isAlert)
        this.animatePopup(popupBallon)
        this.configurePopupExit(popupBallon, fatherContainer, isTemporary)
    }

    private static buildPopup(fatherContainer:HTMLElement, msg: string, isAlert:boolean = false): HTMLDivElement{
        if(!fatherContainer){
            throw new Error("Pai para o popup não encontrado, parâmetro null ou undefined.") 
        }

        const ballon = createElement('div', 'info-ballon')
        const paragraf = createElement('p')
        const infoIcon = !isAlert ? '<i class="fa-solid fa-circle-info"></i>' : '<i class="fa-solid fa-bomb"></i>'
        
        isAlert ? ballon.setAttribute("alert", '') : true

        paragraf.innerHTML = infoIcon + msg
        ballon.append(paragraf)
        fatherContainer.append(ballon)
        this._infoBallons_El.push(ballon)
        this.saveBallon(ballon)

        return ballon
    }

    private static animatePopup(ballon: HTMLDivElement){
        const bringPopupIn: (step:number, popupBallonEl: HTMLDivElement) => void = (step:number, popupBallonEl: HTMLDivElement):any =>{
            let startTimestamp = this.ballonsMap.get(popupBallonEl)
            
            if (!startTimestamp || startTimestamp === 0){
                startTimestamp = step
            }

            this.ballonsMap.set(ballon, startTimestamp)
            const progress = (step - startTimestamp) / 2.5 - 400

            ballon.style.right = `${progress}px`

            if(progress <= 0){
                requestAnimationFrame((timestamp) => bringPopupIn(timestamp, popupBallonEl))
            } else {
                // reset startStamp
                this.ballonsMap.set(ballon, 0)
            }
        }

        requestAnimationFrame((timestamp) => bringPopupIn(timestamp, ballon))
    }

    private static configurePopupExit(ballon: HTMLDivElement, fatherContainer: HTMLElement, isTemporary: boolean){
       const timeout = this.time * 6 
        if (!isTemporary) {
            const closeIcon = createElement("i", "fa-solid fa-xmark")
            const closeBtn = createElement('a', 'btn ballon-instruct-btn closeBtn')
            closeBtn.append(closeIcon)
            ballon.append(closeBtn)
            this.setPopupCloseBtns(fatherContainer)
        } else {
            setTimeout(() => {
                requestAnimationFrame((timestamp => this.takeBallonOut(timestamp, ballon)))
            }, timeout)
        }
    }

    private static saveBallon(ballon:HTMLDivElement, startTimestamp: number = 0){
        this.ballonsMap.set(ballon, startTimestamp)
    }

    private static removeBallonFromMap(ballon:HTMLDivElement){
        this.ballonsMap.delete(ballon)
    }

    static updateInfoBallonsColors(pkmType: PokemonType){
        const ballonsInstrucEl: NodeListOf<HTMLDivElement> = document.querySelectorAll(".info-ballon:not([alert])")
        if(!ballonsInstrucEl){
            return
        }
        ballonsInstrucEl.forEach((ballon) => {
               ballon.style.backgroundColor = `rgba(var(--${pkmType}) / var(--alphaBallon))`;
        });
    }

    private static setPopupCloseBtns(fatherContainer: HTMLElement):void{ 
        
        if(!fatherContainer){
            throw new Error("Pai principal de Popup não encontrado. Não foi possível configurar os botões de fechar PopUp !");
        }

        const closeBtnEl: NodeListOf<HTMLAnchorElement> = fatherContainer.querySelectorAll('.closeBtn')
        if(!closeBtnEl)
            throw new Error("Botões de fechar elementos dessa pagina não foram encontrados")

        closeBtnEl.forEach((btn, i) => {
            const parent = btn.parentNode as HTMLDivElement
            btn.addEventListener('click', (e) => {
                requestAnimationFrame((timestamp) => this.takeBallonOut(timestamp, parent))
            })
        })
    }

    private  static takeBallonOut(step: number, ballon: HTMLDivElement):any{
        let start= this.ballonsMap.get(ballon)

        if(!start || start === 0){
            start = step
        }
        this.ballonsMap.set(ballon, start)

        const progress = (step - start) / 2
        ballon.style.right = `-${progress}px`
       
        if(progress < 500){
            requestAnimationFrame((timestamp) => this.takeBallonOut(timestamp, ballon))
        } else {
            ballon.remove()
            this.removeBallonFromMap(ballon)
            this._infoBallons_El = this._infoBallons_El.filter(b => b !== ballon)
        }
            
    }

    static get infoBallons_El (): HTMLDivElement[] {
        return this._infoBallons_El!
    }

    static set infoBallons_El (newInfoBallons: HTMLDivElement[]){
        this._infoBallons_El = newInfoBallons
    }

    static get ballonsMap(): Map<HTMLDivElement, number>{
        return this._ballonsMap
    }
}

export class PopUpAdapter implements IPopup {
    private _fatherContainer: HTMLElement
    constructor(fatherContainer: HTMLElement){
        this._fatherContainer = fatherContainer
    }
    get fatherContainer(): HTMLElement{
        return this._fatherContainer
    }
    popup(msg: string, isTemporary: boolean = false, isAlert:boolean = false){
        PopupAsideStatic.popUp(this.fatherContainer, msg, isTemporary, isAlert)
    }

    updateInfoBallonsColors(pkmType: PokemonType){
     PopupAsideStatic.updateInfoBallonsColors(pkmType)  
    }
}