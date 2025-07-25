/** Proximas Implementações
 *  - carregamento inicial dinâmico
 *  - adição do nome do pokemon ao pokedexData
 *  - desacloplar construindo uma pokedexBuilder
 *  - ThemeManeger para controle de css inline
 *  - atualizar animações para requestAnimationFrame
 */
import { setNavigationControlsKeys, PokedexHelper, createElement } from "../appUtils.js";
import { imagesSrc } from "../Data.js";
import { PokemonRepository } from "./PokemonRepository.js";
export default class Pokedex {
    _currentPokemonId;
    _lastPokemonId = 1025;
    _lastPokemonType;
    _pokemonRepository = new PokemonRepository();
    _popup;
    _pokedexHelper;
    pokedexEl = createElement("div", "", "pokedex");
    controllers = createElement("div", "", "controllers");
    searchEl = createElement("input", "", "search");
    pokemonIdNumberEl = createElement("span", "", "number");
    pokemonImageEl = createElement("img", "", "pokemon-image");
    typesContainerEl = createElement("div", "", "types");
    baseStatsTitleEl = createElement("h4", "", "base-stat");
    informationContainerEl = document.getElementById("informations");
    btnPrevEl = createElement("span", "controllers-btn btnPrev", "mainBtnPrev");
    btnNextEl = createElement("span", "controllers-btn btnNext", "mainBtnNext");
    statDescList = [];
    statNumberList = [];
    statInnerBarList = [];
    statOuterBarList = [];
    constructor(initialId = 1, popup) {
        let aux = initialId;
        if (initialId === 1) {
            this.lastPokemonType = 'grass';
        }
        else {
            true;
            // Implementar nas proximas sprites
        }
        if (initialId <= 0)
            aux = 1;
        if (initialId > this.lastPokemonId)
            aux = this.lastPokemonId;
        this._currentPokemonId = aux;
        this._popup = popup;
        this._pokedexHelper = new PokedexHelper(this.popupMessege);
    }
    init() {
        this.buildPokedex("pokedexScreen");
        this.setPokedexElements();
        this.popupMessege.popup("Procure pelo Pokemon desejado na barra de pesquisas");
        this.popupMessege.popup("Voce também pode pesquisar através do número de identificação do Pokemon");
    }
    buildPokedex(containerId) {
        this.buildPkdexDisplay(containerId);
        this.buildPkdexControls(containerId);
    }
    buildPkdexDisplay(containerId) {
        const mainFather_EL = document.getElementById(containerId);
        if (!mainFather_EL) {
            throw new Error("Elemento pai da pokedex não foi encontrado");
        }
        const top_El = this.buildPkdexTopInterface();
        const dataEl = this.buildPkdexDataInterface();
        this.pokedexEl.append(top_El, dataEl);
        mainFather_EL.append(this.pokedexEl);
    }
    buildPkdexControls(containerId) {
        const mainFather_EL = document.getElementById(containerId);
        if (!mainFather_EL) {
            throw new Error("Elemento pai da pokedex não foi encontrado");
        }
        const iconChevronLeft = createElement("i", "fa-solid fa-chevron-left");
        const iconChevronRight = createElement("i", "fa-solid fa-chevron-right");
        this.btnPrevEl.append(iconChevronLeft);
        this.btnNextEl.append(iconChevronRight);
        this.controllers.append(this.btnPrevEl, this.btnNextEl);
        mainFather_EL.append(this.controllers);
    }
    /**A construção da pokedex deve ser baseada no parâmetro initialId, passado pelo o usuário. Por isso, esse codigo
     * precisa ser refatorado levando isso em consideração. Deve se verificar se o id inicial é diferente de 1 e assim
     * decidir se haverá chamada pra API e a construção ser baseado em cima dos dados retornados.
     *
     * Outra opção mais robusta é SEMPRE fazer a requizição, independente se é a intanciação da classe Pokedex ou
     * uma interação com a instância já concluida
     */
    buildPkdexTopInterface() {
        const top_El = createElement("div", "", "top");
        const topBar_El = createElement("div", "", "top-bar");
        const searchBar_El = createElement("div", "searchBar");
        this.searchEl.setAttribute("type", "text");
        this.searchEl.setAttribute("value", "bulbasaur");
        const glassIcon_El = createElement("i", "fa-solid fa-magnifying-glass");
        const pokeImagePlaceholder_El = createElement("div", "", 'poke-image-placeholder');
        this.pokemonImageEl.src = imagesSrc.default;
        this.pokemonImageEl.alt = "bulbasaur";
        this.pokemonIdNumberEl.innerText = "#001";
        searchBar_El.append(this.searchEl, glassIcon_El);
        topBar_El.append(searchBar_El, this.pokemonIdNumberEl);
        pokeImagePlaceholder_El.appendChild(this.pokemonImageEl);
        top_El.append(topBar_El, pokeImagePlaceholder_El);
        return top_El;
    }
    buildPkdexDataInterface() {
        const dataEl = createElement("div", "", "data");
        // Types
        this.typesContainerEl.append(...this.pokedexHelper.buildTypes(["grass", "poison"]));
        dataEl.append(this.typesContainerEl);
        // Base stats
        this.baseStatsTitleEl.style.color = `var(--pokemonTypeColor)`;
        this.baseStatsTitleEl.innerText = "base stats";
        const statsEl = createElement("div", "", "stats");
        const statsList = [
            { stat: "HP", value: 45 },
            { stat: "ATK", value: 49 },
            { stat: "DEF", value: 49 },
            { stat: "SATK", value: 65 },
            { stat: "SDEF", value: 65 },
            { stat: "SPD", value: 45 }
        ];
        statsList.forEach((s, i) => {
            const statRowElements = this.pokedexHelper.buildStatRow(s.stat, s.value);
            statsEl.append(statRowElements.row);
            this.statDescList.push(statRowElements.desc);
            this.statNumberList.push(statRowElements.number);
            this.statInnerBarList.push(statRowElements.inneBar);
            this.statOuterBarList.push(statRowElements.outerBar);
        });
        dataEl.append(this.baseStatsTitleEl, statsEl);
        return dataEl;
    }
    setPokedexElements() {
        this.setPkdexDisplayElements();
        this.setPkdexControlsElements();
    }
    setPkdexDisplayElements() {
        this.searchEl.addEventListener("change", async (event) => {
            const target = event.target;
            const pokemonIdentifier = target.value;
            //validação
            try {
                this.pokedexHelper.validateSearchValue(pokemonIdentifier, this.lastPokemonId);
            }
            catch (e) {
                if (e.message === "Identificador fora do intervalo permitido") {
                    this.popupMessege.popup(`Os identificadores de Pokemon vão de <b alert>1</b> a <b alert>${this.lastPokemonId}</b>. Selecione uma opção dentro do intervalo!`, false, true);
                    target.value = "";
                }
                return;
            }
            const pokemonData = await this.loadPokemon(pokemonIdentifier);
            if (pokemonData) {
                this.renderPokemon(pokemonData);
            }
        });
    }
    setPkdexControlsElements() {
        this.btnNextEl.addEventListener("click", async () => await this.pokedexHelper.callNextPokemonFn(this.currentPokemonid, this.lastPokemonId, this.pokemonRepository.getPokemon.bind(this.pokemonRepository), this.searchEl));
        this.btnPrevEl.addEventListener("click", async () => this.pokedexHelper.callPreviousPokemonFn(this.currentPokemonid, this.lastPokemonId, this.pokemonRepository.getPokemon.bind(this.pokemonRepository), this.searchEl));
        setNavigationControlsKeys(async () => this.pokedexHelper.callPreviousPokemonFn(this.currentPokemonid, this.lastPokemonId, this.pokemonRepository.getPokemon.bind(this.pokemonRepository), this.searchEl), async () => this.pokedexHelper.callNextPokemonFn(this.currentPokemonid, this.lastPokemonId, this.pokemonRepository.getPokemon.bind(this.pokemonRepository), this.searchEl));
    }
    async loadPokemon(pokemonIdentifier) {
        try {
            const pokemonData = await this.pokemonRepository.getPokemon(pokemonIdentifier);
            if (!pokemonData) {
                this.popupMessege.popup(`Pokémon não encontrado.`, true, true);
                this.searchEl.value = "";
                return;
            }
            return pokemonData;
        }
        catch (erro) {
            console.error(erro);
            if (erro.message === `Erro ao buscar Pokémon com identificador "${pokemonIdentifier}"`) {
                this.popupMessege.popup(`Pokémon não encontrado.`, true, true);
                return;
            }
            this.popupMessege.popup(`Erro ao buscar Pokémon. Verifique sua conexão ou tente mais tarde.`, true, true);
            this.searchEl.value = "";
            return;
        }
    }
    renderPokemon(pokemonData) {
        this._currentPokemonId = pokemonData.id;
        const pokemonType = pokemonData.types[0].type.name;
        this.updatePokedexTop(pokemonData);
        this.updatePokedexData(pokemonData, pokemonType);
        if (!this.isSameType(pokemonType)) {
            this.popupMessege.updateInfoBallonsColors(pokemonType);
            document.body.style.setProperty("--pokemonTypeColor", `rgb(var(--${pokemonType}))`);
        }
    }
    isSameType(type) {
        if (type === this.lastPokemonType) {
            return true;
        }
        else {
            this.lastPokemonType = type;
            return false;
        }
    }
    updatePokedexTop(pokemonData) {
        this.pokemonIdNumberEl.innerHTML = "#" + pokemonData.id.toString().padStart(3, "0");
        this.pokemonImageEl.src = pokemonData.sprites.other.home.front_default;
    }
    updatePokedexData(pokemonData, pokemonType) {
        this.typesContainerEl.innerHTML = " ";
        pokemonData.types.forEach((t, i) => {
            const type = t.type.name;
            let newTypeEl = createElement("span", "type");
            if (i > 0) {
                newTypeEl.style.backgroundColor = `rgb(var(--${type}))`;
            }
            newTypeEl.innerHTML = type;
            this.typesContainerEl.appendChild(newTypeEl);
        });
        pokemonData.stats.forEach((s, i) => {
            this.statNumberList[i].innerHTML = s.base_stat.toString().padStart(3, "0");
            this.statInnerBarList[i].style.width = s.base_stat + `%`;
            this.statOuterBarList[i].style.backgroundColor = `rgba(var(--${pokemonType}) / var(--alphaType))`;
        });
    }
    removeListeners() {
        this.btnNextEl.removeEventListener("click", () => this.pokedexHelper.callNextPokemonFn(this.currentPokemonid, this.lastPokemonId, this.pokemonRepository.getPokemon, this.searchEl));
        this.btnPrevEl.removeEventListener("click", () => this.pokedexHelper.callPreviousPokemonFn(this.currentPokemonid, this.lastPokemonId, this.pokemonRepository.getPokemon, this.searchEl));
    }
    get currentPokemonid() {
        return this._currentPokemonId;
    }
    get lastPokemonId() {
        return this._lastPokemonId;
    }
    get lastPokemonType() {
        return this._lastPokemonType;
    }
    get pokemonRepository() {
        return this._pokemonRepository;
    }
    get pokedexHelper() {
        return this._pokedexHelper;
    }
    get popupMessege() {
        return this._popup;
    }
    set currentPokemonId(newId) {
        this._currentPokemonId = newId;
    }
    set lastPokemonType(newType) {
        this._lastPokemonType = newType;
    }
}
