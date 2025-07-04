
export function setNavigationControlsKeys(callPreviousPkmFn: () => void, callNextPkmFn: () => void){ 
    const pokedex = document.getElementById("pokedex")
    document!.addEventListener("keydown", (e) => {
        if(!pokedex){
            return
        }
        switch(e.key){
            case 'ArrowRight':
                callNextPkmFn()
                break
            case 'ArrowLeft':
                callPreviousPkmFn()
                break
            default:
                break
        }
    })
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