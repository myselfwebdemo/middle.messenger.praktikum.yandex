import Block from "core/Block";

interface eProps {
    src: string
    alt: string
    ernum: string
}
export default class e extends Block {
    constructor(props: eProps) {
        super('div', {
            ...props,
        })
    }
    public render(): string {
        return `
            <img id="error-image" src="/assets/{{src}}" alt="{{alt}}">
            <h1 class="error-title">{{ernum}}</h1>
        `
    }
}
