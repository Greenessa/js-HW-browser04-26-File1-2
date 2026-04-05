export default class SaveInStorage {
    constructor(storage) {
        this.storage = storage;
    }

    setInStorage (obj) {
        this.storage.setItem('currentState', JSON.stringify(obj))
    }

    getFromStorage () {
        try {
            return JSON.parse(this.storage.getItem('currentState'));
        } catch (error) {
            throw new Error('Invalid state');
        }
    }

    clearStorage () {
        this.storage.clear('currentState');
    }
}


