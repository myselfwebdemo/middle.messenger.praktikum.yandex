import Route from "./route";

export default class Router {
    private static _instance: Router | null = null;
    // @ts-ignore
    private routes: Router[];
    // @ts-ignore
    private history: History;
    private _currentRoute: any;
    // @ts-ignore
    private _rootQuery: string;

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
    use(pathname: string, block: any, blockProps: Record<string, string> = {}) {
        const newRouteInstance = new Route(pathname, block, {
            rootQuery: this._rootQuery,
            // @ts-ignore
            blockProps: blockProps
        });

        // @ts-ignore
        this.routes.push(newRouteInstance);
        return this;
    }
    start() {
        window.onpopstate = () => {
            // @ts-ignore
            this._onRoute(window.location.pathname);
        };
        this._onRoute(window.location.pathname);
    }
    _onRoute(pathname: string) {
        const route = this.getRoute(pathname);
        if (!route) {
            return this.go('/not-found');
        }
    
        if (this._currentRoute) {
            this._currentRoute.leave();
        }
    
        // @ts-ignore
        route.render();
    }
    go(pathname: string) {
        this.history.pushState({}, "", pathname);
        this._onRoute(pathname);
    }
    back() {
        this.history.back();
    }
    forward() {
        this.history.forward();
    }
    getRoute(pathname:  string) {
        // @ts-ignore
        return this.routes.find(route => route.match(pathname));
    }
}
