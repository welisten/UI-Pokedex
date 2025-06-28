export default class Pokedex{
    private _id: number;
    constructor(initialId: number = 0){
        if(initialId < 0 ){
            this._id = 0 
        } else if(initialId < 1025 ){
            this._id = 1025
        } else {
            this._id = initialId
        }

    }

    get id(): number {
        return this._id
    }

    set id(newId: number){
        this._id = newId
    }
}