import { renderWithQuery } from 'core/renderDOM';
import type Block from './Block';

type BlockConstructor = new (props: Record<string, any>) => Block;

export default class Route {
    private _pathname: string
    private _blockClass: BlockConstructor;
    private _block: Block | null;
    private _props: Record<string, any>

    constructor(
        pathname: string, 
        view: BlockConstructor, 
        props: Record<string, any>
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
            (window as any)[this._blockClass.name] = this._block;
        }

        renderWithQuery(rootQuery, this._block);
    }
}
