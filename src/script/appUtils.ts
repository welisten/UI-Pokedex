
export function setDirectionControlsKey(prevId: string, nextId: string, funcPrev: () => void, funcNext: () => void){
    const prevBtn = document.getElementById(prevId)
    const nextBtn = document.getElementById(nextId)
    
    if(!prevBtn || !nextBtn){
        throw new Error("O Botão de controle não foi encontrado")   
    }
    
    document!.addEventListener("keydown", (e) => {
        switch(e.key){
            case 'ArrowRight':
                break
            case 'ArrowLeft':
                break
            default:
                break
        }
    })
}