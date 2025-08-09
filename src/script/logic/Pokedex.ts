/** Proximas Implementações
 *  - carregamento inicial dinâmico
 *  - adição do nome do pokemon ao pokedexData
 *  - desacloplar construindo uma pokedexBuilder
 *  - ThemeManeger para controle de css inline
 *  - atualizar animações para requestAnimationFrame
 */

import { setNavigationControlsKeys, PokedexHelper, createElement} from "../appUtils";
import { imagesSrc, PokemonType } from "../Data";
import { Pokemon } from "../Pokemon";
import {IPopup} from "../PopupAside"
import { PokemonRepository } from "./PokemonRepository";

export default class Pokedex {
  private _currentPokemonId: number;
  private _lastPokemonId: number = 1025;
  private _lastPokemonType: PokemonType | undefined
  private _pokemonRepository: PokemonRepository = new PokemonRepository()
  private _popup: IPopup
  private _pokedexHelper: PokedexHelper

  public readonly pokedexEl: HTMLDivElement = createElement("div", "", "pokedex");
  public readonly controllers: HTMLDivElement = createElement("div", "", "controllers");
  public readonly searchEl: HTMLInputElement = createElement("input", "", "search");
  public readonly pokemonIdNumberEl: HTMLSpanElement = createElement("span", "", "number");
  public readonly pokemonImageEl: HTMLImageElement = createElement("img", "", "pokemon-image");
  public readonly typesContainerEl: HTMLDivElement = createElement("div", "", "types");
  public readonly baseStatsTitleEl: HTMLHeadingElement = createElement("h4", "", "base-stat");
  public readonly informationContainerEl = document.getElementById("informations");
  public btnPrevEl: HTMLSpanElement = createElement("span", "controllers-btn btnPrev", "mainBtnPrev");
  public btnNextEl: HTMLSpanElement = createElement("span", "controllers-btn btnNext", "mainBtnNext");
  public statDescList: HTMLDivElement[] = [];
  public statNumberList: HTMLDivElement[] = [];
  public statInnerBarList: HTMLDivElement[] = [];
  public statOuterBarList: HTMLDivElement[] = [];

  private prevClickHandler: EventListener = async () => {
    await this.pokedexHelper.callPreviousPokemonFn(
      this.currentPokemonId,
      this.lastPokemonId,
      this.pokemonRepository.getPokemon.bind(this.pokemonRepository),
      this.searchEl
    )
  }

  private nextClickHandler: EventListener = async () => {
    await this.pokedexHelper.callNextPokemonFn(
      this.currentPokemonId,
      this.lastPokemonId,
      this.pokemonRepository.getPokemon.bind(this.pokemonRepository),
      this.searchEl
    ) 
  }

  constructor(initialId: number = 1, popup:IPopup) {
    let aux = initialId

    if(initialId === 1){
      this.lastPokemonType = 'grass'
    }else{
      true 
      // Implementar nas proximas sprites
    }
    if (initialId <= 0)
      aux = 1;
    
    if (initialId > this.lastPokemonId)
      aux = this.lastPokemonId;

    this._currentPokemonId = aux;
    this._popup = popup
    this._pokedexHelper = new PokedexHelper(this.popupMessege)
  }

  init(){
    this.buildPokedex("pokedexScreen")
    this.setPokedexElements()
    this.popupMessege.popup("Procure pelo Pokemon desejado na barra de pesquisas")
    this.popupMessege.popup("Voce também pode pesquisar através do número de identificação do Pokemon")
  }

  buildPokedex(containerId: string): void {
    this.buildPkdexDisplay(containerId);
    this.buildPkdexControls(containerId);
  }

  private buildPkdexDisplay(containerId: string):void {
    const mainFather_EL = document.getElementById(containerId);
    
    if (!mainFather_EL){
      throw new Error("Elemento pai da pokedex não foi encontrado");
    }
    
    const top_El = this.buildPkdexTopInterface()
    const dataEl = this.buildPkdexDataInterface()
    
    this.pokedexEl.append(top_El, dataEl);
    mainFather_EL.append(this.pokedexEl);
  }
  
  private buildPkdexControls(containerId: string): void {
    const mainFather_EL = document.getElementById(containerId);

    if (!mainFather_EL){
      throw new Error("Elemento pai da pokedex não foi encontrado");
    }

    const iconChevronLeft = createElement("i", "fa-solid fa-chevron-left");
    const iconChevronRight = createElement( "i", "fa-solid fa-chevron-right");

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
  private buildPkdexTopInterface(): HTMLDivElement{
    const top_El = createElement("div", "", "top");

    const topBar_El = createElement("div", "", "top-bar");
    const searchBar_El = createElement("div", "searchBar");
    this.searchEl.setAttribute("type", "text");
    this.searchEl.setAttribute("value", "bulbasaur");
    const glassIcon_El = createElement("i","fa-solid fa-magnifying-glass");
    const pokeImagePlaceholder_El = createElement( "div", "", 'poke-image-placeholder');
    this.pokemonImageEl.src = imagesSrc.default;
    this.pokemonImageEl.alt = "bulbasaur";
    this.pokemonIdNumberEl.innerText = "#001";

    searchBar_El.append(this.searchEl, glassIcon_El);
    topBar_El.append(searchBar_El, this.pokemonIdNumberEl);
    pokeImagePlaceholder_El.appendChild(this.pokemonImageEl);
    top_El.append(topBar_El, pokeImagePlaceholder_El);
    return top_El
  }
  private buildPkdexDataInterface(): HTMLDivElement{
    const dataEl = createElement("div", "", "data");
    
    // Types
    this.typesContainerEl.append(...this.pokedexHelper.buildTypes(["grass", "poison"]))
    dataEl.append(this.typesContainerEl)
    
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
    ]

    statsList.forEach((s,i) => {
      const statRowElements = this.pokedexHelper.buildStatRow(s.stat, s.value)
      statsEl.append(statRowElements.row)
      this.statDescList.push(statRowElements.desc)
      this.statNumberList.push(statRowElements.number)
      this.statInnerBarList.push(statRowElements.inneBar)
      this.statOuterBarList.push(statRowElements.outerBar)
    })

    dataEl.append(this.baseStatsTitleEl, statsEl);
    return dataEl
  }


