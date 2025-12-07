import { expect } from 'chai';
import sinon from 'sinon';
import { JSDOM } from 'jsdom';
import Router from './router.ts';
import Route from './route.ts';
import Block from './Block.ts';

describe('Router module', () => {
    let router: Router;
    let jsdom: JSDOM;
    let mockHistory: any;

    class FakeBlock extends Block<any> {
        constructor(props: any) {
            super(props);
        }
    }

    beforeEach(() => {
        jsdom = new JSDOM('<!DOCTYPE html><div id="app"></div>', { url: 'http://localhost/' });
        (globalThis as any).window = jsdom.window;
        (globalThis as any).document = jsdom.window.document;
    
        (Router as any)._instance = null;
    
        mockHistory = {
            pushState: sinon.spy(),
            back: sinon.spy(),
            forward: sinon.spy()
        };
        sinon.stub(window, 'history').value(mockHistory);
    
        (window.location as any).pathname = '/';
    
        sinon.stub(Route.prototype, 'render').callsFake(() => {});
        sinon.stub(Route.prototype, 'leave').callsFake(() => {});
        sinon.stub(Route.prototype, 'match').callsFake(function (this: Route<any>, path: string) {
            return path === (this as any)._pathname;
        });
    
        router = new Router('#app');
    });

    afterEach(() => {
        sinon.restore();
        delete (globalThis as any).window;
        delete (globalThis as any).document;
    });

    it('use() should register a new route', () => {
        router.use('/test', FakeBlock, {});
        const route = router.getRoute('/test');
        expect(route).to.exist;
    });

    it('start() should call _onRoute() with current pathname', () => {
        const spy = sinon.stub(router as any, '_onRoute');
        router.start();
        expect(spy.calledWith('/')).to.be.true;
    });

    it('go() should pushState and call _onRoute()', () => {
        const onRouteSpy = sinon.stub(router as any, '_onRoute');
        router.go('/profile');

        expect((mockHistory.pushState as sinon.SinonSpy).calledOnce).to.be.true;
        expect((mockHistory.pushState as sinon.SinonSpy).args[0][2]).to.equal('/profile');
        expect(onRouteSpy.calledWith('/profile')).to.be.true;
    });

    it('back() should call history.back()', () => {
        router.back();
        expect((mockHistory.back as sinon.SinonSpy).calledOnce).to.be.true;
    });

    it('forward() should call history.forward()', () => {
        router.forward();
        expect((mockHistory.forward as sinon.SinonSpy).calledOnce).to.be.true;
    });

    it('getRoute() should return route with matching pathname', () => {
        router.use('/abc', FakeBlock, {});
        const found = router.getRoute('/abc');
        expect(found).to.exist;
    });
});
