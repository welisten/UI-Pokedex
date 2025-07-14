import { createElement } from "./appUtils.js";
export class PopupAsideStatic {
    static popUp(fatherContainer, msg, isTemporary = false, isAlert = false) {
        const popupBallon = this.buildPopup(fatherContainer, msg, isAlert);
        this.animatePopup(popupBallon);
        this.configurePopupExit(popupBallon, fatherContainer, isTemporary);
    }
    static buildPopup(fatherContainer, msg, isAlert = false) {
        if (!fatherContainer) {
            throw new Error("Pai para o popup não encontrado, parâmetro null ou undefined.");
        }
        const ballon = createElement('div', 'info-ballon');
        const paragraf = createElement('p');
        const infoIcon = !isAlert ? '<i class="fa-solid fa-circle-info"></i>' : '<i class="fa-solid fa-bomb"></i>';
        isAlert ? ballon.setAttribute("alert", '') : true;
        paragraf.innerHTML = infoIcon + msg;
        ballon.append(paragraf);
        fatherContainer.append(ballon);
        this._infoBallons_El.push(ballon);
        this.saveBallon(ballon);
        return ballon;
    }
    static animatePopup(ballon) {
        const bringPopupIn = (step, popupBallonEl) => {
            let startTimestamp = this.ballonsMap.get(popupBallonEl);
            if (!startTimestamp || startTimestamp === 0) {
                startTimestamp = step;
            }
            this.ballonsMap.set(ballon, startTimestamp);
            const progress = (step - startTimestamp) / 2.5 - 400;
            ballon.style.right = `${progress}px`;
            if (progress <= 0) {
                requestAnimationFrame((timestamp) => bringPopupIn(timestamp, popupBallonEl));
            }
            else {
                // reset startStamp
                this.ballonsMap.set(ballon, 0);
            }
        };
        requestAnimationFrame((timestamp) => bringPopupIn(timestamp, ballon));
    }
    static configurePopupExit(ballon, fatherContainer, isTemporary) {
        const timeout = this.time * 6;
        if (!isTemporary) {
            const closeIcon = createElement("i", "fa-solid fa-xmark");
            const closeBtn = createElement('a', 'btn ballon-instruct-btn closeBtn');
            closeBtn.append(closeIcon);
            ballon.append(closeBtn);
            this.setPopupCloseBtns(fatherContainer);
        }
        else {
            setTimeout(() => {
                requestAnimationFrame((timestamp => this.takeBallonOut(timestamp, ballon)));
            }, timeout);
        }
    }
    static saveBallon(ballon, startTimestamp = 0) {
        this.ballonsMap.set(ballon, startTimestamp);
    }
    static removeBallonFromMap(ballon) {
        this.ballonsMap.delete(ballon);
    }
    static updateInfoBallonsColors(pkmType) {
        const ballonsInstrucEl = document.querySelectorAll(".info-ballon:not([alert])");
        if (!ballonsInstrucEl) {
            return;
        }
        ballonsInstrucEl.forEach((ballon) => {
            ballon.style.backgroundColor = `rgba(var(--${pkmType}) / var(--alphaBallon))`;
        });
    }
    static setPopupCloseBtns(fatherContainer) {
        if (!fatherContainer) {
            throw new Error("Pai principal de Popup não encontrado. Não foi possível configurar os botões de fechar PopUp !");
        }
        const closeBtnEl = fatherContainer.querySelectorAll('.closeBtn');
        if (!closeBtnEl)
            throw new Error("Botões de fechar elementos dessa pagina não foram encontrados");
        closeBtnEl.forEach((btn, i) => {
            const parent = btn.parentNode;
            btn.addEventListener('click', (e) => {
                requestAnimationFrame((timestamp) => this.takeBallonOut(timestamp, parent));
            });
        });
    }
    static takeBallonOut(step, ballon) {
        let start = this.ballonsMap.get(ballon);
        if (!start || start === 0) {
            start = step;
        }
        this.ballonsMap.set(ballon, start);
        const progress = (step - start) / 2;
        ballon.style.right = `-${progress}px`;
        if (progress < 500) {
            requestAnimationFrame((timestamp) => this.takeBallonOut(timestamp, ballon));
        }
        else {
            ballon.remove();
            this.removeBallonFromMap(ballon);
            this._infoBallons_El = this._infoBallons_El.filter(b => b !== ballon);
        }
    }
    static get infoBallons_El() {
        return this._infoBallons_El;
    }
    static set infoBallons_El(newInfoBallons) {
        this._infoBallons_El = newInfoBallons;
    }
    static get ballonsMap() {
        return this._ballonsMap;
    }
}
PopupAsideStatic.time = 500;
PopupAsideStatic._infoBallons_El = [];
PopupAsideStatic._ballonsMap = new Map();
export class PopUpAdapter {
    constructor(fatherContainer) {
        this._fatherContainer = fatherContainer;
    }
    get fatherContainer() {
        return this._fatherContainer;
    }
    popup(msg, isTemporary = false, isAlert = false) {
        PopupAsideStatic.popUp(this.fatherContainer, msg, isTemporary, isAlert);
    }
    updateInfoBallonsColors(pkmType) {
        PopupAsideStatic.updateInfoBallonsColors(pkmType);
    }
}
