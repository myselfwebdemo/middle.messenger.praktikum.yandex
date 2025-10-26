import Block from "../../core/block";

interface ImageProps {
    class: string
    src: string
    alt: string
}
export default class Image extends Block {
    constructor(props: ImageProps) {
        super('img', {
            ...props,
            className: `app-img _${props.class}`,
            attrs: {
                src: `/assets/${props.src}`,
                alt: props.alt
            }
        })
    }
    public render(): string {
        return ``
    }
}