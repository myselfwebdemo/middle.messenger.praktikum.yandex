import { renderWithQuery } from 'core/renderDOM';

export default class Route {
    private _pathname: string
    private _blockClass: any
    private _block: any
    private _props: Record<string, string>

    constructor(
        pathname: string, 
        view: string, 
        props: Record<string, string>
    ) {
        this._pathname = pathname;
        this._blockClass = view;
        this._block = null;
        this._props = props;
    }
    navigate(pathname: string) {
        if (this.match(pathname)) {
            this._pathname = pathname;
            this.render();
        }
    }
    leave() {
        if (this._block) {
            this._block.hide();
        }
    }
    match(pathname: string) {
        return pathname === this._pathname;
    }
    render() {
        const { blockProps, rootQuery } = this._props;
        if (!this._block) {
            this._block = new this._blockClass(blockProps);

            window[this._blockClass.name] = this._block;
        }

        renderWithQuery(rootQuery, this._block);
    }
}
