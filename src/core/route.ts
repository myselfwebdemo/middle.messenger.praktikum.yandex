import { renderWithQuery } from 'core/renderDOM';
import type Block from './Block';

export type BlockConstructor<P extends Record<string, unknown>> = new (props: P) => Block<P>;

export default class Route<P extends Record<string,unknown>> {
    private _pathname: string
    private _blockClass: BlockConstructor<P>;
    private _block: Block<P> | null;
    private _props: { blockProps: P; rootQuery: string }

    constructor(
        pathname: string, 
        view: BlockConstructor<P>, 
        props: { blockProps: P; rootQuery: string }
    ) {
        this._pathname = pathname;
        this._blockClass = view;
        this._block = null;
        this._props = props
    }
    navigate(pathname: string) {
        if (this.match(pathname)) {
            this._pathname = pathname;
            this.render();
        }
    }
    leave() {
        if (this._block) {
            this._block.close();
        }
    }
    match(pathname: string) {
        return pathname === this._pathname;
    }
    render() {
        const { blockProps, rootQuery } = this._props;
        if (!this._block) {
            this._block = new this._blockClass(blockProps);
        }

        renderWithQuery(rootQuery, this._block);
    }
}
