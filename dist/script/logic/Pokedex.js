import Api from "../Api.js";
import { setDirectionControlsKeys, updateInfoBallonsColors } from "../appUtils.js";
import { imagesSrc, typesColor } from "../Data.js";
import PopupAside from "../Popup.js";
export default class Pokedex {
    constructor(initialId = 1) {
        this._lastPkmId = 1025;
        this.pokemonIdCache = new Map();
        this.pokemonNameCache = new Map();
        this.pokedex_El = this.createElement("div", "", "pokedex");
        this.controlers = this.createElement("div", "", "controlers");
        this.search_El = this.createElement("input", "", "search");
        this.pkmIdNumber_El = this.createElement("span", "", "number");
        this.pkmImage_El = this.createElement("img", "", "pokemon-image");
        this.typesContainer_El = this.createElement("div", "", "types");
        this.baseStatsTitle_El = this.createElement("h4", "", "base-stat");
        this.btnPrevEl = this.createElement("span", "controlers-btn btnPrev", "mainBtnPrev");
        this.btnNextEl = this.createElement("span", "controlers-btn btnNext", "mainBtnNext");
        this.statDescEl = [];
        this.statNumberEl = [];
        this.statInneBarEl = [];
        this.statOuterBarEl = [];
        let aux = initialId;
        if (initialId <= 0)
            aux = 1;
        if (initialId > this.lastPkmId)
            aux = this.lastPkmId;
        this._currentPkmId = aux;
    }
    init() {
        this.buildPokedex("pokedexScreen");
        this.setPokedexElements();
        PopupAside.buildnewPopup("instructions", "Procure pelo Pokemon desejado na barra de pesquisas");
        PopupAside.buildnewPopup("instructions", "Voce também pode pesquisar através do número de identificação do Pokemon");
        PopupAside.show();
    }
    buildPokedex(containerId) {
        this.buildDisplay(containerId);
        this.buildPkdexControls(containerId);
    }
    setPokedexElements() {
        this.setPkdexDisplayElements();
        this.setPkdexControlsElements();
    }
    get currentPkmid() {
        return this._currentPkmId;
    }
    get lastPkmId() {
        return this._lastPkmId;
    }
    set currentPkmId(newId) {
        this._currentPkmId = newId;
    }
    buildDisplay(containerId) {
        const mainFather_EL = document.getElementById(containerId);
        if (!mainFather_EL) {
            throw new Error("Elemento pai da pokedex não foi encontrado");
        }
        const top_El = this.buildPkdexTopInterface();
        const data_El = this.buildPkdexDataInterface();
        this.pokedex_El.append(top_El, data_El);
        mainFather_EL.append(this.pokedex_El);
    }
    buildPkdexDataInterface() {
        const data_El = this.createElement("div", "", "data");
        const type1_El = this.createElement("span", "type");
        const type2_El = this.createElement("span", "type");
        type1_El.style.backgroundColor = `rgba(${typesColor.grass[0]}, ${typesColor.grass[1]}, ${typesColor.grass[2]})`;
        type2_El.style.backgroundColor = `rgba(${typesColor.poison[0]}, ${typesColor.poison[1]}, ${typesColor.poison[2]})`;
        type1_El.innerText = "grass";
        type2_El.innerText = "poison";
        this.typesContainer_El.append(type1_El, type2_El);
        this.baseStatsTitle_El.style.color = `rgba(${typesColor.grass[0]}, ${typesColor.grass[1]}, ${typesColor.grass[2]})`;
        this.baseStatsTitle_El.innerText = "base stats";
        const stats_El = this.createElement("div", "", "stats");
        for (let i = 0; i < 6; i++) {
            let numberValue;
            let stat;
            switch (i + 1) {
                case 1:
                    numberValue = "45";
                    stat = "HP";
                    break;
                case 2:
                    numberValue = "49";
                    stat = "ATK";
                    break;
                case 3:
                    numberValue = "49";
                    stat = "DEF";
                    break;
                case 4:
                    numberValue = "65";
                    stat = "SATK";
                    break;
                case 5:
                    numberValue = "65";
                    stat = "SDEF";
                    break;
                case 6:
                    numberValue = "45";
                    stat = "SPD";
                    break;
                default:
                    break;
            }
            let statRow_El = this.createElement("div", "stat-row");
            let statRowDesc_El = this.createElement("div", "stat-desc");
            let statRowNumber_El = this.createElement("div", "stat-number");
            let statRowBar_El = this.createElement("div", "stat-bar");
            let statRowBarOuter_El = this.createElement("div", "bar-outer");
            let statRowBarInner_El = this.createElement("div", "bar-inner");
            this.statDescEl.push(statRowDesc_El);
            this.statNumberEl.push(statRowNumber_El);
            this.statInneBarEl.push(statRowBarInner_El);
            this.statOuterBarEl.push(statRowBarOuter_El);
            statRowBarInner_El.style.width = numberValue + "%";
            statRowBarOuter_El.appendChild(statRowBarInner_El);
            statRowBar_El.appendChild(statRowBarOuter_El);
            statRowDesc_El.innerText = stat;
            statRowNumber_El.innerText = "0" + numberValue;
            statRow_El.append(statRowDesc_El, statRowNumber_El, statRowBar_El);
            stats_El.append(statRow_El);
        }
        data_El.append(this.typesContainer_El, this.baseStatsTitle_El, stats_El);
        return data_El;
    }
    buildPkdexTopInterface() {
        const top_El = this.createElement("div", "", "top");
        const topBar_El = this.createElement("div", "", "top-bar");
        const searchBar_El = this.createElement("div", "searchBar");
        this.search_El.setAttribute("type", "text");
        this.search_El.setAttribute("value", "bulbasaur");
        const glassIcon_El = this.createElement("i", "fa-solid fa-magnifying-glass");
        const pokeImagePlaceholder_El = this.createElement("div", "", 'poke-image-placeholder');
        this.pkmImage_El.src = imagesSrc.default;
        this.pkmImage_El.alt = "bulbasaur";
        this.pkmIdNumber_El.innerText = "#001";
        searchBar_El.append(this.search_El, glassIcon_El);
        topBar_El.append(searchBar_El, this.pkmIdNumber_El);
        pokeImagePlaceholder_El.appendChild(this.pkmImage_El);
        top_El.append(topBar_El, pokeImagePlaceholder_El);
        return top_El;
    }
    setPkdexDisplayElements() {
        this.search_El.addEventListener("change", async (event) => {
            const target = event.target;
            const pokemonIdentyfier = target.value;
            try {
                this.validateSearchValue(pokemonIdentyfier);
            }
            catch (_a) {
                return;
            }
            const pokemonData = await this.getPokemon(pokemonIdentyfier);
            if (!pokemonData) {
                PopupAside.buildnewPopup("instructions", `Pokémon não encontrado.`, true);
                target.value = "";
                return;
            }
            this._currentPkmId = pokemonData.id;
            const mainColor = typesColor[pokemonData.types[0].type.name];
            this.updatePokedexTop(pokemonData, mainColor);
            this.updatePokedexData(pokemonData, mainColor);
            this.updatePokedexControls(mainColor);
            updateInfoBallonsColors(mainColor);
        });
    }
    async getPokemon(searchValue) {
        const trimmed = searchValue.trim();
        const isPositiveInteger = /^\d+$/.test(trimmed);
        if (isPositiveInteger) {
            const id = parseInt(trimmed);
            if (this.pokemonIdCache.has(id)) {
                return this.pokemonIdCache.get(id);
            }
        }
        else {
            const name = trimmed.toLowerCase();
            if (this.pokemonNameCache.has(name)) {
                return this.pokemonNameCache.get(name);
            }
        }
        try {
            const pokemon = await Api.getPokemon(trimmed);
            if (!pokemon)
                return undefined;
            this.pokemonIdCache.set(pokemon.id, pokemon);
            this.pokemonNameCache.set(pokemon.name.toLowerCase(), pokemon);
            return pokemon;
        }
        catch (error) {
            console.error("Erro ao buscar pokemon.", error);
            return undefined;
        }
    }
    updatePokedexTop(pokemonData, mainColor) {
        this.pokedex_El.style.backgroundColor = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
        this.pkmIdNumber_El.innerHTML = "#" + pokemonData.id.toString().padStart(3, "0");
        this.pkmImage_El.src = pokemonData.sprites.other.home.front_default;
    }
    updatePokedexData(pokemonData, mainColor) {
        this.baseStatsTitle_El.style.color = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
        this.typesContainer_El.innerHTML = " ";
        pokemonData.types.forEach((t) => {
            let newType = this.createElement("span", "type");
            let colors = typesColor[t.type.name];
            newType.innerHTML = t.type.name;
            newType.style.backgroundColor = `rgb(${colors[0]}, ${colors[1]}, ${colors[2]})`;
            this.typesContainer_El.appendChild(newType);
        });
        pokemonData.stats.forEach((s, i) => {
            this.statNumberEl[i].innerHTML = s.base_stat.toString().padStart(3, "0");
            this.statInneBarEl[i].style.width = s.base_stat + `%`;
            this.statInneBarEl[i].style.backgroundColor = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
            this.statOuterBarEl[i].style.backgroundColor = `rgba(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]}, 0.3)`;
            this.statDescEl[i].style.color = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
        });
    }
    validateSearchValue(value) {
        const trimmed = value.trim();
        const isPositiveInt = /^\d+$/.test(trimmed);
        if (isPositiveInt) {
            if (parseInt(value) > this.lastPkmId || parseInt(value) < 1) {
                PopupAside.buildnewPopup("instructions", `Os identificadores de Pokemon vão de <b>1</b> a <b>${this.lastPkmId}</b>. Selecione uma opção válida!`);
                throw new Error("Identificador invalido");
            }
        }
    }
    ;
    buildPkdexControls(containerId) {
        const mainFather_EL = document.getElementById(containerId);
        if (!mainFather_EL) {
            throw new Error("Elemento pai da pokedex não foi encontrado");
        }
        this.btnPrevEl.style.backgroundColor = `rgba(${typesColor.grass[0]}, ${typesColor.grass[1]}, ${typesColor.grass[2]})`;
        this.btnNextEl.style.backgroundColor = `rgba(${typesColor.grass[0]}, ${typesColor.grass[1]}, ${typesColor.grass[2]})`;
        const iconChevronLeft = this.createElement("i", "fa-solid fa-chevron-left");
        const iconChevronRight = this.createElement("i", "fa-solid fa-chevron-right");
        this.btnPrevEl.append(iconChevronLeft);
        this.btnNextEl.append(iconChevronRight);
        this.controlers.append(this.btnPrevEl, this.btnNextEl);
        mainFather_EL.append(this.controlers);
    }
    updatePokedexControls(mainColor) {
        const controlersBtnEl = document.querySelectorAll(".controlers-btn");
        controlersBtnEl.forEach((btn, i) => {
            btn.style.backgroundColor = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
        });
    }
    setPkdexControlsElements() {
        const callPreviousPkmFn = async () => {
            this._currentPkmId = this._currentPkmId > 1 ? this._currentPkmId - 1 : this.lastPkmId;
            const pokemonData = await this.getPokemon(this._currentPkmId.toString());
            const eventoChange = new Event("change");
            this.search_El.value = pokemonData.name;
            this.search_El.dispatchEvent(eventoChange);
        };
        const callNextPkmFn = async () => {
            this._currentPkmId = this._currentPkmId < this.lastPkmId ? this._currentPkmId + 1 : 1;
            const pokemonData = await this.getPokemon(this._currentPkmId.toString());
            const eventoChange = new Event("change");
            this.search_El.value = pokemonData.name;
            this.search_El.dispatchEvent(eventoChange);
        };
        this.btnNextEl.addEventListener("click", callNextPkmFn);
        this.btnPrevEl.addEventListener("click", callPreviousPkmFn);
        setDirectionControlsKeys(callPreviousPkmFn, callNextPkmFn);
    }
    createElement(tag, cls, id) {
        const element = document.createElement(tag);
        if (cls) {
            let arr = cls.split(" ");
            arr.forEach((c) => element.classList.add(c));
        }
        if (id)
            element.id = id;
        return element;
    }
}
