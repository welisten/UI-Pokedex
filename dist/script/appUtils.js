export function setNavigationControlsKeys(callPreviousPokemonFn, callNextPokemonFn) {
    const pokedex = document.getElementById("pokedex");
    document.addEventListener("keydown", (e) => {
        if (!pokedex) {
            return;
        }
        switch (e.key) {
            case 'ArrowRight':
                callNextPokemonFn();
                break;
            case 'ArrowLeft':
                callPreviousPokemonFn();
                break;
            default:
                break;
        }
    });
}
export function createElement(tag, cls, id) {
    const element = document.createElement(tag);
    if (cls) {
        let arr = cls.split(" ");
        arr.forEach((c) => element.classList.add(c));
    }
    if (id)
        element.id = id;
    return element;
}
export class PokedexHelper {
    constructor(popup) {
        this.popupMessege = popup;
    }
    buildStatRow(statName, statValue) {
        const statRowEl = createElement("div", "stat-row");
        const statRowDescEl = createElement("div", "stat-desc");
        const statRowNumberEl = createElement("div", "stat-number");
        const statRowBarEl = createElement("div", "stat-bar");
        const statRowBarInnerEl = createElement("div", "bar-inner");
        const statRowBarOuterEl = createElement("div", "bar-outer");
        statRowDescEl.innerText = statName;
        statRowNumberEl.innerText = statValue.toString().padStart(3, '3');
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
        };
    }
    buildTypes(types) {
        return types.map((type, i) => {
            const typeEl = createElement("span", "type");
            typeEl.style.backgroundColor = i > 0 ? `rgb(var(--${type}))` : `var(--pokemonTypeColor)`;
            typeEl.innerText = type;
            return typeEl;
        });
    }
    validateSearchValue(value, lastPokemonId) {
        const trimmed = value.trim();
        const isPositiveInt = /^\d+$/.test(trimmed);
        if (isPositiveInt) {
            if (parseInt(value) > lastPokemonId || parseInt(value) < 1) {
                throw new Error("Identificador fora do intervalo permitido");
            }
        }
    }
    ;
    async callPreviousPokemonFn(currentId, lastPokemonId, getPokemon, search) {
        try {
            currentId = currentId > 1 ? currentId - 1 : lastPokemonId;
            const pokemonData = await getPokemon(currentId.toString());
            const eventoChange = new Event("change");
            search.value = pokemonData.name;
            search.dispatchEvent(eventoChange);
        }
        catch (erro) {
            console.error(erro);
            this.popupMessege.popup(`Erro ao buscar Pokémon. Verifique sua conexão ou tente mais tarde.`, true, true);
            return;
        }
    }
    async callNextPokemonFn(currentId, lastPokemonId, getPokemon, search) {
        try {
            currentId = currentId < lastPokemonId ? currentId + 1 : 1;
            const pokemonData = await getPokemon(currentId.toString());
            const eventoChange = new Event("change");
            search.value = pokemonData.name;
            search.dispatchEvent(eventoChange);
        }
        catch (erro) {
            console.log(erro);
            this.popupMessege.popup(`Erro ao buscar Pokémon. Verifique sua conexão ou tente mais tarde.`, true, true);
            return;
        }
    }
}
export class RepositoryHelper {
    static isPositiveInteger(identifier) {
        return /^\d+$/.test(identifier.trim());
    }
}
