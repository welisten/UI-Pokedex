import { PopUpAdapter } from "../PopupAside";
import Pokedex from "./Pokedex";
import "./../../styles/index.scss";
const informationsContainer = document.getElementById("informations");
if (!informationsContainer)
    throw new Error("Impossivel intanciar PopupAdapter. Pai para o elemento não encontrado");
const popUpAdapter = new PopUpAdapter(informationsContainer);
const pokedex = new Pokedex(1, popUpAdapter);
pokedex.init();
