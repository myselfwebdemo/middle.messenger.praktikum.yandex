import type Block from '../core/Block.ts';

export function injectRouter<T extends new (...args: any[]) => Block>(block: T) {
    return class extends block {
        constructor(...args: any[]) {
            const props = args[0] || {};
            super({ ...props, router: window.router });
        }
    };
}
