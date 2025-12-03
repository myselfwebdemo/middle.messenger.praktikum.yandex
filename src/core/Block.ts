import EventBus from "./EventBus";
import { nanoid } from "nanoid";
import Handlebars from "handlebars";

type BlockEvents = "init" | "flow:component-did-mount" | "flow:component-did-update" | "flow:render";

interface BaseProps {
  events?: Record<string, EventListener>
  attrs?: Record<string, string>
  className?: string
  [key: string]: unknown
}

type Children = Record<string, Block | Block[]>;

export default class Block<
  T extends BaseProps = BaseProps, 
  C extends Children = Children
> {
  props!: T;
  children!: C;
  eventBus!: () => EventBus<BlockEvents>;

  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render",
  } as const;

  _element: HTMLElement | null = null;
  _meta: { tagName: string; props: Partial<T> } | null = null;
  _id = nanoid(6);

  constructor(tagName = "div", propsWithChildren: Partial<T> = {}) {
    const eventBus = new EventBus<BlockEvents>();
    this.eventBus = () => eventBus;

    const { props, children } = this._getChildrenAndProps(propsWithChildren);
    this.children = children as C;

    this._meta = {
      tagName,
      props,
    };

    this.props = this._makePropsProxy(props);
    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  _registerEvents(eventBus: EventBus<BlockEvents>) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  _createResources() {
    if (!this._meta) {
      throw new Error("Meta information is not initialized");
    }

    const { tagName, props } = this._meta;
    this._element = this._createDocumentElement(tagName);
    if (typeof props.className === "string") {
      const classes = props.className.split(" ");
      this._element.classList.add(...classes);
    }

    if (typeof props.attrs === "object") {
      Object.entries(props.attrs).forEach(([attrName, attrValue]) => {
        this._element?.setAttribute(attrName, attrValue as string);
      });
    }
  }

  init() {
    this._createResources();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  _getChildrenAndProps(propsAndChildren: Record<string,unknown>) {
    const children: Record<string, Block | Block[]> = {};
  const props: Partial<T> = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((obj) => {
          if (obj instanceof Block) {
            children[key] = value;
          } else {
            props[key as keyof T] = value as T[keyof T];
          }
        });
        return;
      }
      if (value instanceof Block) {
        children[key] = value;
      } else {
        props[key as keyof T] = value as T[keyof T];
      }
    });

    return { children, props: props as T };
  }

  _componentDidMount() {
    this.componentDidMount();
  }

  componentDidMount() {}

  dispatchComponentDidMount() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  _componentDidUpdate(oldProps: Record<string,unknown>, newProps: Record<string,unknown>) {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }

  componentDidUpdate(oldProps: Record<string,unknown>, newProps: Record<string,unknown>): boolean {
    if (oldProps && newProps) return true;
    return true
  }

  componentWillUnmount() {}

  setProps(newProps: Partial<T>) {
    if (!newProps) {
      return;
    }
    Object.assign(this.props, newProps);
  }

  get element() {
    return this._element;
  }

  _addEvents() {
    const { events = {} } = this.props as unknown as { events: Record<string, EventListener> };
    Object.keys(events).forEach((eventName) => {
      this._element?.addEventListener(eventName, events[eventName]);
    });
  }

  _removeEvents() {
    const { events = {} } = this.props as unknown as { events: Record<string, EventListener> };
    Object.keys(events).forEach((eventName) => {
      this._element?.removeEventListener(eventName, events[eventName]);
    });
  }

  _compile() {
    const propsAndStubs = { ...this.props } as Record<string,unknown>;

    Object.entries(this.children).forEach(([key, child]) => {
      if (Array.isArray(child)) {
        propsAndStubs[key] = child.map(
          (component) => `<div data-id="${component._id}"></div>`,
        );
      } else {
        propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
      }
    });

    const fragment = this._createDocumentElement("template") as HTMLTemplateElement;
    const template = Handlebars.compile(this.render());
    fragment.innerHTML = template(propsAndStubs);

    Object.values(this.children).forEach((child) => {
      if (Array.isArray(child)) {
        child.forEach((component) => {
          const stub = fragment.content.querySelector(
            `[data-id="${component._id}"]`,
          );
          const content = component.getContent();
          if (content && stub) {
            stub.replaceWith(content);
          }
        });
      } else {
        const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
        const content = child.getContent();
        if (content && stub) {
          stub.replaceWith(content);
        }
      }
    });

    return fragment.content;
  }

  _render() {
    this._removeEvents();
    const block = this._compile();

    if (this._element && this._element.children.length === 0) {
      this._element.appendChild(block);
    } else if (this._element) {
      this._element.replaceChildren(block);
    }

    this._addEvents();
  }

  render(): string {
    return "";
  }

  getContent() {
    return this.element;
  }

  _makePropsProxy(props: T): T {
    const eventBus = this.eventBus();
    const emitBind = eventBus.emit.bind(eventBus);

    return new Proxy(props, {
      get(target, prop) {
        const value = target[prop as keyof T];
        return typeof value === "function" ? value.bind(target) : value;
      },
      set(target, prop, value) {
        const oldTarget = { ...target };
        target[prop as keyof T] = value;
        emitBind(Block.EVENTS.FLOW_CDU, oldTarget, target);
        return true;
      },
      deleteProperty() {
        throw new Error('Access denied');
      },
    });
  }

  _createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  show() {
    if (this._element) {
      this._element.style.display = "flex";
    }
  }

  close() {
    if (this._element) {
      this._element.style.display = "none";
    }
  }

  addChildren(block: Block, name: string) {
    if (!(block instanceof Block)) throw new Error(`block arg: ${block} must be an instance of class Block.`);
    (this.children as Record<string, Block | Block[]>)[name] = block;
    this._render();
    block._element?.scrollIntoView({ behavior: 'smooth' });
  }

  prependChildren(block: Block, name: string) {
    if (!(block instanceof Block)) throw new Error(`block arg: ${block} must be an instance of class Block.`);
    this.children = { [name]: block, ...this.children };
    this._render();
    
    const keys = Object.keys(this.children);
    const lastMes = keys.length > 1 ? keys[keys.length - 2] : keys[0];

    if (lastMes && this.children[lastMes] instanceof Block) {
      const content = this.children[lastMes].getContent();
      if (content) {
        content.scrollIntoView();
      }
    }
  }

  removeChildren(name: string) {
    if (!this.children[name]) throw new Error(`${name} is either not a child of ${this} or doesn't exist.`);
    delete this.children[name];
    this._render();
  }
}
