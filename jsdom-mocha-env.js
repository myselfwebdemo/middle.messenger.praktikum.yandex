import { JSDOM } from "jsdom";
import sinon from "sinon";

const dom = new JSDOM("<!doctype html><html><body><div id='app'></div></body></html>", { url: 'http://localhost' });

global.window = dom.window;
global.document = dom.window.document;
global.Node = dom.window.Node;
global.MouseEvent = dom.window.MouseEvent;
global.HTMLElement = dom.window.HTMLElement;
globalThis.XMLHttpRequest = dom.window.XMLHttpRequest;
globalThis.FormData = dom.window.FormData;

globalThis.sinon = sinon;
globalThis.window.memory = {
    take: () => ({ user: { id: 1, name: 'Test' } }),
    give: () => {}
  };
  globalThis.window.router = {};
  
  sinon.stub(globalThis.window, 'history').value({
    pushState: sinon.spy(),
    back: sinon.spy(),
    forward: sinon.spy()
});

