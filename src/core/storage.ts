import EventBus from "./eventBus";

export enum StoreEvents {
    Updated = "Updated",
}
// @ts-ignore
export class Storage extends EventBus {
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
    public give(newState: Record<string, any>) {
        const last = {...this.state};

        this.state = {...this.state, ...newState};

        // @ts-ignore
        this.emit(StoreEvents.Updated, last, this.state);
    }
}
