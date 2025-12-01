// @ts-nocheck
import EventBus from "./EventBus";
import { nanoid } from "nanoid";
import Handlebars from "handlebars";
export default class Block<T extends Record<string, any> = any, C extends Record<string, Block | Block[]> = Record<string, Block | Block[]>> {
  props!: T;
  children!: C;
  
  static EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render",
  };

  _element = null;
  _meta = null;
  _id = nanoid(6);

  /** JSDoc
   * @param {string} tagName
   * @param {Object} props
   *
   * @returns {void}
   */
  constructor(tagName = "div", propsWithChildren = {}) {
    const eventBus = new EventBus();
    this.eventBus = () => eventBus;

    const { props, children } = this._getChildrenAndProps(propsWithChildren);
    this.children = children;

    this._meta = {
      tagName,
      props,
    };

    this.props = this._makePropsProxy(props);
    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }
  _registerEvents(eventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }
  _createResources() {
    const { tagName, props } = this._meta;
    this._element = this._createDocumentElement(tagName);
    if (typeof props.className === "string") {
      const classes = props.className.split(" ");
      this._element.classList.add(...classes);
    }

    if (typeof props.attrs === "object") {
      Object.entries(props.attrs).forEach(([attrName, attrValue]) => {
        this._element.setAttribute(attrName, attrValue);
      });
    }
  }
  init() {
    this._createResources();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }
  _getChildrenAndProps(propsAndChildren) {
    const children = {};
    const props = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((obj) => {
          if (obj instanceof Block) {
            children[key] = value;
          } else {
            props[key] = value;
          }
        });

        return;
      }
      if (value instanceof Block) {
        children[key] = value;
      } else {
        props[key] = value;
      }
    });

    return { children, props };
  }
  _componentDidMount() {
    this.componentDidMount();
  }
  componentDidMount(oldProps) {}
  dispatchComponentDidMount() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }
  _componentDidUpdate(oldProps, newProps) {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }
  componentDidUpdate(oldProps, newProps) {
    return true;
  }
  componentWillUnmount(): void;
  setProps(newProps) {
    if (!newProps) {
      return;
    }
    Object.assign(this.props, newProps);
  }
  get element() {
    return this._element;
  }
  _addEvents() {
    const { events = {} } = this.props;
    Object.keys(events).forEach((eventName) => {
      this._element.addEventListener(eventName, events[eventName]);
    });
  }
  _removeEvents() {
    const { events = {} } = this.props;

    Object.keys(events).forEach((eventName) => {
      this._element.removeEventListener(eventName, events[eventName]);
    });
  }
  _compile() {
    const propsAndStubs = { ...this.props };

    Object.entries(this.children).forEach(([key, child]) => {
      if (Array.isArray(child)) {
        propsAndStubs[key] = child.map(
          (component) => `<div data-id="${component._id}"></div>`,
        );
      } else {
        propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
      }
    });

    const fragment = this._createDocumentElement("template");
    const template = Handlebars.compile(this.render());
    fragment.innerHTML = template(propsAndStubs);

    Object.values(this.children).forEach((child) => {
      if (Array.isArray(child)) {
        child.forEach((component) => {
          const stub = fragment.content.querySelector(
            `[data-id="${component._id}"]`,
          );

          stub?.replaceWith(component.getContent());
        });
      } else {
        const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);

        stub?.replaceWith(child.getContent());
      }
    });

    return fragment.content;
  }
  _render() {
    this._removeEvents();
    const block = this._compile();

    if (this._element.children.length === 0) {
      this._element.appendChild(block);
    } else {
      this._element.replaceChildren(block);
    }

    this._addEvents();
  }
  render() {
    return "";
  }
  getContent() {
    return this.element;
  }
  _makePropsProxy(props) {
    const eventBus = this.eventBus();
    const emitBind = eventBus.emit.bind(eventBus);

    return new Proxy(props as any, {
      get(target, prop) {
        const value = target[prop];
        return typeof value === "function" ? value.bind(target) : value;
      },
      set(target, prop, value) {
        const oldTarget = { ...target }; // <—— cloneDeep
        target[prop] = value;

        // Запускаем обновление компоненты 
        // Плохой cloneDeep, в следующей итерации нужно заставлять добавлять cloneDeep им самим
        emitBind(Block.EVENTS.FLOW_CDU, oldTarget, target);
        return true;
      },
      deleteProperty() {
        throw new Error('Access denied');
      },
    });
  }
  _createDocumentElement(tagName) {
    return document.createElement(tagName);
  }
  show() {
    this.getContent().style.display = "flex";
  }
  close() {
    this.getContent().style.display = "none";
  }
  addChildren(block, name) {
    if (!(block instanceof Block)) throw new Error(`block arg: ${block} must be an instance of class Block.`);
    this.children[name] = block;
    this._render();
    this.children[name]._element.scrollIntoView({behavior: 'smooth'});
  }
  prependChildren(block, name) {
    if (!(block instanceof Block)) throw new Error(`block arg: ${block} must be an instance of class Block.`);
    this.children = { [name]: block, ...this.children };
    this._render();
    
    const keys = Object.keys(this.children);
    const lastMes = keys.length > 1 ? keys[keys.length - 2] : keys[0];

    if (lastMes && this.children[lastMes]._element) {
      this.children[lastMes]._element.scrollIntoView();
    }
  }
  removeChildren(name) {
    if (!this.children[name]) throw new Error(`${name} is either not a child of ${this} or doesn't exist.`);
    const remObj = Object.keys(this.children).indexOf(name);
    delete this.children[name];
    this._render();
  }    
}
