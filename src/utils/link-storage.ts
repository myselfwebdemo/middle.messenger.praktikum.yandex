import type Block from "core/Block";
import { StoreEvents } from "../core/storage";

// Mixim Rule:  In TypeScript, when working with mixins, the constructor of the mixin class must have a rest parameter typed as any[]. 
//              This is because the mixin needs to be compatible with any possible subclass constructor signature, 
//              and any[] is the only type that can accommodate all possible argument lists.

export function linkStorage<P extends Record<string,unknown>>(pageState: (memoryData: MemoryBI) => Partial<P>) {
    return function <T extends new (...props: any[] /* [TS] mixim rule */) => Block>(block: T) {
        return class extends block {
            private dispatchDataUpdate: () => void;
            
            constructor(...args: any[] /* [TS] mixim rule */) {
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
