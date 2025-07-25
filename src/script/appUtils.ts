import { Pokemon } from "./Pokemon.js"
import { IPopup} from "./PopupAside.js"
let navigationControlsHandler: ((e: KeyboardEvent) => void) | null = null

export function setNavigationControlsKeys(callPreviousPokemonFn: EventListener, callNextPokemonFn: EventListener){ 
    if(!navigationControlsHandler){
        navigationControlsHandler = (e) => controlsKeysCallback(e, callPreviousPokemonFn, callNextPokemonFn)
        document!.addEventListener("keydown", navigationControlsHandler)
    }
}

export function removeControlsKeysEvent(callPreviousPokemonFn: EventListener, callNextPokemonFn: EventListener){
    if(navigationControlsHandler){
        document!.removeEventListener("keydown", navigationControlsHandler) 
        navigationControlsHandler = null
    }
}

function controlsKeysCallback(e: KeyboardEvent, callPreviousPokemonFn: EventListener, callNextPokemonFn: EventListener){
    const pokedex = document.getElementById("pokedex")
        if(!pokedex){
            return
        }
        switch(e.key){
            case 'ArrowRight':
                callNextPokemonFn(e)
                break
            case 'ArrowLeft':
                callPreviousPokemonFn(e)
                break
            default:
                break
        }
}

export function createElement<T extends keyof HTMLElementTagNameMap>(
    tag: T,
    cls?: string,
    id?: string
  ) {
    const element = document.createElement(tag);
    if (cls) {
      let arr = cls.split(" ");
      arr.forEach((c) => element.classList.add(c));
    }
    if (id) element.id = id;
    return element;
}

export class PokedexHelper{
    popupMessege:IPopup

    constructor(popup:IPopup){
        this.popupMessege = popup
    }

    buildStatRow(statName: string, statValue: number): {
        row: HTMLDivElement,
        desc: HTMLDivElement,
        number: HTMLDivElement,
        inneBar: HTMLDivElement,
        outerBar: HTMLDivElement,
    } {
        const statRowEl = createElement("div", "stat-row");
        const statRowDescEl = createElement("div", "stat-desc");
        const statRowNumberEl = createElement("div", "stat-number");
        const statRowBarEl = createElement("div", "stat-bar");
        const statRowBarInnerEl = createElement("div", "bar-inner");
        const statRowBarOuterEl = createElement("div", "bar-outer");

        statRowDescEl.innerText = statName;
        statRowNumberEl.innerText = statValue.toString().padStart(3, '0');
        statRowBarInnerEl.style.width = `${statValue}%`;

        statRowBarOuterEl.appendChild(statRowBarInnerEl);
        statRowBarEl.appendChild(statRowBarOuterEl);
        statRowEl.append(statRowDescEl, statRowNumberEl, statRowBarEl);

        return {
            row: statRowEl,
            desc: statRowDescEl,
            number: statRowNumberEl,
            inneBar: statRowBarInnerEl,
            outerBar: statRowBarOuterEl
        }
    }

    buildTypes(types: string[]): HTMLSpanElement[]{
        return types.map((type, i) => {
            const typeEl = createElement("span", "type")
            typeEl.style.backgroundColor = i > 0 ? `rgb(var(--${type}))` : `var(--pokemonTypeColor)`;
            typeEl.innerText = type;
            return typeEl;
        })
    }

    validateSearchValue(value:string, lastPokemonId:number){
        const trimmed = value.trim()
        const isPositiveInt = /^\d+$/.test(trimmed)
        if(isPositiveInt){
          if(parseInt(value) > lastPokemonId || parseInt(value) < 1){
            throw new Error("Identificador fora do intervalo permitido")
          }
        } 
    };

    async callPreviousPokemonFn (
        currentId: number,
        lastPokemonId: number,
        getPokemon: (id:string) => void,
        search:HTMLInputElement
    ){
        try{
            currentId = currentId  > 1 ? currentId - 1 : lastPokemonId;
            const pokemonData = await getPokemon(currentId.toString()) as Pokemon | undefined;
            const eventoChange = new Event("change");
            search.value = pokemonData!.name;
            search.dispatchEvent(eventoChange);
        } catch(erro){
            console.error(erro)
            this.popupMessege.popup(
                `Erro ao buscar Pokémon. Verifique sua conexão ou tente mais tarde.`,
                true,
                true
            )
            return
        }
    }
    async callNextPokemonFn(
        currentId: number,
        lastPokemonId: number,
        getPokemon: (id:string) => void,
        search:HTMLInputElement
    ){
        try{
            currentId = currentId < lastPokemonId ? currentId + 1 : 1
            const pokemonData =await getPokemon(currentId.toString()) as Pokemon | undefined
            const eventoChange = new Event("change");
            search.value = pokemonData!.name;
            search.dispatchEvent(eventoChange);
        } catch(erro){
            console.error(erro)
            this.popupMessege.popup(
                `Erro ao buscar Pokémon. Verifique sua conexão ou tente mais tarde.`,
                true,
                true
            )
            return
        }
    }
}

export class RepositoryHelper{
    static isPositiveInteger(identifier:string){
      return /^\d+$/.test(identifier.trim())
    }
}