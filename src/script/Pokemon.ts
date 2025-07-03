export interface Pokemon {
    abilities:                any[];
    base_experience:          number;
    cries:                    {};
    forms:                    any[];
    game_indices:             any[];
    height:                   number;
    held_items:               any[];
    id:                       number;
    is_default:               boolean;
    location_area_encounters: string;
    moves:                    any[];
    name:                     string;
    order:                    number;
    past_abilities:           any[];
    past_types:               any[];
    species:                  {};
    sprites:                  Sprites;
    stats:                    any[];
    types:                    any[];
    weight:                   number;
}

export interface Other {
    dream_world:        DreamWorld;
    home:               Home;
    "official-artwork": OfficialArtwork;
    showdown:           Sprites;
}

export interface Sprites {
    back_default:       string;
    back_female:        null;
    back_shiny:         string;
    back_shiny_female:  null;
    front_default:      string;
    front_female:       null;
    front_shiny:        string;
    front_shiny_female: null;
    other?:             Other;
    versions?:          {};
}

export interface DreamWorld {
    front_default: string;
    front_female:  null;
}

export interface Home {
    front_default:      string;
    front_female:       null;
    front_shiny:        string;
    front_shiny_female: null;
}

export interface OfficialArtwork {
    front_default: string;
    front_shiny:   string;
}