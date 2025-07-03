export function setDirectionControlsKeys(callPreviousPkmFn, callNextPkmFn) {
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
export function updateInfoBallonsColors(mainColor) {
    const ballonsInstrucEl = document.querySelectorAll(".info-ballon");
    if (ballonsInstrucEl.length <= 0)
        throw new Error("Pop-ups não encontrados !");
    ballonsInstrucEl.forEach((ballon) => {
        ballon.style.backgroundColor = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]}, 0.589)`;
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
