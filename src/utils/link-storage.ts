// @ts-nocheck
import type Block from "core/Block";
import { StoreEvents } from "../core/storage";

export function linkStorage(pageState: (s: any) => Record<string, any>) {
    return function <T extends new (...args: any[]) => Block>(block: T) {
        return class extends block {
            private dispatchDataUpdate: () => void;
            
            constructor(...args: any[]) {
                const props = args[0] || {};
                const store = window.memory;
                let objState = pageState(store.take());

                super({...props, ...objState});

                this.dispatchDataUpdate = () => {
                    const newState = pageState(store.take());
                    
                    const changed = Object.keys(newState).some(
                        key => newState[key] !== objState[key]
                    );
                    if (changed) {
                        this.setProps({ ...newState });
                        objState = newState;
                    }
                };

                store.on(StoreEvents.Updated, this.dispatchDataUpdate);
            }

            componentWillUnmount() {
                super.componentWillUnmount();

                window.memory.off(StoreEvents.Updated, this.dispatchDataUpdate);
            }
        };
    };
}
