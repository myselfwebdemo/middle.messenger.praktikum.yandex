import EventBus from "./EventBus";

export enum StoreEvents {
    Updated = "Updated",
}
export class Storage extends EventBus<StoreEvents> {
    private static _instance: Storage;
    private state = {};

    constructor(defaultState = {}) {
        if (Storage._instance) {
            return Storage._instance;
        }

        super();
        this.state = defaultState;

        Storage._instance = this;
    }
    public take() {
        return this.state;
    }
    public give(newState: Partial<MemoryBI>) {
        const last = {...this.state};

        this.state = {...this.state, ...newState};

        this.emit(StoreEvents.Updated, last, this.state);
    }
}
