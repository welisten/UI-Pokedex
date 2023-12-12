const searchEl         = document.querySelector('#search')
const pkmIdNumberEl    = document.querySelector('#number')
const pkmImageEl       = document.querySelector('#pokemon-image')
const typesContainerEl = document.querySelector('#types') 
const pokedexEl        = document.querySelector('#pokedex')
const baseStatsTitleEl = document.querySelector('#base-stat')
const statDescEl       = document.querySelectorAll('.stat-desc')
const statNumberEl     = document.querySelectorAll('.stat-number')
const statInneBarEl    = document.querySelectorAll('.bar-inner')
const statOuterBarEl   = document.querySelectorAll('.bar-outer')
const controlersBtnEl  = document.querySelectorAll('.controlers-btn')
const ballonsInstrucEl = document.querySelectorAll('.ballon-instruc')
const btnPrevEl        = document.querySelector('.btnPrev')
const btnNextEl        = document.querySelector('.btnNext')

let currentPokemonId = 1

const typesColor = {
    "rock":     [182, 158,  49],
    "ghost":    [112,  85, 155],
    "steel":    [183, 185, 208],
    "water":    [100, 147, 235],
    "grass":    [116, 203,  72],
    "psychic":  [251,  85, 132],
    "ice":      [154, 214, 223],
    "dark":     [117,  87,  76],
    "fairy":    [230, 158, 172],
    "normal":   [170, 166, 127],
    "fighting": [193,  34,  57],
    "flying":   [168, 145, 236],
    "poison":   [164,  62, 158],
    "ground":   [222, 193, 107],
    "bug":      [167, 183,  35],
    "fire":     [245, 125,  49],
    "electric": [249, 207,  48],
    "dragon":   [112,  55, 255]
}


const fetchAPI = async (pokemonName) => {
    // Joing pokemon names that has more than one word
    const pokemonNameApi = pokemonName.split(' ').join('-')

    const response    = await fetch('https://pokeapi.co/api/v2/pokemon/' + pokemonNameApi)
    
    if(response.status == 200){
        const pokemonData = await response.json() 
        return pokemonData
    }

    return false
}

searchEl.addEventListener("change", async (event) => {
     const pokemonName = event.target.value.toLowerCase()
     // 1 - buscar valor na api
    const pokemonData = await fetchAPI(pokemonName)
    if(!pokemonData) {// validation when pokemon does not exist
        alert('Pokemon does not exist') 
        event.target.value = ''
        return
    }
    const mainColor = typesColor[pokemonData.types[0].type.name]
    pokedexEl.style.backgroundColor  = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})` 
    baseStatsTitleEl.style.color     = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})` 
   
    // 2 - Atualizar pkmIdNumberEl
    pkmIdNumberEl.innerHTML = '#' + pokemonData.id.toString().padStart(3, '0')
    currentPokemonId = pokemonData.id

    // 3 - Atualizar pkmImageEl
    pkmImageEl.src = pokemonData.sprites.other.home.front_default

    // 4 - atualizar typesContainerEl (pode haver mais d um tipo)
    typesContainerEl.innerHTML = ' '
    pokemonData.types.forEach((t) => {
       let newType = document.createElement('span')
       let colors = typesColor[t.type.name]
       
       newType.innerHTML = t.type.name
       newType.classList.add('type')
       newType.style.backgroundColor = `rgb(${colors[0]}, ${colors[1]}, ${colors[2]})`

       typesContainerEl.appendChild(newType)  
       
    });

    //Atualizar .stat-number, .inner-bar, .outerbar e .stat-desc
    pokemonData.stats.forEach((s, i ) => {
        statNumberEl[i].innerHTML               = s.base_stat.toString().padStart(3, '0')
        statInneBarEl[i].style.width            = s.base_stat + `%`
        statInneBarEl[i].style.backgroundColor  = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})` 
        statOuterBarEl[i].style.backgroundColor = `rgba(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]}, 0.3)`
        statDescEl[i].style.color               = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})` 
        
    })
     //Atualizar botoes de controle
      controlersBtnEl.forEach((btn, i ) => {
        btn.style.backgroundColor = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`
        
    })
     //Atualizar balões de intruções
      ballonsInstrucEl.forEach((ballon, i ) => {
        ballon.style.backgroundColor = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]}, 0.589)`
        
    })
})

btnPrevEl.addEventListener('click', async (e) => {
        if(currentPokemonId !== 1){
            --currentPokemonId
            const pokemonData = await fetchAPI(currentPokemonId.toString())
            const eventoChange = new Event('change')
            searchEl.value =  pokemonData.name
            searchEl.dispatchEvent(eventoChange)
        }
    }
)
btnNextEl.addEventListener('click', async (e) => {
        if(currentPokemonId < 906){
            ++currentPokemonId
            const pokemonData = await fetchAPI(currentPokemonId.toString())
            const eventoChange = new Event('change');
            searchEl.value =  pokemonData.name
            searchEl.dispatchEvent(eventoChange)
            
        }
    }
)