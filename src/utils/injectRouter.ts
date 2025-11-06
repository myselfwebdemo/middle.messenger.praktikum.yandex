import type Block from "core/Block"

export function injectRouter(block: typeof Block) {
    return class extends block {
        // @ts-ignore
        constructor(props) {
            // @ts-ignore
            super({...props, router: window.router})
        }
    }
}
