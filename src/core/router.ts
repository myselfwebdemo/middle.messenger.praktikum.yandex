import { Routes } from "../main.ts";
import Route, { type BlockConstructor } from "./route.ts";

export default class Router {
    private static _instance: Router | null = null;
    private routes: Route<any>[] = [];
    private history: History = window.history;
    private _currentRoute: Route<Record<string,unknown>> | null = null;
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
    use<P extends Record<string,unknown>>(pathname: string, block: BlockConstructor<P>, blockProps: P) {
        const newRouteInstance = new Route<P>(pathname, block, {
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
    getRoute(pathname: string) {
        return this.routes.find(route => route.match(pathname));
    }
}
