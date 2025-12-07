import { expect } from "chai";
import Handlebars from "handlebars";
import registerComponent from "./registerComponents.ts";
import Block from "./Block.ts";

describe("Template registration (шаблонизатор)", () => {
    class TestBlock extends Block {
        id: string
        constructor(props: any = {}) {
        super("div", props);
        this.id = 'test-block';
        }
        render() {
        return `<p>{{text}}</p>`;
        }
    }

    beforeEach(() => {
        Object.keys(Handlebars.helpers).forEach(key => {
            delete (Handlebars.helpers as any)[key];
        });
    });

    it("should register a helper with the component name", () => {
        registerComponent(TestBlock);

        expect(Handlebars.helpers).to.have.property("TestBlock");
    });

    it("should instantiate a component when the helper is called", () => {
        registerComponent(TestBlock);

        const template = Handlebars.compile(`{{TestBlock text="hello"}}`);
        const root: any = { children: {}, refs: {} };
        template({}, { data: { root } });

        const keys = Object.keys(root.children);
        expect(keys.length).to.equal(1);

        const instance = root.children[keys[0]];
        expect(instance).to.be.instanceOf(TestBlock);
        expect(instance.props.text).to.equal("hello");
    });

    it("should replace placeholders in hash with actual props", () => {
        registerComponent(TestBlock);

        const template = Handlebars.compile(`{{TestBlock text="{{text}}"}}`);
        const root: any = { children: {}, refs: {} };
        template({ text: "world" }, { data: { root } });

        const keys = Object.keys(root.children);
        const instance = root.children[keys[0]];

        expect(instance.props.text).to.equal("world");
    });

    it("should store the content in refs if ref is provided", () => {
        registerComponent(TestBlock);

        const template = Handlebars.compile(`{{{TestBlock text="hello" ref="myRef"}}}`);
        const root: any = { children: {}, refs: {} };
        const result = template({}, { data: { root } });
        
        const keys = Object.keys(root.children);
        const component = root.children[keys[0]];

        expect(root.refs).to.have.property("myRef");
        expect(root.refs["myRef"]).to.equal(root.children[Object.keys(root.children)[0]].getContent());
        expect(result).to.include(`data-id="${component.id}"`);
    });
});
