import Block from "./Block.ts";
import Handlebars, { type HelperOptions } from "handlebars";

type PropsBlock = Record<string, unknown>;
interface BlockConstructable<P = PropsBlock> {
  new (props: P): Block & { id: string };
}

export default function registerComponent<Props extends PropsBlock>(Component: BlockConstructable<Props>) {
  Handlebars.registerHelper(
    Component.name,
    function (
      this: Props,
      { hash: { ref, ...hash }, data, fn }: HelperOptions,
    ) {
      if (!data.root.children) {
        data.root.children = {};
      }

      if (!data.root.refs) {
        data.root.refs = {};
      }

      const { children, refs } = data.root;

      Object.keys(hash).forEach((key: keyof Props) => {
        if (this[key] && typeof this[key] === "string") {
          hash[key] = hash[key].replace(
            new RegExp(`{{${String(key)}}}`, "i"),
            this[key],
          );
        }
      });

      const component = new Component(hash);

      children[component.id] = component;

      if (ref) {
        refs[ref] = component.getContent();
      }

      const contents = fn ? fn(this) : "";

      return `<div data-id="${component.id}">${contents}</div>`;
    },
  );
}
