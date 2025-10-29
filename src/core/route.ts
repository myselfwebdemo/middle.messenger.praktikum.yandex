import {render} from 'core/renderDOM';

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
        if (!this._block) {
            this._block = new this._blockClass();
            render(this._props.rootQuery, this._block);
            return;
        }

        this._block.show();
    }
}