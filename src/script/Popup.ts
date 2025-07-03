import { createElement } from "./appUtils.js"

export default class PopupAside{
    public static time = 500
    private static _infoBallons_El: HTMLDivElement[] = [] 

    static get infoBallons_El (): HTMLDivElement[] {
        return this._infoBallons_El!
    }
    static set infoBallons_El (newInfoBallons: HTMLDivElement[]){
        this._infoBallons_El = newInfoBallons
    }
    static show(){
        if(!this.infoBallons_El) 
            throw new Error("Popups não encontrados")

        document.addEventListener('DOMContentLoaded', (e) => {
            this._infoBallons_El.forEach((ballon, i) => {
                setTimeout(function(){
                    ballon.style.right = '0rem'
                }, this.time * (i + 1))
            })
        })
    }

    static buildnewPopup(mainFatherId:string, msg: string, isTemporary: boolean = false, ){
        const mainFather = document.getElementById(mainFatherId)

        if(!mainFather){
            throw new Error("Pai para o popup não encontrado:\n ID inválido ou inexistente") 
        }

        const ballon = createElement('div', 'info-ballon')
        const paragraf = createElement('p')
        const infoIcon = '<i class="fa-solid fa-circle-info"></i>'
        
        paragraf.innerHTML = infoIcon + msg
        ballon.append(paragraf)
        mainFather.append(ballon)
        this._infoBallons_El.push(ballon)
        
        if (!isTemporary) {
            const closeIcon = createElement("i", "fa-solid fa-xmark")
            const closeBtn = createElement('a', 'btn ballon-instruct-btn closeBtn')
            closeBtn.append(closeIcon)
            ballon.append(closeBtn)
            this.setPopupCloseBtns(mainFatherId)
        } else {
            setTimeout(() => {
             ballon.style.right = "-25rem" 
             setTimeout(() => {
                this._infoBallons_El = this.infoBallons_El.filter((b:any) => b != ballon)
                ballon.remove()
             }, this.time * 2)  
            }, this.time * 6)
        }
    }

    private static setPopupCloseBtns(mainFatherId: string):void{ 
        const mainFather = document.getElementById(mainFatherId)
        
        if(!mainFather){
            throw new Error("Pai principal de Popup não encontrado. Não foi possível configurar os botões de fechar PopUp !");
        }

        const closeBtnEl: NodeListOf<HTMLAnchorElement> = mainFather.querySelectorAll('.closeBtn')
        
        if(!closeBtnEl)
            throw new Error("Botões de fechar elementos dessa pagina não foram encontrados")
        
        closeBtnEl.forEach((btn, i) => {
            btn.addEventListener('click', (e) => {

                btn.parentElement!.style.right = '-25rem'
                setTimeout(() => {
                    this._infoBallons_El = this.infoBallons_El.filter((b:any) => b != btn.parentElement)
                    btn.parentElement!.remove()
                }, this.time * 2)
            })
        })
}


}