  setPokedexElements(): void {
    this.setPkdexDisplayElements();
    this.setPkdexControlsElements();
  }

  private setPkdexDisplayElements(): void { 
    this.searchEl.addEventListener("change", async (event) => {
      const target = event.target as HTMLInputElement;
      const pokemonIdentifier = target.value;
      
      //validação
      try{
        this.pokedexHelper.validateSearchValue(pokemonIdentifier, this.lastPokemonId)
      } catch(e:any){
        if(e.message === "Identificador fora do intervalo permitido"){
          this.popupMessege.popup(
            `Os identificadores de Pokemon vão de <b alert>1</b> a <b alert>${this.lastPokemonId}</b>. Selecione uma opção dentro do intervalo!`,
            false,
            true
          )
          target.value = "";
        }
        return
      }

      const pokemonData = await this.loadPokemon(pokemonIdentifier)
      if(pokemonData){
        this.renderPokemon(pokemonData)
      }
    });
  }
  private setPkdexControlsElements(): void {
    this.btnNextEl.addEventListener( "click", this.nextClickHandler);
    this.btnPrevEl.addEventListener( "click", this.prevClickHandler)

    setNavigationControlsKeys(
      async () => this.pokedexHelper.callPreviousPokemonFn(
        this.currentPokemonId,
        this.lastPokemonId,
        this.pokemonRepository.getPokemon.bind(this.pokemonRepository),
        this.searchEl
      ),
      async () => this.pokedexHelper.callNextPokemonFn(
        this.currentPokemonId,
        this.lastPokemonId,
        this.pokemonRepository.getPokemon.bind(this.pokemonRepository),
        this.searchEl
      )
    )
  }

  private async loadPokemon(pokemonIdentifier: string){
    try{
      const pokemonData: Pokemon | undefined = await this.pokemonRepository.getPokemon(pokemonIdentifier);
      if (!pokemonData) {
        this.popupMessege.popup(`Pokémon não encontrado.`, true, true)
        this.searchEl.value = "";
        return;
      }
      return pokemonData
    } catch(erro: any){
      console.error(erro)
      if(erro.message === `Erro ao buscar Pokémon com identificador "${pokemonIdentifier}"`){
        this.popupMessege.popup(`Pokémon não encontrado.`, true, true)
        this.searchEl.value = "";
        return
      }
      this.popupMessege.popup(
        `Erro ao buscar Pokémon. Verifique sua conexão ou tente mais tarde.`,
        true,
        true
      )
      this.searchEl.value = "";
      return;
    }
  }
  private renderPokemon(pokemonData: Pokemon){
      this._currentPokemonId = pokemonData.id;
      const pokemonType = pokemonData.types[0].type.name as PokemonType
      
      this.updatePokedexTop(pokemonData)
      this.updatePokedexData(pokemonData, pokemonType)
      
      if(!this.isSameType(pokemonType)){
        this.popupMessege.updateInfoBallonsColors(pokemonType)
        document.body.style.setProperty("--pokemonTypeColor", `rgb(var(--${pokemonType}))`)
      }
  }
  private isSameType(type: PokemonType): boolean{
    if(type === this.lastPokemonType){
      return true 
    } else {
      this.lastPokemonType = type
      return false
    }
  }
  private updatePokedexTop(pokemonData: Pokemon): void {
      this.pokemonIdNumberEl.innerHTML = "#" + pokemonData.id.toString().padStart(3, "0");
      this.pokemonImageEl.src = pokemonData.sprites.other!.home.front_default ;
  }
  private updatePokedexData(pokemonData: Pokemon, pokemonType: PokemonType): void { 
    this.typesContainerEl.innerHTML = " ";
    
    pokemonData.types.forEach((t, i) => {
      const type  = t.type.name     
      let newTypeEl = createElement("span", "type");
      
      if(i>0) { // se houver um segundo tipo, atualiza a cor
        newTypeEl.style.backgroundColor = `rgb(var(--${type}))`;
      }
      
      newTypeEl.innerHTML = type
      this.typesContainerEl.appendChild(newTypeEl);
    });
    
    pokemonData.stats.forEach((s, i) => {
        this.statNumberList[i].innerHTML = s.base_stat.toString().padStart(3, "0");
        this.statInnerBarList[i].style.width = s.base_stat + `%`;
        this.statOuterBarList[i].style.backgroundColor = `rgba(var(--${pokemonType}) / var(--alphaType))`;
    });
  }
  private removeListeners():void{
    this.btnNextEl.removeEventListener("click", this.nextClickHandler)
    this.btnPrevEl.removeEventListener("click", this.prevClickHandler)
  }

  get currentPokemonId(): number {
    return this._currentPokemonId;
  }
  get lastPokemonId(): number {
    return this._lastPokemonId;
  }
  get lastPokemonType():PokemonType|undefined {
    return this._lastPokemonType
  }
  get pokemonRepository():PokemonRepository{
      return this._pokemonRepository
  }
  get pokedexHelper():PokedexHelper{
      return this._pokedexHelper
  }
  get popupMessege(): IPopup{
    return this._popup
  }
  set currentPokemonId(newId: number) {
    this._currentPokemonId = newId;
  }
  set lastPokemonType(newType:PokemonType){
    this._lastPokemonType = newType
  }
}
