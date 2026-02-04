import Block from './Block.ts';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('Block module', () => {
  let TestComponent: any;

  beforeEach(() => {
    class Page extends Block {
      constructor(props: any = {}) {
        super('div', props);
      }

      render() {
        return `
          <div>
            <span id='text'>{{text}}</span>
            <button id='btn'>{{buttonText}}</button>
          </div>
        `;
      }
    }

    TestComponent = Page;
  });

  it('creates component with initial props', () => {
    const page = new TestComponent({ text: 'Hello' });
    const text = page.element?.querySelector('#text')?.innerHTML;

    expect(text).to.equal('Hello');
  });

  it('updates DOM when props change (reactivity)', () => {
    const page = new TestComponent({ text: 'Initial' });

    page.setProps({ text: 'Updated' });
    const text = page.element?.querySelector('#text')?.innerHTML;

    expect(text).to.equal('Updated');
  });

  it('calls componentDidUpdate when props change', () => {
    const page = new TestComponent({ text: 'Initial' });
    const spy = sinon.spy(page, 'componentDidUpdate');

    page.setProps({ text: 'Changed' });

    expect(spy.calledOnce).to.be.true;
  });

  it('attaches DOM events from props', () => {
    const handler = sinon.stub();
    const page = new TestComponent({
      events: { click: handler },
    });

    const evt = new window.MouseEvent('click', { bubbles: true });
    page.element?.dispatchEvent(evt);

    expect(handler.calledOnce).to.be.true;
  });

  it('removes events and reattach them after rerender', () => {
    const handler = sinon.stub();
    const page = new TestComponent({
      events: { click: handler },
    });

    const firstEventListeners = handler.callCount;

    page.setProps({ text: 'new' });

    const evt = new window.MouseEvent('click', { bubbles: true });
    page.element?.dispatchEvent(evt);

    expect(handler.callCount).to.equal(firstEventListeners + 1);
  });

  it('calls componentDidMount when dispatched', () => {
    const page = new TestComponent({});
    const spy = sinon.spy(page, 'componentDidMount');

    page.dispatchComponentDidMount();

    expect(spy.calledOnce).to.be.true;
  });

  it('returns the root DOM element via getContent', () => {
    const page = new TestComponent({});
    expect(page.getContent()).to.equal(page.element);
  });

  it('shows the component (display: flex)', () => {
    const page = new TestComponent({});
    page.show();
    expect(page.element?.style.display).to.equal('flex');
  });

  it('hides the component (display: none)', () => {
    const page = new TestComponent({});
    page.close();
    expect(page.element?.style.display).to.equal('none');
  });

  it('adds a child component', () => {
    const parent = new TestComponent({});
    const child = new TestComponent({});

    parent.addChildren(child, 'child1');

    expect(parent.children['child1']).to.equal(child);
  });

  it('prepends a child component', () => {
    const parent = new TestComponent({});
    const a = new TestComponent({});
    const b = new TestComponent({});

    parent.addChildren(a, 'A');
    parent.prependChildren(b, 'B');

    const keys = Object.keys(parent.children);

    expect(keys[0]).to.equal('B');
  });

  it('removes an existing child', () => {
    const parent = new TestComponent({});
    const child = new TestComponent({});

    parent.addChildren(child, 'child1');
    parent.removeChildren('child1');

    expect(parent.children['child1']).to.be.undefined;
  });

  it('throws when removing nonexistent child', () => {
    const parent = new TestComponent({});
    expect(() => parent.removeChildren('nope')).to.throw();
  });

  it('throws if trying to delete a prop via proxy', () => {
    const page = new TestComponent({ text: 'Hello' });

    expect(() => {
      delete page.props.text;
    }).to.throw('Access denied');
  });
});
