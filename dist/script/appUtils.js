export function setNavigationControlsKeys(callPreviousPkmFn, callNextPkmFn) {
    const pokedex = document.getElementById("pokedex");
    document.addEventListener("keydown", (e) => {
        if (!pokedex) {
            return;
        }
        switch (e.key) {
            case 'ArrowRight':
                callNextPkmFn();
                break;
            case 'ArrowLeft':
                callPreviousPkmFn();
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
