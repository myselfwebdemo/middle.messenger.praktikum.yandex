import type Block from "core/Block";
import { StoreEvents } from "../core/storage";

// @ts-ignore
export function linkStorage(pageState) {
    return function (block: Block) {
        // @ts-ignore
        return class extends block {
            private dispatchDataUpdate: () => void;

            // @ts-ignore
            constructor(props) {
                // @ts-ignore
                const store = window.storage;

                let objState = pageState(store.take());

                super({...props, ...objState});

                this.dispatchDataUpdate = () => {
                    const newState = pageState(store.take());

                    if (objState === newState) {
                        // @ts-ignore
                        this.setProps({ ...newState });
                    }

                    objState = newState;
                };

                store.on(StoreEvents.Updated, this.dispatchDataUpdate);
            }

            componentWillUnmount() {
                super.componentWillUnmount();
                // @ts-ignore
                window.store.off(StoreEvents.Updated, this.dispatchDataUpdate);
            }
        };
    };
}
