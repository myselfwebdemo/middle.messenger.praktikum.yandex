import { Routes } from "main";
import type Block from "./Block";
import Route from "./route";

export default class Router {
    private static _instance: Router | null = null;
    private routes: Route[] = [];
    private history: History = window.history;
    private _currentRoute: Route | null = null;
    private _rootQuery: string = '';

    constructor(rootQuery: string) {
        if (Router._instance) {
            return Router._instance
        }
        this.routes = [];
        this.history = window.history;
        this._currentRoute = null;
        this._rootQuery = rootQuery;
    
        Router._instance = this;
    }
    use(pathname: string, block: new (props: Record<string, any>) => Block, blockProps: Record<string, any> = {}) {
        const newRouteInstance = new Route(pathname, block, {
            rootQuery: this._rootQuery,
            blockProps: blockProps
        });

        this.routes.push(newRouteInstance);
        return this;
    }
    start() {
        window.onpopstate = () => {
            this._onRoute(window.location.pathname);
        };
        this._onRoute(window.location.pathname);
    }
    _onRoute(pathname: string) {
        const route = this.getRoute(pathname);
        if (!route) {
            return this.go(Routes.E404);
        }
    
        if (this._currentRoute) {
            this._currentRoute.leave();
        }
    
        route.render();
    }
    go(pathname: string) {
        this.history.pushState({}, `${pathname}`, pathname);
        this._onRoute(pathname);
    }
    back() {
        this.history.back();
    }
    forward() {
        this.history.forward();
    }
    getRoute(pathname:  string) {
        return this.routes.find(route => route.match(pathname));
    }
}
